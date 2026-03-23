'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Activity, Mic, Bot, BarChart3, ArrowRight, CheckCircle2, PhoneIncoming, AlertTriangle, User, Building2, Mail, Lock, Eye, EyeOff, X, PhoneCall } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Helper component for floating UI (No people faces, just UI representations)
const FloatingAudioWave = ({ delay = 0, yOffset = 0 }: { delay?: number, yOffset?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: yOffset + 30 }}
    animate={{ opacity: 1, y: yOffset }}
    transition={{ duration: 0.8, delay, ease: "easeOut" }}
    className="flex items-end gap-1.5 p-4 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl"
  >
    {[40, 60, 30, 80, 50, 90, 40, 70].map((h, i) => (
      <motion.div
        key={i}
        animate={{ height: [`${h}%`, `${h * 0.5}%`, `${h}%`] }}
        transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1, ease: "easeInOut" }}
        className="w-2 bg-[#00a6fb] rounded-full"
        style={{ height: `${h}%` }}
      />
    ))}
  </motion.div>
);

export default function LandingChorusStyle() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const modalRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  // Form states
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (showModal && modalRef.current && !modalRef.current.contains(e.target as Node) && btnRef.current && !btnRef.current.contains(e.target as Node)) {
        setShowModal(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showModal]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          company,
          email,
          phone,
          password,
          role: "ROP"
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "Xatolik yuz berdi");
        return;
      }

      // Token va user saqlash
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setIsSuccess(true);
      setTimeout(() => {
        setShowModal(false);
        router.push("/dashboard");
      }, 2000);
    } catch {
      setErrorMsg("Server bilan bog'lanishda xato");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-800 selection:bg-rose-500/20">

      {/* FIXED NAVBAR */}
      <nav className="fixed top-0 w-full z-50 bg-[#0a1628]/95 backdrop-blur-md border-b border-white/10">
        <div className="max-w-[1300px] mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-rose-600">
              <PhoneIncoming className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">AI SALES PILOT</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-[15px] font-medium text-white/80 hover:text-white transition-colors">Xususiyatlar</Link>
            <Link href="#solutions" className="text-[15px] font-medium text-white/80 hover:text-white transition-colors">Yechimlar</Link>
          </div>
          <div className="flex items-center gap-5">
            <Link href="#footer" className="text-[15px] font-medium text-white/90 hover:text-white transition-colors hidden sm:block">
              Kontakt
            </Link>
            <div className="relative">
              <button
                ref={btnRef}
                onClick={() => { setShowModal(!showModal); setIsSuccess(false); }}
                className="bg-[#e02b20] hover:bg-[#d02015] text-white font-semibold text-[15px] px-6 py-2.5 rounded-lg transition-colors border border-[#e02b20]/20"
              >
                Bepul boshlash
              </button>

              {/* MODAL DROPDOWN FORM */}
              <AnimatePresence>
                {showModal && (
                  <motion.div
                    ref={modalRef}
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    className="absolute right-0 top-[calc(100%+12px)] w-[380px] bg-[#0d1e38] border border-white/15 rounded-2xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)] overflow-hidden z-[100]"
                  >
                    {/* Arrow pointer */}
                    <div className="absolute -top-2 right-8 w-4 h-4 bg-[#0d1e38] border-l border-t border-white/15 transform rotate-45" />

                    {!isSuccess ? (
                      <div className="p-6 relative z-10">
                        <div className="flex items-center justify-between mb-5">
                          <h3 className="text-white font-bold text-lg">Ro'yxatdan o'tish</h3>
                          <button onClick={() => setShowModal(false)} className="text-white/40 hover:text-white transition-colors">
                            <X className="w-5 h-5" />
                          </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-3">
                          {errorMsg && (
                            <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[11px] px-3 py-2 rounded-lg">
                              {errorMsg}
                            </div>
                          )}
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                              <User className="h-4 w-4 text-white/30" />
                            </div>
                            <input 
                              type="text" 
                              required 
                              value={name}
                              onChange={e => setName(e.target.value)}
                              placeholder="F.I.SH (Ism va sharif)" 
                              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#00a6fb] focus:ring-2 focus:ring-[#00a6fb]/20 transition-all font-medium" 
                            />
                          </div>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                              <Building2 className="h-4 w-4 text-white/30" />
                            </div>
                            <input 
                              type="text" 
                              required 
                              value={company}
                              onChange={e => setCompany(e.target.value)}
                              placeholder="Kompaniya nomi" 
                              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#00a6fb] focus:ring-2 focus:ring-[#00a6fb]/20 transition-all" 
                            />
                          </div>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                              <PhoneCall className="h-4 w-4 text-white/30" />
                            </div>
                            <input 
                              type="tel" 
                              required 
                              value={phone}
                              onChange={e => setPhone(e.target.value)}
                              placeholder="Telefon raqami (Asosiy login)" 
                              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#00a6fb] focus:ring-2 focus:ring-[#00a6fb]/20 transition-all font-mono" 
                            />
                          </div>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                              <Mail className="h-4 w-4 text-white/30" />
                            </div>
                            <input 
                              type="email" 
                              value={email}
                              onChange={e => setEmail(e.target.value)}
                              placeholder="Elektron pochta (Ixtiyoriy)" 
                              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#00a6fb] focus:ring-2 focus:ring-[#00a6fb]/20 transition-all" 
                            />
                          </div>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                              <Lock className="h-4 w-4 text-white/30" />
                            </div>
                            <input 
                              type={showPassword ? 'text' : 'password'} 
                              required 
                              value={password}
                              onChange={e => setPassword(e.target.value)}
                              placeholder="Maxfiy parol (Login uchun)" 
                              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-12 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#00a6fb] focus:ring-2 focus:ring-[#00a6fb]/20 transition-all" 
                            />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-slate-300 transition-colors focus:outline-none">
                              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                          </div>
                          <button disabled={isSubmitting} className="w-full h-12 bg-[#e02b20] hover:bg-[#c9241b] text-white rounded-xl font-semibold text-[15px] flex items-center justify-center gap-2 mt-2 transition-colors disabled:opacity-60">
                            {isSubmitting ? (
                              <span className="flex items-center gap-2">
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                Bajarilmoqda...
                              </span>
                            ) : (
                              'Ro\'yxatdan o\'tish'
                            )}
                          </button>
                        </form>
                        <p className="text-center text-white/30 text-xs mt-4">Allaqachon hisobingiz bormi? <Link href="/login" className="text-[#00a6fb] hover:underline">Kirish</Link></p>
                      </div>
                    ) : (
                      <div className="p-8 text-center">
                        <div className="w-14 h-14 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4">
                          <CheckCircle2 className="w-7 h-7" />
                        </div>
                        <h3 className="text-white font-bold text-lg mb-1">Muvaffaqiyatli!</h3>
                        <p className="text-white/50 text-sm">Dashboard ga kiryapsiz...</p>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </nav>

      {/* HERO SECTION - Deep Navy Gradient */}
      <section className="relative pt-36 pb-20 md:pt-48 md:pb-32 px-6 overflow-hidden bg-gradient-to-b from-[#0a1628] to-[#12284c] border-b-4 border-[#00a6fb]">
        {/* Subtle background audio waves */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none flex items-center justify-center gap-4">
          {Array.from({ length: 40 }).map((_, i) => (
            <div key={i} className="w-4 bg-white rounded-full h-full transform scale-y-[0.3]" style={{ opacity: (i % 5) * 0.1 + 0.05 }} />
          ))}
        </div>

        <div className="max-w-[1300px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">

          <div className="lg:col-span-7">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-5xl sm:text-7xl font-light text-white tracking-tight mb-8 leading-[1.15]"
            >
              Sotuvdagi har bir daqiqani <br className="hidden md:block" /> foydaga aylantiring
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-lg sm:text-xl text-[#b4c5dc] mb-10 max-w-2xl font-normal leading-relaxed"
            >
              Markaziy Osiyodagi eng ilg'or suhbat tahlili tizimi. Sun'iy intellekt xodimlaringizning mijozlar bilan muloqotini 100% eshitib, xatolarni ko'rsatish va savdoni oshirish uchun yaratilgan.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <button onClick={() => { setShowModal(true); setIsSuccess(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="h-14 px-8 rounded-lg bg-[#e02b20] text-white font-semibold text-[17px] hover:bg-[#c9241b] transition-colors flex items-center justify-center">
                Demo versiyani sinash
              </button>
              <a href="#features" onClick={(e) => { e.preventDefault(); document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' }); }} className="h-14 px-8 rounded-lg border border-white/30 text-white font-medium text-[17px] hover:bg-white/5 transition-colors flex items-center justify-center">
                Batafsil ma'lumot
              </a>
            </motion.div>
          </div>

          {/* Right Side Glow Effect */}
          <div className="hidden lg:flex lg:col-span-5 relative h-[400px] items-center justify-center">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#00a6fb]/15 rounded-full blur-[120px] pointer-events-none" />
          </div>

        </div>
      </section>

      {/* MID TRANSITION SECTION */}
      <section className="py-24 px-6 bg-[#f4f7f9] text-center border-b border-slate-200">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl sm:text-5xl lg:text-5xl font-light text-[#0a1628] leading-[1.3] tracking-tight">
            Sotuv bo'limida endi sirli xatolar qolmaydi. Barcha jarayon shaffof, avtomatik va o'lchanadigan vizual hisobotlarda.
          </h2>
        </div>
      </section>

      {/* FEATURE 1: Audio Transcription */}
      <section id="features" className="py-28 px-6 max-w-[1300px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          {/* Left Content */}
          <div className="order-2 lg:order-1">
            <p className="text-xs font-bold text-[#0066cc] uppercase tracking-[0.2em] mb-4">AUDIO MATN TAHLILI</p>
            <h3 className="text-4xl sm:text-5xl font-medium text-[#0a1628] block mb-6 leading-[1.15]">
              Suhbatlarni birzumda yozib olish va matnga aylantirish
            </h3>
            <p className="text-[17px] text-slate-500 mb-8 leading-relaxed max-w-lg">
              Sotuvchilar Mijozga qo'ng'iroq qilganda (telefon yoki dastur orqali), sun'iy intellekt darhol aralashib, suhbatni eshitadi va o'zbek tilida hech bir iborani yo'qotmay to'liq matnli xatga (transcription) aylantiradi.
            </p>
            <button onClick={() => { setShowModal(true); setIsSuccess(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="inline-flex items-center justify-center px-8 py-3.5 bg-[#e02b20] text-white rounded-lg font-semibold hover:bg-[#c9241b] transition-colors shadow-md">
              Tizim ko'rinishida sinash
            </button>
          </div>

          {/* Right Abstract UI */}
          <div className="order-1 lg:order-2 bg-[#f8f9fb] rounded-[32px] p-8 sm:p-12 relative overflow-hidden h-[450px] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.05)] flex items-center justify-center">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[80px] rounded-full" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 blur-[80px] rounded-full" />

            {/* Mockup Chat UI */}
            <div className="w-full max-w-md bg-white rounded-2xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] border border-slate-100 overflow-hidden relative z-10 flex flex-col h-[320px]">
              <div className="bg-slate-50 px-5 py-3 border-b border-slate-100 flex items-center justify-between">
                <div className="flex gap-2 items-center">
                  <Mic className="w-4 h-4 text-emerald-500" />
                  <span className="text-sm font-semibold text-slate-700">Live Transkripsiya</span>
                </div>
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <div className="p-5 flex-1 overflow-hidden flex flex-col gap-4">
                <div className="flex flex-col items-start w-3/4">
                  <span className="text-[10px] text-slate-400 font-bold mb-1 ml-1 uppercase">XoDIM</span>
                  <div className="bg-blue-50 text-slate-700 text-sm px-4 py-3 rounded-2xl rounded-tl-sm border border-blue-100">
                    Assalomu alaykum, kecha mahsulotni ko'rib chiqdingizmi?
                  </div>
                </div>
                <div className="flex flex-col items-end self-end w-3/4">
                  <span className="text-[10px] text-slate-400 font-bold mb-1 mr-1 uppercase">MIJOZ</span>
                  <div className="bg-slate-100 text-slate-700 text-sm px-4 py-3 rounded-2xl rounded-tr-sm border border-slate-200">
                    Ha, ko'rdim. Lekin biroz narxi qimmat ekan.
                  </div>
                </div>
                <div className="flex flex-col items-start w-3/4 opacity-50">
                  <span className="text-[10px] text-slate-400 font-bold mb-1 ml-1 uppercase">XoDIM</span>
                  <div className="flex items-center gap-1.5 bg-blue-50 text-slate-700 text-sm px-4 py-3 rounded-2xl rounded-tl-sm border border-blue-100">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" />
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURE 2: AI Evaluation */}
      <section className="py-28 px-6 bg-[#f4f7f9] border-y border-slate-200">
        <div className="max-w-[1300px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

          {/* Left Abstract UI */}
          <div className="bg-white rounded-[32px] p-8 sm:p-12 relative overflow-hidden h-[450px] shadow-[0_20px_50px_-20px_rgba(0,0,0,0.05)] border border-slate-100 flex items-center justify-center">
            <div className="w-full max-w-sm">
              <h4 className="font-semibold text-slate-800 mb-6 flex items-center gap-2">
                <Bot className="w-5 h-5 text-rose-500" />
                AI Tahlil va xulosasi
              </h4>

              <div className="space-y-4">
                {/* Rule 1 passing */}
                <div className="flex items-center justify-between p-4 bg-emerald-50 border border-emerald-100 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium text-slate-700">Salomlashish skripti uqildi</span>
                  </div>
                </div>

                {/* Rule 2 failing heavily */}
                <div className="flex gap-4 p-5 bg-rose-50 border border-rose-200 rounded-xl relative overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-rose-500" />
                  <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 mt-0.5">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-slate-800 block mb-1">E'tiroz noto'g'ri hal qilindi</span>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Mijoz "Qimmat" deb e'tiroz bildirganda, Sotuvchi tushuntirish berish o'rniga gapni qisqa qildi. "Bo'lmasa chala ish bo'ladi" iborasi ishlatildi. Reyting pastlatildi.
                    </p>
                  </div>
                </div>

                {/* Progress meter total */}
                <div className="pt-4 border-t border-slate-100">
                  <div className="flex justify-between text-xs font-bold mb-2">
                    <span className="text-slate-500 uppercase">Jami Skript bajarilishi</span>
                    <span className="text-rose-500">42% (Qoniqarsiz)</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-rose-500 w-[42%] rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content */}
          <div>
            <p className="text-xs font-bold text-[#0066cc] uppercase tracking-[0.2em] mb-4">SUN'IY INTELLEKT TAHLILI</p>
            <h3 className="text-4xl sm:text-5xl font-medium text-[#0a1628] block mb-6 leading-[1.15]">
              Nima uchun muvaffaqiyatsiz savdo qildik? Qidirib toping
            </h3>
            <p className="text-[17px] text-slate-500 mb-8 leading-relaxed max-w-lg">
              Bizning asab tahlili algoritmlarimiz har bir chaqiruvni 50 dan ortiq parametrda skanerlaydi. Sotuvchi e'tirozlarni qanday yopdi? Mijoz ishonchini oldimi yoki agressiv suhbat olib bordimi? Tizim sizga tayyor diagnosni qo'yadi.
            </p>
            <Link href="/register" className="inline-flex items-center text-[#e02b20] font-semibold text-[17px] hover:text-[#c9241b] transition-colors group">
              Batafsil ma'lumot olish <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURE 3: ROP Dashboard */}
      <section className="py-28 px-6 max-w-[1300px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          {/* Left Content */}
          <div className="order-2 lg:order-1">
            <p className="text-xs font-bold text-[#0066cc] uppercase tracking-[0.2em] mb-4">RAHBARLAR XONASI (DASHBOARD)</p>
            <h3 className="text-4xl sm:text-5xl font-medium text-[#0a1628] block mb-6 leading-[1.15]">
              Sotuv jamoaning barcha ko'rsatkichlari sizning kaftingizda
            </h3>
            <p className="text-[17px] text-slate-500 mb-8 leading-relaxed max-w-lg">
              Sotuv rahbari (ROP) yoki biznes egasi sifatida siz doimo band bo'lasiz. Biz qiyin tahlillarni bitta vizual ekranda va diagrammalarda ko'rsatamiz. Kunning eng zo'r ishlaganlari va qizil zonadagi(muammoli) qo'ng'iroqlarni 1 daqiqada kuzating.
            </p>
            <button onClick={() => { setShowModal(true); setIsSuccess(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="inline-flex items-center justify-center px-8 py-3.5 bg-[#e02b20] text-white rounded-lg font-semibold hover:bg-[#c9241b] transition-colors shadow-md">
              Boshlash
            </button>
          </div>

          {/* Right Abstract UI */}
          <div className="order-1 lg:order-2 bg-[#f8f9fb] rounded-[32px] p-6 sm:p-10 relative overflow-hidden h-[450px] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.05)] flex flex-col justify-center">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[80px] rounded-full" />

            {/* Mockup Dashboard Cards */}
            <div className="w-full space-y-4 relative z-10 z-10 scale-[0.95] origin-center -ml-4">
              {/* Card 1 */}
              <div className="bg-white rounded-2xl p-5 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.1)] border border-slate-100 flex items-center justify-between ml-8">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500">1</div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">Qodirova Madina</p>
                    <p className="text-xs text-slate-500 mt-0.5">Top reyting: +38 suhbat</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-lg font-black text-emerald-500 block">4.9 / 5</span>
                  <span className="text-[10px] uppercase text-emerald-500/70 font-bold">O'rtacha</span>
                </div>
              </div>

              {/* Card 2 */}
              <div className="bg-white rounded-2xl p-5 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.1)] border border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500">2</div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">Rustamov S.</p>
                    <p className="text-xs text-slate-500 mt-0.5">Muammosiz sotuv jarayoni</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-lg font-black text-emerald-500 block">4.7 / 5</span>
                  <span className="text-[10px] uppercase text-emerald-500/70 font-bold">O'rtacha</span>
                </div>
              </div>

              {/* Red Zone Mockup */}
              <div className="bg-rose-50 border border-rose-200 rounded-2xl p-5 shadow-[0_10px_30px_-15px_rgba(225,29,72,0.1)] flex items-center justify-between ml-12">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center font-bold text-rose-500">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">Asqarov T.</p>
                    <p className="text-xs text-rose-500 font-medium mt-0.5">Juda ko'p skript buzilmoqda</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-lg font-black text-rose-500 block">2.1 / 5</span>
                  <span className="text-[10px] uppercase text-rose-500/70 font-bold">Qizil Zona</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA SECTION */}
      <section className="bg-gradient-to-b from-[#0a1628] to-[#12284c] border-t border-[#1a3a6e] py-32 px-6 text-center text-white relative overflow-hidden border-b-[8px] border-[#e02b20]">
        <div className="max-w-4xl mx-auto relative z-10">
          <h2 className="text-5xl md:text-6xl font-light tracking-tight mb-8">O'z savdolaringiz egasiga aylaning</h2>
          <p className="text-[#b4c5dc] text-xl mb-12 font-normal max-w-2xl mx-auto">
            10, 50 yoki hatto 100 ta xodimingiz bo'lsa ham endi hammasini AI nazorat qiladi. Bugunoq Tizimga ulaning va AI mo'jizalarini ko'ring.
          </p>
          <button onClick={() => { setShowModal(true); setIsSuccess(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="inline-flex items-center justify-center h-16 px-10 bg-[#e02b20] hover:bg-[#c9241b] text-white font-bold text-lg rounded-xl transition-all border border-[#e02b20]/20 w-full sm:w-auto">
            Sinov muddatini boshlash
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer id="footer" className="bg-[#050B14] py-16 px-6 text-[#7a8a9e] border-t border-white/5">
        <div className="max-w-[1300px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500 flex items-center justify-center">
                <PhoneIncoming className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-bold text-lg text-white tracking-wide block leading-none">AI SALES PILOT</span>
                <span className="text-[13px] font-bold text-white/40 uppercase tracking-widest mt-1 block">Premium Solution</span>
              </div>
            </div>

            <div className="flex flex-col items-center border-x border-white/5 py-2">
              <div className="inline-flex flex-col">
                <a href="tel:+998952645664" className="text-2xl font-black text-white hover:text-rose-500 transition-colors tracking-[0.02em]">
                  +998 95 264 56 64
                </a>
                <div className="flex justify-between text-[13px] font-bold text-white/40 uppercase tracking-[0.05em] mt-0">
                  <span>Andijon</span>
                  <span>shahar,</span>
                  <span>O'zbekiston</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end gap-4">
              <div className="text-sm text-right">
                © {new Date().getFullYear()} AI Sales Pilot.<br />Barcha huquqlar himoyalangan.
              </div>
              <div className="flex gap-4 text-xs uppercase tracking-widest font-bold">
                <a href="#" className="text-white/40 hover:text-white transition-colors">Yordam</a>
                <a href="#" className="text-white/40 hover:text-white transition-colors">Maxfiylik</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
