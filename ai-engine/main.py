"""
AI Sales Pilot — AI Engine
STT (Speech-to-Text) + LLM Tahlil Tizimi
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import httpx
import psycopg2
from openai import OpenAI

from config import OPENAI_API_KEY, DATABASE_URL, DASHBOARD_URL

app = FastAPI(
    title="AI Sales Pilot — Engine",
    description="Audio suhbatlarni tahlil qiluvchi AI tizimi",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# OpenAI client
client = OpenAI(api_key=OPENAI_API_KEY) if OPENAI_API_KEY else None


# ========== MODELS ==========

class AnalyzeRequest(BaseModel):
    callId: str
    audioUrl: str


class AnalyzeResponse(BaseModel):
    callId: str
    score: int
    summary: str
    transcript: str


# ========== DATABASE HELPER ==========

def get_db_connection():
    """PostgreSQL ulanish"""
    return psycopg2.connect(DATABASE_URL)


def update_analysis_in_db(call_id: str, score: int, summary: str, transcript: str):
    """AI tahlil natijasini bazaga yozish"""
    conn = get_db_connection()
    cur = conn.cursor()
    
    try:
        # AiAnalysis jadvaliga yozish
        cur.execute("""
            INSERT INTO "AiAnalysis" (id, "callId", score, summary, transcript, "createdAt")
            VALUES (gen_random_uuid(), %s, %s, %s, %s, NOW())
            ON CONFLICT ("callId") DO UPDATE 
            SET score = EXCLUDED.score, summary = EXCLUDED.summary, transcript = EXCLUDED.transcript
        """, (call_id, score, summary, transcript))
        
        # CallRecord statusini yangilash
        cur.execute("""
            UPDATE "CallRecord" SET status = 'COMPLETED' WHERE id = %s
        """, (call_id,))
        
        conn.commit()
    except Exception as e:
        conn.rollback()
        raise e
    finally:
        cur.close()
        conn.close()


# ========== STT (SPEECH-TO-TEXT) ==========

async def transcribe_audio(audio_url: str) -> str:
    """Audio faylni matnga aylantirish (OpenAI Whisper)"""
    if not client:
        raise HTTPException(status_code=500, detail="OpenAI API kaliti sozlanmagan")
    
    # Audio faylni yuklab olish
    async with httpx.AsyncClient() as http_client:
        response = await http_client.get(audio_url, follow_redirects=True)
        if response.status_code != 200:
            raise HTTPException(status_code=400, detail="Audio faylni yuklab bo'lmadi")
        audio_bytes = response.content
    
    # Vaqtincha faylga saqlash
    temp_path = f"/tmp/audio_{hash(audio_url)}.mp3"
    with open(temp_path, "wb") as f:
        f.write(audio_bytes)
    
    # Whisper API orqali transkripsiya
    with open(temp_path, "rb") as audio_file:
        transcription = client.audio.transcriptions.create(
            model="whisper-1",
            file=audio_file,
            language="uz",  # O'zbek tili
            response_format="text"
        )
    
    # Vaqtincha faylni o'chirish
    import os
    os.remove(temp_path)
    
    return transcription


# ========== LLM TAHLIL ==========

ANALYSIS_PROMPT = """Sen professional sotuv tahlilchisi va coach (o'qituvchi) sifatida ish ko'rayapsan.

Quyida sotuvchi va mijoz o'rtasidagi telefon suhbati matni berilgan. Uni sinchiklab tahlil qil va quyidagilarni qil:

1. **BAL BER (1 dan 5 gacha):**
   - 5 BALL = A'lo suhbat. Skriptga 100% amal qilgan, e'tirozlarni professional ishlagan.
   - 4 BALL = Yaxshi, lekin kichik imkoniyatlar boy berilgan (cross-sell aytilmagan va h.k).
   - 3 BALL = O'rtacha. E'tirozlarga javob bera olmagan, sotuv ehtimoli past.
   - 2 BALL = Yomon. Mijoz asabiylashgan yoki sotuvchi tutilib qolgan.
   - 1 BALL = Kritik yomon. Qo'pollik, kompaniya obro'siga ziyon.

2. **XULOSA YOZ (3-4 gap bilan):**
   Nimada yaxshi ish qildi? Nimada xato qildi? Nima qilsa yaxshiroq bo'lardi?

Javobni FAQAT quyidagi formatda ber (boshqa hech narsa yozma):
BALL: [raqam]
XULOSA: [matn]
"""


async def analyze_with_llm(transcript: str) -> tuple[int, str]:
    """LLM yordamida suhbatni tahlil qilish"""
    if not client:
        raise HTTPException(status_code=500, detail="OpenAI API kaliti sozlanmagan")
    
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": ANALYSIS_PROMPT},
            {"role": "user", "content": f"Suhbat matni:\n\n{transcript}"}
        ],
        temperature=0.3,
        max_tokens=500
    )
    
    result = response.choices[0].message.content or ""
    
    # Natijani parse qilish
    score = 3  # default
    summary = "Tahlil natijalari mavjud emas"
    
    for line in result.strip().split("\n"):
        line = line.strip()
        if line.startswith("BALL:"):
            try:
                score = int(line.replace("BALL:", "").strip())
                score = max(1, min(5, score))  # 1-5 orasida
            except ValueError:
                score = 3
        elif line.startswith("XULOSA:"):
            summary = line.replace("XULOSA:", "").strip()
    
    return score, summary


# ========== API ENDPOINTS ==========

@app.get("/api/health")
async def health_check():
    """Server holati"""
    return {
        "status": "ok",
        "engine": "AI Sales Pilot",
        "openai_configured": bool(OPENAI_API_KEY),
        "database_configured": bool(DATABASE_URL)
    }


@app.post("/api/analyze", response_model=AnalyzeResponse)
async def analyze_call(request: AnalyzeRequest):
    """
    Asosiy endpoint: Audio suhbatni tahlil qilish
    
    1. Audio URL dan faylni yuklab oladi
    2. Whisper API orqali matnga aylantiradi (STT)
    3. GPT-4o-mini orqali tahlil qiladi va 1-5 ball beradi
    4. Natijani bazaga yozadi
    """
    try:
        # 1. STT — Ovozni matnga aylantirish
        transcript = await transcribe_audio(request.audioUrl)
        
        if not transcript or len(transcript.strip()) < 10:
            raise HTTPException(
                status_code=400, 
                detail="Audio fayldan matn ajratib bo'lmadi (juda qisqa yoki shovqinli)"
            )
        
        # 2. LLM — Tahlil qilish
        score, summary = await analyze_with_llm(transcript)
        
        # 3. Bazaga yozish
        update_analysis_in_db(
            call_id=request.callId,
            score=score,
            summary=summary,
            transcript=transcript
        )
        
        return AnalyzeResponse(
            callId=request.callId,
            score=score,
            summary=summary,
            transcript=transcript
        )
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Tahlilda xato: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001, reload=True)
