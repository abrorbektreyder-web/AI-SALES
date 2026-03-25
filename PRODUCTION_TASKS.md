# AI SALES PILOT - Jonli Ishga Tushirish (Production) Rejasi

Loyiha hozirgi Demo/Test holatidan to'liq va real "Production" holatiga o'tishi uchun qilinishi kerak bo'lgan vazifalar ro'yxati (Ba'zilarining asosi qilingan, lekin to'liq bitmagan):

## 1. AI API va Backend Tayyorgarligi (AI Engine)
- [ ] **1. OpenAI API Ulanishi:** FastAPI dagi `.env` fayliga haqiqiy pullik OpenAI (Whisper + GPT-4o) API kalitlarini kiritish va ishlayotganiga amin bo'lish.
- [ ] **2. AI Engine'ni Jonli Serverga O'rnatish:** FastAPI asosidagi loyihani (*ai-engine*) mustaqil serverga (AWS EC2, DigitalOcean, Render yoki Railway) joylashtirish (Vercel Node.js va front uchun mos, Python backend uchun emas).
- [ ] **3. Navbat Tizimi (Job Queues):** Agar 10-20 kishi bir vaqtda qong'iroq qilsa API qotib qolmasligi uchun tahlil jarayonini (Audio -> STT -> LLM) orqa fonda asinxron navbatga (Redis + Celery yoki FastAPI BackgroundTasks) o'tkazish.

## 2. Audio Fayllar bulutli ombori (S3 / Storage)
- [ ] **4. Cloud Storage ochish:** Amazon S3, Supabase Storage yoki Cloudflare R2 dagi serverdan audiolarni saqlash uchun alohida Bucket yaratish.
- [ ] **5. Next.js Yuklash Kodini O'zgartirish:** `dashboard/src/app/api/upload/audio/route.ts` dagi kodni Vercel serverining fayl tizimiga emas (hozirgi `public/uploads`), balki to'ppa-to'g'ri yangi S3 omboriga yuklashga moslashtirib qayta yozish.

## 3. Mobil Ilova Qong'iroqlari va Ovoz Yozish (VoIP / SIP)
- [ ] **6. Ilova ichida SIP ulanish:** Raqam terilganda telefonning o'zini qong'iroq qismiga o'tib ketmasligini to'xtatish. Ilovani o'zida internet orqali aloqaga chiqishi uchun SIP klientski modullarni (Masalan: FreePBX, Zadarma SIP ulanishi) o'rnatish.
- [ ] **7. Avto-Ovoz Yozish:** Suhbat ilova ichida IP-telefoniya (SIP) orqali boshlangan zahoti ovozni yozib olish (Avto-Record) jarayonini zudlik etish.
- [ ] **8. Avtomatik Yuklash:** Qong'iroq yakunlanganda yozilgan audioni (`.mp3` yoki `.wav`) darhol hech qanday tugma bosilmasdan orqa fonda Backend API'siga jo'natish.

## 4. Xavfsizlik va Jonli Sozlamalar (Security & Env)
- [ ] **9. Yopiq CORS Sozlamalari:** AI Engine (FastAPI) dagi va Next.js API'lari (Vercel) dagi xavfsizlik ruxsatnomalarini (CORS) faqat o'zingizning domenlardan kirish mumkin bo'lgan holatga keltirish. Barcha endpointlarga HTTPS (SSL) qo'shilganini ta'minlash.
- [ ] **10. To'liq .env parametrlarni shakllantirish:** Vercel va AI Server uchun ishlab chiqarishga taalluqli barcha `.env` kalitlar (JWT, PostgreSQL DB URL, AI Keys, S3 Credentials) ni himoyalangan tarzda tizimga kiritish.

## 5. Xabarlar va Monitoring (UX & DevOps)
- [ ] **11. Real-time Bildirishnomalar (Push Notifications):** Serverda AI suhbatni eshitib va baholab bo'lgach, foydalanuvchining ilovasiga "Sizning oxirgi suhbatingiz a'lo darajada! 5 Ball" degan push-xabar borishini ta'minlash (Firebase Cloud Messaging yoki Socket.io orqali).
- [ ] **12. Xatolar Monitoringi (Error Tracking):** Ishlayotgan xodimlarda ilova o'chib qolsa yoki server 500 status qaytarsa tizim mutaxassislariga signal kelishi uchun Sentry.io yoki Datadog monitoring vositasini ulab qo'yish.
- [ ] **13. Yakuniy Stres-Test:** Barcha tizim ulanganidan so'ng 10-20 ta qong'iroqni bir vaqtda amalga oshirib Server STT hamda bazadagi javoblarning o'z vaqtida, qotmasdan qaytayotganini tekshirish.
