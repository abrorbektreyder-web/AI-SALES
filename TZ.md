# 📋 TEXNIK TOPSHIRIQ (TZ): "AI SALES PILOT" (PRO VERSION)

## 1. LOYIHA HAQIDA VA U HAL QILADIGAN MUAMMO (KIRISH)

**Qanday muammoni hal qiladi?**
Odatda katta (100+ xodimga ega) yoki o'rta sotuv bo'limlarida Sotuv rahbari (ROP) barcha qo'ng'iroqlarni eshitish jismonan imkonsiz. Natijada:
1. Qaysi xodim nima sababdan sota olmayotgani sirligicha qoladi.
2. Xodimlarga o'z vaqtida shaxsiy qayta aloqa (feedback) berilmaydi, ular o'z xatolarini bilmay, bir xil xatoni takrorlayveradilar.
3. Rahbar xodimlarni nazorat qilish o'rniga faqat natijaga ko'nika boshlaydi.

**AI SALES PILOT ning yechimi:**
Har bir xodim jamoaga qo'shiladi va o'z telefoniga maxsus ilovani o'rnatib, barcha mijozlarga shu ilova orqali qo'ng'iroq qiladi. Qo'ng'iroq tugagach, audio yozuv fonda (serverda) avtomatik matnga aylantiriladi. AI esa uni tahlil qilib, suhbatni **1 dan 5 ballgacha** baholaydi. Natijada xodim o'z xotasini o'qiydi va tavsiya etilgan darsni ko'radi. Bularning barchasi ROP uchun **Premium, vizual ko'zga yoqimli va tushunarli №1 dashboard'da** tayyor reytinglar qilib chiqarib beriladi.

---

## 2. TEXNOLOGIYALAR STEKI (ENG OPTIMAL VA TEZ ISHLOVCHI)

Loyiha professional, uzluksiz, va №1 bo'lishi uchun bozordagi eng zamonaviy texnologiyalardan foydalaniladi:

*   **Mobil Ilova (Xodimlar uchun): `Flutter` yoki `React Native`**
    *Sabab:* Ikkala platformada (iOS va Android) ham bitta kod yordamida tez va muammosiz ishlaydi. SIP protokollari qulay integratsiya qilinadi.
*   **Backend & AI Engine: `Python (FastAPI)`**
    *Sabab:* Audio fayllarni ishlash, AI modellarini API orqali chaqirish va juda tezkor, asinxron so'rovlarni bajarishda eng optimal tanlov. Tizim og'irlashib ketmaydi.
*   **Frontend (ROP Dashboard): `Next.js (React)` + `Tailwind CSS` + `Shadcn UI`**
    *Sabab:* Jahon darajasidagi chiroyli, premium darajadagi interfeys (UI) xuddi shu qulayliklarda quriladi. Grafiklar va infografikalar tushunarli bo'ladi.
*   **DB va Fayllar: `PostgreSQL` + `Amazon S3`**
    *Sabab:* Asosiy ma'lumotlar PostgreSQL'da tezkor o'qiladi, yuzlab gigabaytli audio yozuvlar tezkor va arzon bulutda (S3) saqlanadi.
*   **AI Modellari:**
    *   *STT (Ovozdan matnga):* Whisper API yoki o'zbek tili uchun sozlangan lokal ochiq kodli modellar.
    *   *LLM (Tahlil qilish):* OpenAI GPT-4o-mini (judayam tez va hamyonbop) yoki o'zimizning serverdagi Llama-3 (8B).

---

## 3. AI BAHOLASH VA O'LCHOV TIZIMI (1 DAN 5 GACHA)

AI har bir suhbatni quyidagi standart o'lchov bo'yicha tahlil qiladi (Ballar Dashboardda mos ranglarda aks etadi):

