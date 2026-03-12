# AI Sales Pilot — AI Engine (FastAPI)

Bu papka AI tahlil tizimining backend qismidir.
Audio fayllarni STT (Speech-to-Text) orqali matnga aylantiradi va LLM yordamida tahlil qiladi.

## Texnologiyalar
- Python 3.11+
- FastAPI
- OpenAI Whisper (STT)
- OpenAI GPT-4o-mini (LLM tahlil)
- PostgreSQL (Prisma bilan aloqa)

## O'rnatish

```bash
cd ai-engine
python -m venv venv
venv\Scripts\activate   # Windows
pip install -r requirements.txt
```

## Ishga tushirish

```bash
uvicorn main:app --reload --port 8001
```

## API Endpoints

- `POST /api/analyze` — Audio faylni tahlil qilish (callId, audioUrl)
- `GET /api/health` — Server holati
