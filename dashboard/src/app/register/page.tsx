'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, PhoneCall, Building2, User, Lock, ArrowRight, CheckCircle2, Eye, EyeOff, Bot, Mic, ShieldAlert, BarChart3, Users } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AppleStyleLanding() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setTimeout(() => {
        router.push('/');
      }, 2000);
    }, 1500);
  };

  const scrollToRegister = () => {
    document.getElementById('register-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#fbfbfd] text-[#1d1d1f] font-sans selection:bg-[#0071e3]/30">
      
      {/* Absolute Header (Clean, minimalist Apple style) */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-[#e5e5ea] transition-all">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
             <div className="inline-flex items-center justify-center p-1.5 rounded-lg bg-[#0071e3] text-white">
                <PhoneCall className="w-4 h-4" />
             </div>
             <span className="text-lg font-semibold tracking-tight text-[#1d1d1f]">AI SALES PILOT</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/login" className="text-[13px] font-medium text-[#1d1d1f] hover:text-[#0071e3] transition-colors hidden sm:block">
              Tizimga kirish
            </Link>
            <button onClick={scrollToRegister} className="bg-[#0071e3] hover:bg-[#0077ed] text-white font-medium text-[13px] px-4 py-1.5 rounded-full transition-colors">
              Ro'yxatdan o'tish
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-36 pb-24 px-6 max-w-7xl mx-auto bg-[#fbfbfd]">
        <div className="text-center max-w-5xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl sm:text-7xl font-semibold tracking-tighter text-[#1d1d1f] mb-6 leading-[1.05]"
          >
            Sotuv bo'limingizni 100%<br className="hidden sm:block" /> nazorat ostiga oling.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-xl sm:text-2xl text-[#86868b] mb-10 max-w-3xl mx-auto font-medium tracking-tight"
          >
            10 dan 50 tagacha bo'lgan xodimlaringiz aslida qanday ishlayapti? AI Sales Pilot har bir qo'ng'iroqni avtomatik eshitadi, tahlil qiladi va xatolarni ko'rsatadi. Hech qaysi xaridor e'tiborsiz qolmaydi.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button onClick={scrollToRegister} className="h-12 px-8 rounded-full bg-[#0071e3] text-white font-medium text-[17px] hover:bg-[#0077ed] transition-colors shadow-sm">
              Bepul boshlash
            </button>
            <Link href="/login" className="h-12 px-8 rounded-full bg-transparent text-[#0071e3] font-medium text-[17px] hover:underline transition-colors w-full sm:w-auto text-center flex items-center justify-center">
              Tizimga kirish 
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Value Proposition / Features Section */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16 max-w-3xl mx-auto">
           <h2 className="text-3xl sm:text-5xl font-semibold text-[#1d1d1f] mb-4 tracking-tighter">Barcha ma'lumotlar kaftingizda.</h2>
           <p className="text-[#86868b] text-[19px] font-medium tracking-tight">Katta bizneslarda kim skriptni buzyotgani, qayerda mijoz qo'ldan chiqayotganini aniqlash imkonsiz edi. AI Sales Pilot — shu muammoning zamonaviy yechimi.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="bg-white rounded-3xl p-10 hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] shadow-[0_4px_20px_rgba(0,0,0,0.04)] transition-shadow duration-500 border border-[#f5f5f7]">
              <div className="w-12 h-12 rounded-full bg-[#f5f5f7] flex items-center justify-center mb-6">
                <Mic className="w-6 h-6 text-[#1d1d1f]" />
              </div>
              <h3 className="text-2xl font-semibold text-[#1d1d1f] mb-3 tracking-tight">Ovozdan Matnga</h3>
              <p className="text-[#86868b] leading-relaxed text-[15px] font-medium">Sotuvchi mobil ilovadan tel qilishi bilan barcha suhbatlar yuqori aniqlikda, o'zbek tilida matnga o'giriladi.</p>
           </div>
           
           <div className="bg-white rounded-3xl p-10 hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] shadow-[0_4px_20px_rgba(0,0,0,0.04)] transition-shadow duration-500 border border-[#f5f5f7]">
              <div className="w-12 h-12 rounded-full bg-[#f5f5f7] flex items-center justify-center mb-6">
                <Bot className="w-6 h-6 text-[#1d1d1f]" />
              </div>
              <h3 className="text-2xl font-semibold text-[#1d1d1f] mb-3 tracking-tight">Sun'iy Intellekt tahlili</h3>
              <p className="text-[#86868b] leading-relaxed text-[15px] font-medium">GPT modellari har bir gapni o'qiydi. "Sotuvchi qo'pol gapirdimi? Etirozni yopdimi?" kabi mezonlar bilan 1 dan 5 gacha aniq baholaydi.</p>
           </div>

           <div className="bg-white rounded-3xl p-10 hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] shadow-[0_4px_20px_rgba(0,0,0,0.04)] transition-shadow duration-500 border border-[#f5f5f7]">
              <div className="w-12 h-12 rounded-full bg-[#f5f5f7] flex items-center justify-center mb-6">
                <BarChart3 className="w-6 h-6 text-[#1d1d1f]" />
              </div>
              <h3 className="text-2xl font-semibold text-[#1d1d1f] mb-3 tracking-tight">Rahbar hisoboti</h3>
              <p className="text-[#86868b] leading-relaxed text-[15px] font-medium">Tizim orqali kunning eng muammoli va eng muvaffaqiyatli suhbatlarini hamda xodim reytinglarini tayyor grafikda ko'rasiz.</p>
           </div>
        </div>
      </section>

      {/* Registration Section - Sleek and Clean */}
      <section id="register-section" className="py-24 px-6 bg-[#f5f5f7]">
        <div className="max-w-xl mx-auto text-center mb-12">
          <h2 className="text-4xl font-semibold text-[#1d1d1f] tracking-tighter mb-3">Tizimga xush kelibsiz.</h2>
          <p className="text-[#86868b] text-lg font-medium">O'z biznesingiz kelajagi uchun ilk qadamni tashlang.</p>
        </div>

        <div className="w-full max-w-md mx-auto relative z-10">
          {!isSuccess ? (
            <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[#e5e5ea]">
              
              <div className="flex justify-center mb-8">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#0071e3] text-white shadow-md">
                  <PhoneCall className="w-6 h-6" />
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Name */}
                <div className="relative">
                   <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                     <User className="h-5 w-5 text-[#86868b]" />
                   </div>
                   <input
                     type="text"
                     required
                     className="w-full bg-[#fbfbfd] border border-[#d2d2d7] rounded-xl py-3.5 pl-11 pr-4 text-[15px] text-[#1d1d1f] placeholder:text-[#86868b] focus:outline-none focus:border-[#0071e3] focus:ring-4 focus:ring-[#0071e3]/10 transition-all"
                     placeholder="F.I.SH (Ism va familiya)"
                   />
                </div>

                {/* Company */}
                <div className="relative">
                   <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                     <Building2 className="h-5 w-5 text-[#86868b]" />
                   </div>
                   <input
                     type="text"
                     required
                     className="w-full bg-[#fbfbfd] border border-[#d2d2d7] rounded-xl py-3.5 pl-11 pr-4 text-[15px] text-[#1d1d1f] placeholder:text-[#86868b] focus:outline-none focus:border-[#0071e3] focus:ring-4 focus:ring-[#0071e3]/10 transition-all"
                     placeholder="Kompaniya nomi"
                   />
                </div>

                {/* Email */}
                <div className="relative">
                   <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                     <Mail className="h-5 w-5 text-[#86868b]" />
                   </div>
                   <input
                     type="email"
                     required
                     className="w-full bg-[#fbfbfd] border border-[#d2d2d7] rounded-xl py-3.5 pl-11 pr-4 text-[15px] text-[#1d1d1f] placeholder:text-[#86868b] focus:outline-none focus:border-[#0071e3] focus:ring-4 focus:ring-[#0071e3]/10 transition-all"
                     placeholder="Elektron pochta"
                   />
                </div>

                {/* Password Input */}
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-[#86868b]" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    className="w-full bg-[#fbfbfd] border border-[#d2d2d7] rounded-xl py-3.5 pl-11 pr-12 text-[15px] text-[#1d1d1f] placeholder:text-[#86868b] focus:outline-none focus:border-[#0071e3] focus:ring-4 focus:ring-[#0071e3]/10 transition-all"
                    placeholder="Maxfi parol yarating"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#86868b] hover:text-[#1d1d1f] transition-colors focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>

                <motion.button
                  whileTap={{ scale: 0.98 }}
                  disabled={isSubmitting}
                  className="w-full h-14 bg-[#0071e3] text-white rounded-xl font-medium text-[17px] flex items-center justify-center gap-2 mt-6 hover:bg-[#0077ed] transition-colors"
                >
                  {isSubmitting ? (
                     <span className="flex items-center gap-2">
                       <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                       </svg>
                       Bajarilmoqda...
                     </span>
                  ) : (
                    <>
                      Ro'yxatdan o'tish
                    </>
                  )}
                </motion.button>
              </form>

            </div>
          ) : (
             <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               className="bg-white h-[400px] flex flex-col items-center justify-center rounded-3xl p-10 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[#e5e5ea]"
             >
               <div className="w-16 h-16 bg-[#34c759]/10 text-[#34c759] rounded-full flex items-center justify-center mb-6">
                 <CheckCircle2 className="w-8 h-8" />
               </div>
               <h3 className="text-2xl font-semibold text-[#1d1d1f] mb-2 tracking-tight">Muvaffaqiyatli!</h3>
               <p className="text-[#86868b] text-[15px]">Tizimda ro'yxatdan o'tdingiz. Asosiy ish stoliga kiryapsiz...</p>
             </motion.div>
          )}
        </div>
      </section>

      {/* Very Simple Footer */}
      <footer className="py-8 bg-[#f5f5f7] border-t border-[#e5e5ea]">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-[#86868b] text-[13px]">
            Copyright © {new Date().getFullYear()} AI Sales Pilot. Barcha huquqlar himoyalangan.
          </p>
        </div>
      </footer>
    </div>
  );
}
