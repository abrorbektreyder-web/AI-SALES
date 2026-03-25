import os
from dotenv import load_dotenv

load_dotenv()

# Groq API kaliti
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")

# Database URL (Prisma bilan bitta baza)
DATABASE_URL = os.getenv("DATABASE_URL", "")

# Dashboard URL (Next.js callback uchun)
DASHBOARD_URL = os.getenv("DASHBOARD_URL", "http://localhost:3000")
