import os
from dotenv import load_dotenv

load_dotenv()

# OpenAI API kaliti
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")

# Database URL (Prisma bilan bitta baza)
DATABASE_URL = os.getenv("DATABASE_URL", "")

# Dashboard URL (Next.js callback uchun)
DASHBOARD_URL = os.getenv("DASHBOARD_URL", "http://localhost:3000")