*   🟢 **5 BALL - SUPER:** A'lo suhbat! Sotuvchi mijoz bilan ajoyib muloqot qildi, e'tirozlarni to'g'ri ishladi, skriptga 100% amal qildi.
*   🟡 **4 BALL - YAXSHI (Ammo o'z ustingda ishla):** Mijoz bilan ishlangan, savdo qilingan, biroq kichik imkoniyatlar boy berilgan (masalan: ikkilamchi mahsulot (Cross-sell) aytilmadi).
*   🟠 **3 BALL - YOMON:** Sotuvchi qo'pollik qilmagan bo'lsa-da, e'tirozlarga umuman javob bera olmagan, sotuv ehtimoli past. AI xatoning sababini ko'rsatadi.
*   🔴 **2 BALL - JUDA YOMON (Zudlik bilan ishlash kerak):** Mijoz asabiylashgan yoki sotuvchi savollarga tutilib qolgan, skript butunlay buzilgan. ROP uchun signal.
*   🩸 **1 BALL - KRITIK YOMON:** Sotuvchi qo'pollik qilgan, kompaniya obro'siga ziyon yetkazgan. Suvbat qizil zona sifatida zudlik bilan ROPga yuboriladi.

**AI qaytaradigan o'zgaruvchilar parametri:**
1. Bali (1-5)
2. Xulosa (Qisqa va aniq tekst: Qayerda xato bo'ldi?)
3. Tavsiya dars (Xatoni yopish uchun tayyor video yoki matnli dars linki).

---

## 4. UI / UX VA VIZUAL TALABLAR

*   **Sotuvchi Ilovasi:** Minimalistik, ortiqcha narsalarsiz. Katta terish oynasi. "Mening reytingim" sahifasida bugungi ballari ranglarda ko'rinadi. Past olgan bo'lsa oynada "Tavsiya darslar" yashnab turadi.
*   **ROP Dashboard:** Qop-qora (Dark mode) yoki toza oq fonda ishlangan zamonaviy Glassmorphism stilida. Tizimga kirishi bilan butun bo'lim reytingi (Leaderboard), bugungi necha foiz qo'ng'iroq 4-5 ball, necha foizi 1-2 ball ekani xaritalarda turadi. 
*   **Audio Pleyer:** Ovoz to'lqinlari shaklida SoundCloud kabi yasaladi. Mijoz qachon gapirgan, xodim qachon gapirganligi rangli chiziqlarda turadi va pastida AIning xulosasi aks etadi.

---

## 5. DETALLASHGAN AMALGA OSHIRISH FAZALARI (CHECKLIST)

Loyiha jarayonida adashmaslik va oson nazorat qilish uchun har bir faza belgilab (✅) boriladi.

### 1-Faza: Arxitektura va Dizayn 
- [x] 1.1. Barcha ekranlarning UI/UX dizaynini (Figma'da) prototip qilish (Mobile App + Dashboard).
- [x] 1.2. Database (PostgreSQL) va Arxitektura Sxemasi sxemasini (Schema) chizish.
- [x] 1.3. Boshlang'ich proyekt strukturasi va server (VPS/Cloud) tayyorlash (CI/CD setup).

### 2-Faza: Mobil Ilova va Backend API (MVP - Call Recording)
- [ ] 2.1. Sotuvchilar tizimga kirishi (Login/Auth) va shaxsiy kabinetini Backend'ga ulash.
- [ ] 2.2. Mobil ilova ichida SIP Mijozini (Softphone) o'rnatish.
- [ ] 2.3. Qo'ng'iroq amalga oshishi va tugashi bilan `.mp3` yoki `.wav` fayl tarzida Backend'ga (S3 ga) yuborilishini sozlash.
- [ ] 2.4. Dashboard'da ROP kelib tushgan yozuvlarni audiosi bilan eshita olishini ta'minlash (Oddiy Pleyer).

### 3-Faza: AI Tahlil Tizimi (Engine Core)
- [ ] 3.1. STT (Speech-to-Text) integratsiyasi: Audio faylni fonda qabul qilib, uni tekstga o'girib DB ga yozish.
- [ ] 3.2. LLM (AI Tahlilchi) Promtini yaratish: AI o'girilgan tekstni o'qib unga 1-5 gacha ball berish logikasini o'rgatish (Prompt Engineering).
- [ ] 3.3. Xulosa (Summary) va bahoni tizim bazasiga kiritish va API orqali chiqarish.
- [ ] 3.4. Darsliklar tavsiya qilish algoritmi: AI ko'rgan xatosiga mos Dars ID (URL) ni bazadan topib biriktirishi.

### 4-Faza: ROP Premium Dashboard
- [x] 4.1. Next.js da ROP Dashboard'ning asosiy layoutlarini qurish.
- [x] 4.2. "Leaderboard" (Xodimlar reytingi) hisobot ekranini jonlantirish (Backenddan datalar olish).
- [x] 4.3. "Suhbatlar analitikasi" sahifasini qurish: qo'ng'iroqlar jadvali (qizil, yashil, sariq) filtrini yaratish.
- [x] 4.4. Ilg'or Audio Pleyer: Ovozlarni va tegida AI xulosasini ko'rsatish funksiyasini ulash.

### 5-Faza: Mobil Ilova (Sotuvchilar) Qayta aloqa modullari
- [ ] 5.1. Sotuvchi ilovasida "Mening qo'ng'iroqlarim" va xulosalar tarixi sahifalarini ulash.
- [ ] 5.2. Ilova ichida tavsiya yetilgan videolarni/darslarni ko'rish "Skill Up" imkoniyati.
- [ ] 5.3. Real time Socket orqali: Qo'ng'iroq qilib bo'lgandan so'ng 1-2 daqiqada push-notification kelishi ("AI sizning suhbatingizni 4 ballga baholadi").

### 6-Faza: Tozalash, Testlash va Alfa ishga tushirish
- [ ] 6.1. Stres-test (Bir vaqtda 50+ qo'ng'iroq bo'lsa server STT ga qanday dosh berishini tekshirish).
- [ ] 6.2. UI/UX detallar, mikroanimatsiyalar, "premium" feeling hislarini shakllantirish va chiroylilashtirish.
- [ ] 6.3. Alpha test: Bitta sotuv bo'limida ishlatib ko'rish va xatolarini (bug fix) to'g'rilash.
- [ ] 6.4. Loyihani jonli obunalarga (Production) ochish.

---
Hujjat yakuni.
Dasturlash jamoasi ushbu ro'yxatni Trello/Jira kabi tizimlarga bo'lib ishlashni boshlashi mumkin. Har bir Faza tugatilishi [✅] qilib belgilanib boriladi.
