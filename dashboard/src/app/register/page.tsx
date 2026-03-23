'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, ShieldCheck, Eye, EyeOff, User, PhoneCall, Building2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function RegisterROP() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [formName, setFormName] = useState('');
  const [formCompany, setFormCompany] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formPassword, setFormPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formName,
          company: formCompany,
          email: formEmail,
          phone: formPhone,
          password: formPassword,
          role: 'ROP'
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || 'Ro\'yxatdan o\'tishda xatolik yuz berdi');
        setIsSubmitting(false);
        return;
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      router.push('/dashboard');
    } catch {
      setErrorMsg('Server bilan bog\'lanishda xato');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 flex items-center justify-center relative overflow-hidden font-sans">
      {/* Background Orbs & Effects */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[150px] pointer-events-none" />
      
      {/* Grid Pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none opacity-20" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-md p-4 sm:p-6 relative z-10"
      >
        <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-700/50 p-5 sm:p-7 rounded-3xl shadow-[0_0_60px_-15px_rgba(0,0,0,0.5)]">
          
          <div className="text-center mb-5">
            <motion.div 
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-[0_0_30px_rgba(59,130,246,0.3)] mb-3"
            >
              <ShieldCheck className="w-5 h-5 text-white" />
            </motion.div>
            <h1 className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 mb-0.5 tracking-tight">
              Ro'yxatdan o'tish
            </h1>
            <p className="text-slate-500 text-[10px] sm:text-xs">
              AI Sales Pilot tizimiga qo'shiling
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {errorMsg && (
              <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm px-4 py-3 rounded-xl">
                {errorMsg}
              </div>
            )}

            {/* Name Input */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User className="h-4 w-4 sm:h-5 sm:w-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
              </div>
              <input
                type="text"
                required
                value={formName}
                onChange={e => setFormName(e.target.value)}
                className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-2.5 sm:py-3 pl-10 sm:pl-11 pr-4 text-sm sm:text-base text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all font-medium"
                placeholder="F.I.SH (Ism va familiya)"
              />
            </div>

             {/* Company Input */}
             <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Building2 className="h-4 w-4 sm:h-5 sm:w-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
              </div>
              <input
                type="text"
                required
                value={formCompany}
                onChange={e => setFormCompany(e.target.value)}
                className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-2.5 sm:py-3 pl-10 sm:pl-11 pr-4 text-sm sm:text-base text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all font-medium"
                placeholder="Kompaniya nomi"
              />
            </div>

            {/* Phone Input */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <PhoneCall className="h-4 w-4 sm:h-5 sm:w-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
              </div>
              <input
                type="tel"
                required
                value={formPhone}
                onChange={e => setFormPhone(e.target.value)}
                className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-2.5 sm:py-3 pl-10 sm:pl-11 pr-4 text-sm sm:text-base text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all font-medium font-mono"
                placeholder="Telefon raqami (Asosiy login)"
              />
            </div>

            {/* Email Input */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
              </div>
              <input
                type="email"
                value={formEmail}
                onChange={e => setFormEmail(e.target.value)}
                className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-2.5 sm:py-3 pl-10 sm:pl-11 pr-4 text-sm sm:text-base text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all font-medium"
                placeholder="Elektron pochta (Ixtiyoriy)"
              />
            </div>

            {/* Password Input */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={formPassword}
                onChange={e => setFormPassword(e.target.value)}
                className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-2.5 sm:py-3 pl-10 sm:pl-11 pr-12 text-sm sm:text-base text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all font-medium"
                placeholder="Maxfiy parol (Login uchun)"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-slate-300 transition-colors focus:outline-none"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              disabled={isSubmitting}
              className="w-full relative group overflow-hidden bg-blue-600 text-white rounded-xl py-2.5 sm:py-3 font-bold text-sm sm:text-base flex items-center justify-center gap-2 mt-4 hover:bg-blue-500 transition-colors shadow-[0_0_20px_rgba(37,99,235,0.4)]"
            >
              {isSubmitting ? (
                 <span className="flex items-center gap-2">
                   <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                   </svg>
                   Ro'yxatdan o'tilmoqda...
                 </span>
              ) : (
                <>
                  Ro'yxatdan o'tish
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </motion.button>
          </form>

          <p className="mt-4 sm:mt-5 text-center text-xs sm:text-sm text-slate-500">
            Allaqachon akkauntingiz bormi?{' '}
            <Link href="/login" className="text-indigo-400 font-medium hover:text-indigo-300 transition-colors">
              Tizimga kirish
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
