# AI SALES PILOT — To'liq Yo'l Xaritasi (Roadmap)

---

## ✅ FAZA 1 — Asosiy Tizim (85% tayyor)

- [x] **1. Groq API Ulanishi:** `GROQ_API_KEY` (Llama-3 + Whisper-large-v3) Vercel'ga ulandi, AI tahlil ishlaydi.
- [x] **2. AI Engine Serverless:** Python server o'rniga Next.js Vercel Serverless Function ga ko'chirildi.
- [x] **3. Supabase Storage:** Audio fayllar `audio-records` bucket'ga yuklanmoqda.
- [x] **4. Upload API:** `/api/upload/audio` → Supabase Public Bucket'ga yuklaydi.
- [x] **5. AI Tahlil API:** `/api/analyze` → Whisper (STT) + Llama-3 (LLM) ishlaydi.
- [x] **6. ROP Dashboard:** Qo'ng'iroqlar, ball, xulosa, tavsiya dars ko'rinadi.
- [x] **7. Mobil Ilova (Agent):** Reyting, qo'ng'iroqlar tarixi, tavsiya dars ko'rinadi.
- [x] **8. Push Notifications:** AI tahlil tugagach agent ilovasiga xabar boradi.
- [x] **9. QR Login:** Agent mobil ilovaga QR kod orqali kiradi.
- [x] **10. Darslar bazasi:** AI tavsiya qiladigan darslar bazaga seed qilindi.
- [x] **11. SIP Integratsiya (Mobil):** Zadarma (`510156`) SIP client mobil ilovaga ulandi (`sipClient.ts`).
- [ ] **12. Yangi APK Build:** SIP/WebRTC o'zgarishlari uchun yangi `eas build -p android` qilish.

---

## 🔄 FAZA 2 — Browser Dialer / Kompdan Qo'ng'iroq (2-3 kun)

- [ ] **1. Zadarma WebRTC (Brauzer):** Dashboard'ga brauzer uchun `sip.js` + WebRTC Softphone integratsiyasi.
- [ ] **2. Browser Dialer UI:** Dashboard ichiga chiroyli telefon klaviaturasi qo'shish (Sotuvchi kompdan qo'ng'iroq qiladi).
- [ ] **3. Mikrofon Ruxsati:** Brauzer mikrofon ruxsatini so'rash va audio stream olish.
- [ ] **4. Avtomatik Audio Yuklash:** Qo'ng'iroq tugagach audio brauzerdan `/api/upload/audio` ga avtomatik yuborilishi (qo'lda yuklash yo'q!).
- [ ] **5. Zadarma Webhook:** Qo'ng'iroq tugagach Zadarma → `/api/webhook/zadarma` → AI tahlil avtomatik ishga tushishi.
- [ ] **6. Live Holat:** Dashboard'da "Qo'ng'iroq davom etmoqda..." real-time ko'rsatish.

---

## 🏢 FAZA 3 — Multi-Tenant / B2B SaaS (3-5 kun)

- [ ] **1. `Company` Jadvali:** Prisma sxemasiga `Company` modeli qo'shish (nomi, tarif, SIP sozlamalari).
- [ ] **2. User ↔ Company Bog'lanishi:** Har bir `User` (ROP va Agent) bitta `Company` ga tegishli bo'ladi.
- [ ] **3. Ro'yxatdan O'tish Sahifasi:** Yangi firma uchun `/register` sahifasi (Firma nomi, ROP ma'lumotlari).
- [ ] **4. Firma Izolyatsiyasi:** Har bir ROP faqat o'z firmasi agentlari va qo'ng'iroqlarini ko'radi.
- [ ] **5. Firma SIP Sozlamalari:** Har bir firma o'z Zadarma SIP login/parolini Dashboard orqali kiritadi.
- [ ] **6. Super Admin Panel:** Siz (platforma egasi) uchun barcha firmalar va statistikani boshqarish paneli.

---

## 💳 FAZA 4 — Billing / To'lov Tizimi (2-3 kun)

- [ ] **1. Tarif Rejalari:** `Starter` (200k/sotuvchi), `Pro` (150k/sotuvchi 10+), `Enterprise` (kelishiladi).
- [ ] **2. Payme Integratsiyasi:** Oylik obuna to'lovi uchun Payme API ulash.
- [ ] **3. Click Integratsiyasi:** Payme bilan parallel Click to'lov tizimi.
- [ ] **4. Obuna Holati:** `Company` jadvalida `subscriptionStatus`, `billingCycleEnd` maydonlari.
- [ ] **5. Avtomatik Bloklash:** Obuna muddati o'tganda API'lar `403` qaytaradi.
- [ ] **6. To'lov Tarixi:** Dashboard'da firma to'lovlari tarixi va hisob-faktura (Invoice).
- [ ] **7. Trial Davri:** Yangi firmalar uchun **14 kunlik bepul sinov muddati**.
