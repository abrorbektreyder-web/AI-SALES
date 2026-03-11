# ⚠️ LOYIHA QOIDALARI VA ROLLARI (STRICT RULES)

Ushbu hujjat AI SALES PILOT loyihasi ustida ishlaydigan barcha dasturchilar va AI yordamchilar uchun **qat'iy qoidalar to'plami** hisoblanadi. Har qanday ishni boshlashdan oldin ushbu qoidalarga og'ishmay amal qilinishi SHART.

## 1. GIT VA BRANCH (TARMOQ) QOIDALARI
*   **Yangi Branch:** Har qanday yangi vazifani (feature, bugfix, UI o'zgarish) boshlashdan oldin albatta yangi branch (tarmoq) ochilishi shart. `main` yoki `master` branchda to'g'ridan-to'g'ri ishlash **TAQIQLANADI**.
*   **Merge (Birlashtirish):** `main` branchga kodni merge qilish (qo'shish) qat'iyan taqiqlanadi. Faqatgina USER (Loyiha egasi) buyruq bergan holatdagina merge qilinadi.
*   **Push (Serverga yuklash):** Kodni avtomatik tarzda masofaviy serverga (GitHub/GitLab) push qilish taqiqlanadi. Push qilinishi uchun alohida USER ruxsati kerak.

## 2. KODLASH VA O'ZGARTIRISH QOIDALARI
*   **O'z boshimchalik:** Berilgan topshiriqdan tashqari boshqa joydagi kodlarga o'z boshimchalik bilan tegish, fayllar strukturasini ruxsatsiz o'zgartirish **TAQIQLANADI**.
*   **Kodni O'chirish:** Ishlayotgan yoki eskidan yozilgan kodni (garchi xatodek ko'rinsa ham) USER ruxsatisiz o'chirish **TAQIQLANADI**. Faqat kommentariyaga (comment out) olish mumkin.

## 3. HISOBOT VA ALOQA QOIDALARI
*   **Hisobot (Report):** Har bir vazifa (buyruq) bajarib bo'lingach, aniq qanday fayllarga qanday o'zgartirish kiritilgani haqida darhol hisobot (qisqa xulosa) berilishi kerak.

---

### 💡 QO'SHIMCHA TAKLIFLAR (Loyihani xavfsizroq va sifatliroq qilish uchun):

Loyiha juda jiddiy ("Premium" darajasida) bo'lgani uchun, quyidagi 3 ta qo'shimcha qoidani ham qo'shishni tavsiya etaman:

1.  **"Commit" xabarlari formati (Conventional Commits):** Har bir o'zgarishni yozib qo'yayotganimizda (commit qilganda) aniq standartda yozish:
    *   `feat: Dashboard uchun yangi grafika qo'shildi`
    *   `fix: Audio pleyerdagi miltillash to'g'irlandi`
    *   `ui: Tugmalarning hover effekti o'zgartirildi`
    *(Bu kelajakda qachon, nimani o'zgartirganimizni tarixi orqali topishga super qulay bo'ladi).*
2.  **Ishga tushishini tekshirish (Build Test):** Yangi kod yozib, branchda tayyorlaganimdan so'ng, "Bajarildim" deyishdan oldin, albatta dastur xatosiz ishga tushganiga va sahifalar buzilmaganiga ishonch hosil qilish majburiyati.
3.  **Tog'ridan-to'g'ri bog'liqlikni izolyatsiya qilish (Component Isolation):** UI/UX o'zgarishlar qilinganda faqat o'sha komponentaning o'zida yakkalab (izolyatsiyada) o'zgartirish, boshqa sahifalarga qaramog'ini buzmaslik majburiyati bo'lishi.

*(Ushbu taklif qilingan qoidalar sizga ma'qul bo'lsa, bularni ham qat'iy rejim sifatida qabul qilaman).*
