'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, ArrowRight, ShieldCheck, PhoneCall, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ForgotPassword() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [phone, setPhone] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "Xatolik yuz berdi");
        return;
      }

      setIsSuccess(true);
    } catch {
      setErrorMsg("Server bilan bog'lanishda xato");
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
            <h1 className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 mb-2 tracking-tight">
              Parolni tiklash
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm px-4">
              Hisobingizga biriktirilgan telefon raqamingizni kiriting
            </p>
          </div>

          {!isSuccess ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMsg && (
                <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm px-4 py-3 rounded-xl">
                  {errorMsg}
                </div>
              )}
              
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <PhoneCall className="h-4 w-4 sm:h-5 sm:w-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                </div>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-3 pl-10 sm:pl-11 pr-4 text-sm sm:text-base text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all font-medium font-mono"
                  placeholder="998901234567"
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                disabled={isSubmitting}
                className="w-full bg-blue-600 text-white rounded-xl py-3 font-bold text-sm sm:text-base flex items-center justify-center gap-2 hover:bg-blue-500 transition-colors shadow-[0_0_20px_rgba(37,99,235,0.4)]"
              >
                {isSubmitting ? "Yuborilmoqda..." : "Parolni yuborish"}
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </form>
          ) : (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Xabar yuborildi!</h3>
              <p className="text-slate-400 text-sm mb-6 px-4">
                Agar bu raqam ro'yxatdan o'tgan bo'lsa, unga biriktirilgan elektron pochtaga yangi parol yuborildi.
              </p>
              <Link href="/login" className="text-blue-400 font-semibold hover:text-blue-300 transition-colors inline-flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" /> Kirish sahifasiga qaytish
              </Link>
            </div>
          )}

          <div className="mt-6 text-center">
            <Link href="/login" className="text-xs sm:text-sm text-slate-500 hover:text-slate-300 transition-colors">
              Kirish sahifasiga qaytish
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
