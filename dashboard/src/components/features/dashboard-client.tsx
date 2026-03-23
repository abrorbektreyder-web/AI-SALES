'use client';

import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { Activity, ArrowUpRight, ArrowDownRight, AlertCircle, PhoneCall } from 'lucide-react';
import { useEffect, useState } from 'react';

type LeaderboardItem = { name: string; sales: number; score: number; initial: string; color: string };
type RedZoneItem = { name: string; id: string; reason: string; score: number };
type LatestCall = { time: string; agent: string; client: string; status: string; statusColor: string };

interface DashboardClientProps {
  displayScore: number;
  displayDiff: number;
  displayPct5: number;
  displayPct4: number;
  displayPctLow: number;
  displayLeaderboard: LeaderboardItem[];
  displayRedZone: RedZoneItem[];
  displayLatest: LatestCall[];
  showsPlaceholder: boolean;
}



const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }
  })
};

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } }
};


export function DashboardClient({
  displayScore,
  displayDiff,
  displayPct5,
  displayPct4,
  displayPctLow,
  displayLeaderboard,
  displayRedZone,
  displayLatest,
  showsPlaceholder,
}: DashboardClientProps) {
  const [mounted, setMounted] = useState(false);
  const [pulseOn, setPulseOn] = useState(true);

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => setPulseOn(p => !p), 2000);
    return () => clearInterval(interval);
  }, []);

  const dashOffset = 97.38 * (1 - (displayScore / 5.0));

  if (!mounted) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-[#18181b] border border-white/5 rounded-2xl p-6 space-y-4">
          <Skeleton className="h-4 w-48" />
          <div className="flex gap-6 items-center">
            <Skeleton className="w-36 h-36 rounded-full" />
            <div className="space-y-3 flex-1">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-3/4" />
            </div>
          </div>
        </div>
        <div className="bg-[#18181b] border border-rose-500/20 rounded-2xl p-6 space-y-3">
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-16 w-full rounded-xl" />
          <Skeleton className="h-16 w-full rounded-xl" />
          <Skeleton className="h-16 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <>
      {/* === SCORE + RED ZONE === */}
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {/* Circular Score Card */}
        <motion.div
          variants={fadeUp}
          custom={0}
          className="md:col-span-2 bg-gradient-to-br from-[#18181b] to-[#121214] border border-white/5 rounded-2xl shadow-[0_0_40px_-15px_rgba(52,211,153,0.12)] relative overflow-hidden group p-6"
        >
          {/* Ambient glow */}
          <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none" />

          <div className="flex flex-col h-full justify-between relative z-10">
            <h3 className="text-white/50 text-xs font-semibold tracking-[0.2em] uppercase mb-8 flex items-center gap-2">
              <Activity className="w-3.5 h-3.5" />
              Bo&apos;limning Bugungi O&apos;rtacha Bali {showsPlaceholder && <span className="text-yellow-500/70">(Demo)</span>}
              {/* Live pulse indicator */}
              <span className="ml-auto flex items-center gap-1.5 text-emerald-400 text-[10px] tracking-widest">
                <span className={`w-1.5 h-1.5 rounded-full bg-emerald-400 transition-opacity duration-700 ${pulseOn ? 'opacity-100' : 'opacity-20'}`} />
                JONLI
              </span>
            </h3>

            <div className="flex flex-col md:flex-row items-center justify-between gap-8 h-full">
              {/* Circular gauge */}
              <div className="flex items-center gap-6">
                <div className="relative w-36 h-36">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
                    {/* Track */}
                    <circle cx="18" cy="18" r="15.5" fill="none" className="stroke-white/5" strokeWidth="2.5" />
                    {/* Glow ring */}
                    <circle cx="18" cy="18" r="15.5" fill="none"
                      stroke="rgba(52,211,153,0.08)" strokeWidth="5" />
                    {/* Progress arc */}
                    <circle
                      cx="18" cy="18" r="15.5" fill="none"
                      className="stroke-emerald-400 transition-all duration-1000 ease-out"
                      strokeWidth="2.5"
                      strokeDasharray="97.38"
                      strokeDashoffset={dashOffset}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-bold text-white tracking-tight font-sans leading-none">
                      <AnimatedCounter target={displayScore} duration={1200} decimals={1} />
                    </span>
                    <span className="text-[10px] text-emerald-400/80 font-medium uppercase tracking-widest mt-1">/ 5.0</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Badge variant="outline" className={`px-3 py-1 font-normal w-fit border ${displayDiff >= 0 ? "border-emerald-500/30 text-emerald-400 bg-emerald-500/5" : "border-rose-500/30 text-rose-400 bg-rose-500/5"}`}>
                    {displayDiff >= 0
                      ? <ArrowUpRight className="w-3.5 h-3.5 mr-1" />
                      : <ArrowDownRight className="w-3.5 h-3.5 mr-1" />}
                    {displayDiff > 0 ? "+" : ""}{displayDiff} O&apos;sish
                  </Badge>
                  <p className="text-xs text-white/40 max-w-[130px] leading-relaxed">
                    Kechagiga nisbatan {displayDiff >= 0 ? "ijobiy" : "salbiy"} dinamika {displayDiff >= 0 ? "saqlanmoqda." : "kuzatilmoqda."}
                  </p>
                </div>
              </div>

              {/* Breakdown bars */}
              <div className="w-full md:w-64 space-y-4">
                {[
                  { label: "5 BALL", value: displayPct5, color: "bg-emerald-400", textColor: "text-emerald-400", progressClass: "[&>div]:bg-emerald-400" },
                  { label: "4 BALL", value: displayPct4, color: "bg-cyan-400", textColor: "text-cyan-400", progressClass: "[&>div]:bg-cyan-400" },
                  { label: "1-3 BALL", value: displayPctLow, color: "bg-rose-500", textColor: "text-rose-500", progressClass: "[&>div]:bg-rose-500" },
                ].map((bar, i) => (
                  <motion.div key={i} className="space-y-1.5"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                  >
                    <div className="flex justify-between text-xs items-center">
                      <span className="text-white/60 font-medium tracking-wide">{bar.label}</span>
                      <span className={`font-bold ${bar.textColor}`}>{bar.value}%</span>
                    </div>
                    <Progress value={bar.value} className={`h-1.5 bg-white/5 ${bar.progressClass}`} />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Red Zone Alerts */}
        <motion.div variants={fadeUp} custom={1}>
          <Card className="bg-[#18181b] border-rose-500/30 shadow-xl shadow-rose-500/5 hover:border-rose-500/50 transition-colors h-full">
            <CardHeader className="pb-3 border-b border-white/5">
              <CardTitle className="text-rose-500 flex items-center gap-2 text-sm font-semibold tracking-wide">
                <AlertCircle className="size-4 animate-pulse" />
                DIQQAT! (QIZIL ZONA)
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              {displayRedZone.length > 0 ? displayRedZone.map((err, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="flex items-start justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all cursor-pointer border border-transparent hover:border-rose-500/20 group"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm">{err.name}</span>
                      <span className="text-xs text-white/40">{err.id}</span>
                    </div>
                    <p className="text-xs text-rose-400 mt-1">{err.reason}</p>
                  </div>
                  <div className="size-7 rounded-sm bg-rose-500/20 text-rose-500 flex items-center justify-center font-bold text-xs border border-rose-500/20 group-hover:bg-rose-500 group-hover:text-white transition-all">
                    {err.score}
                  </div>
                </motion.div>
              )) : (
                <div className="text-center text-white/40 text-sm py-8">
                  Qizil zonaga tushgan qo&apos;ng&apos;iroqlar topilmadi.
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* === LEADERBOARD + LATEST CALLS === */}
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* Leaderboard */}
        <motion.div variants={fadeUp} custom={2}>
          <Card className="bg-[#18181b] border-white/5 shadow-xl">
            <CardHeader className="pb-3 border-b border-white/5">
              <CardTitle className="text-white/90 text-sm font-semibold tracking-wide flex items-center justify-between">
                <span>Top Reyting (Leaderboard)</span>
                <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-400 font-normal hover:bg-emerald-500/20">
                  Ajoyib natija
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 p-0">
              <div className="flex flex-col">
                {displayLeaderboard.length > 0 ? displayLeaderboard.map((user, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + i * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="flex items-center justify-between p-4 border-b border-white/5 last:border-0 hover:bg-white/5 transition-all cursor-default group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-white/30 font-bold w-5 text-xs text-center">
                        {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : i + 1}
                      </div>
                      <div className={`size-8 rounded-full flex items-center justify-center text-xs font-bold text-white ${user.color} group-hover:scale-110 transition-transform`}>
                        {user.initial}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white/90">{user.name}</p>
                        <p className="text-xs text-white/50">{user.sales} ta suhbat</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center justify-end gap-1 text-emerald-400 font-bold text-sm">
                        <AnimatedCounter target={user.score} duration={800 + i * 200} decimals={1} />
                      </div>
                      <p className="text-[10px] text-white/40 uppercase tracking-widest mt-0.5">O&apos;rtacha ball</p>
                    </div>
                  </motion.div>
                )) : (
                  <div className="text-center text-white/40 text-sm py-8">Xodimlar topilmadi.</div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Latest Calls */}
        <motion.div variants={fadeUp} custom={3}>
          <Card className="bg-[#18181b] border-white/5 shadow-xl">
            <CardHeader className="pb-3 border-b border-white/5 flex flex-row items-center justify-between">
              <CardTitle className="text-white/90 text-sm font-semibold tracking-wide flex items-center gap-2">
                <PhoneCall className="size-3.5 text-blue-400" />
                So&apos;nggi Qo&apos;ng&apos;iroqlar
              </CardTitle>
              <a href="/calls" className="text-xs text-blue-400 hover:text-blue-300 transition-colors">Barchasini ko&apos;rish →</a>
            </CardHeader>
            <CardContent className="p-0">
              <div className="flex flex-col">
                {displayLatest.length > 0 ? displayLatest.map((call, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + i * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="flex items-center justify-between p-4 border-b border-white/5 last:border-0 hover:bg-white/5 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-xs text-white/40 font-mono">{call.time}</div>
                      <div>
                        <p className="text-sm font-medium text-white/90 group-hover:text-white transition-colors">{call.agent}</p>
                        <p className="text-xs text-white/40 font-mono tracking-wider">{call.client}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className={`font-medium transition-all group-hover:opacity-100 ${call.statusColor}`}>
                      {call.status}
                    </Badge>
                  </motion.div>
                )) : (
                  <div className="text-center text-white/40 text-sm py-8">Qo&apos;ng&apos;iroqlar topilmadi.</div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </>
  );
}
