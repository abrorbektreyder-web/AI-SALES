export const dynamic = "force-dynamic";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Search, PhoneIncoming, AlertCircle, Activity, ArrowUpRight, ArrowDownRight, LogOut, Users } from "lucide-react";
import prisma from "@/lib/db";
import { startOfDay, subDays } from "date-fns";

export default async function Dashboard() {
  const today = startOfDay(new Date());
  const yesterday = subDays(today, 1);

  let dbUsers: any[] = [];
  let todayCalls: any[] = [];
  let yesterdayCalls: any[] = [];
  let redZoneCalls: any[] = [];
  let latestDbCalls: any[] = [];

  try {
    // BARISHA FOYDALANUVCHILAR (LEADERBOARD UCHUN)
    dbUsers = await prisma.user.findMany({
      where: { role: 'AGENT' },
      include: {
        calls: {
          include: { analysis: true }
        }
      }
    });

    // QO'NG'IROQLAR HISTORISI
    todayCalls = await prisma.callRecord.findMany({
      where: { createdAt: { gte: today } },
      include: { analysis: true }
    });

    yesterdayCalls = await prisma.callRecord.findMany({
      where: { createdAt: { gte: yesterday, lt: today } },
      include: { analysis: true }
    });

    // DIAGNOZ (QIZIL ZONA)
    redZoneCalls = await prisma.aiAnalysis.findMany({
      where: { score: { lte: 3 } },
      orderBy: { createdAt: 'desc' },
      take: 3,
      include: { call: { include: { user: true } } }
    });

    // SO'NGGI QO'NG'IROQLAR
    latestDbCalls = await prisma.callRecord.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: { user: true, analysis: true }
    });
  } catch (error) {
    console.error("Databasega ulanishda xato yoki jadvallar topilmadi. Mock Data ishga tushadi.", error);
  }

  // Reytingni hisoblash
  const leaderboard = dbUsers.map(user => {
    const scoredCalls = user.calls.filter((c: any) => c.analysis !== null);
    const totalScore = scoredCalls.reduce((sum: number, c: any) => sum + (c.analysis?.score || 0), 0);
    const avgScore = scoredCalls.length > 0 ? totalScore / scoredCalls.length : 0;
    
    // Ism-sharif initials, ex: "Aliev J." -> "AJ"
    const words = user.name.split(' ');
    const initial = words.length > 1 ? `${words[0][0]}${words[1][0]}` : user.name.substring(0, 2);
    
    // Tasodifiy rang tanlash
    const colors = ["bg-blue-500", "bg-purple-500", "bg-emerald-500", "bg-orange-500", "bg-cyan-500"];
    const randColor = colors[user.id.charCodeAt(0) % colors.length];

    return {
      name: user.name,
      sales: user.calls.length, 
      score: Number(avgScore.toFixed(1)),
      initial: initial.toUpperCase(),
      color: randColor,
    };
  }).sort((a, b) => b.score - a.score || b.sales - a.sales).slice(0, 5);

  const getAvg = (calls: any[]) => {
    const scored = calls.filter(c => c.analysis !== null);
    if (!scored.length) return 0;
    return scored.reduce((sum, c) => sum + c.analysis.score, 0) / scored.length;
  };

  const todayAvg = getAvg(todayCalls);
  const yesterdayAvg = getAvg(yesterdayCalls);
  const diffAvg = todayAvg - yesterdayAvg;

  // Foiz hisobi
  const scoredToday = todayCalls.filter(c => c.analysis !== null);
  const totalScored = scoredToday.length || 1; // 0 ga bo'linishni oldini olish
  
  const fiveStars = scoredToday.filter(c => c.analysis.score === 5).length;
  const fourStars = scoredToday.filter(c => c.analysis.score === 4).length;
  const lowStars = scoredToday.filter(c => c.analysis.score <= 3).length;

  const pct5 = Math.round((fiveStars / totalScored) * 100);
  const pct4 = Math.round((fourStars / totalScored) * 100);
  const pctLow = Math.round((lowStars / totalScored) * 100);

  const redZoneList = redZoneCalls.map(analysis => {
    // Sababi uzun bo'lsa qisqartirish
    const summary = analysis.summary || "Nomalum xato";
    const reason = summary.length > 25 ? summary.substring(0, 25) + "..." : summary;
    
    return {
      name: analysis.call.user.name,
      id: `#${analysis.call.id.slice(-4).toUpperCase()}`,
      reason,
      score: analysis.score
    };
  });

  const latestList = latestDbCalls.map(c => {
    let statusText = "Tahlil...";
    let statusColor = "text-yellow-400 bg-yellow-500/10 border-yellow-500/20";
    
    if (c.status === "COMPLETED" && c.analysis) {
        statusText = c.analysis.score.toFixed(1);
        if (c.analysis.score >= 4.5) statusColor = "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
        else if (c.analysis.score >= 4) statusColor = "text-cyan-400 bg-cyan-500/10 border-cyan-500/20";
        else statusColor = "text-rose-400 bg-rose-500/10 border-rose-500/20";
    }

    // Convert +998901234567 to +998 90 *** 45 67 mapping mask
    let clientPhone = c.customerPhone;
    if (clientPhone.length >= 12) {
       clientPhone = `${clientPhone.slice(0, 4)} ${clientPhone.slice(4, 6)} *** ${clientPhone.slice(-4, -2)} ${clientPhone.slice(-2)}`;
    }

    return {
      time: new Date(c.createdAt).toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' }),
      agent: c.user.name,
      client: clientPhone,
      status: statusText,
      statusColor: statusColor
    };
  });

  // DAStlabki MOCK DATA (agar DB bo'sh bo'lsa premium ko'rinishni saqlab turish uchun)
  // Haqiqiy ma'lumotlar tushganda o'z o'zidan o'chib ketadi
  const showsPlaceholder = todayCalls.length === 0 && dbUsers.length === 0;
  
  const displayScore = showsPlaceholder ? 4.2 : Number(todayAvg.toFixed(1));
  const displayDiff = showsPlaceholder ? 0.4 : Number(diffAvg.toFixed(1));
  const displayPct5 = showsPlaceholder ? 45 : pct5;
  const displayPct4 = showsPlaceholder ? 30 : pct4;
  const displayPctLow = showsPlaceholder ? 25 : pctLow;
  
  const displayRedZone = showsPlaceholder ? [
    { name: "Aliev J.", id: "#1142", reason: "Mijoz asabiylashdi", score: 1 },
    { name: "Sattorov B.", id: "#1138", reason: "Qo'pollik", score: 1 },
    { name: "Karimov N.", id: "#1099", reason: "Skript buzilgan", score: 2 },
  ] : redZoneList;

  const displayLeaderboard = showsPlaceholder ? [
    { name: "Rustamov S.", sales: 45, score: 4.8, initial: "RS", color: "bg-blue-500" },
    { name: "Qodirova M.", sales: 38, score: 4.6, initial: "QM", color: "bg-purple-500" },
    { name: "Jo'rayev A.", sales: 32, score: 4.5, initial: "JA", color: "bg-emerald-500" },
    { name: "Olimov D.", sales: 28, score: 4.2, initial: "OD", color: "bg-orange-500" },
    { name: "Toshmatov N.", sales: 21, score: 4.0, initial: "TN", color: "bg-cyan-500" },
  ] : leaderboard;

  const displayLatest = showsPlaceholder ? [
    { time: "12:45", agent: "Rustamov S.", client: "+998 90 *** 45 67", status: "5.0", statusColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
    { time: "12:30", agent: "Qodirova M.", client: "+998 90 *** 12 34", status: "4.2", statusColor: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20" },
    { time: "12:15", agent: "Aliev J.", client: "+998 93 *** 88 99", status: "1.0", statusColor: "text-rose-400 bg-rose-500/10 border-rose-500/20" },
    { time: "11:50", agent: "Jo'rayev A.", client: "+998 97 *** 55 11", status: "Tahlil...", statusColor: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20" },
    { time: "11:42", agent: "Sattorov B.", client: "+998 99 *** 22 33", status: "2.0", statusColor: "text-rose-400 bg-rose-500/10 border-rose-500/20" },
  ] : latestList;

  const dashOffset = 97.38 * (1 - (displayScore / 5.0));

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Top Header / Navigation */}
      <header className="sticky top-4 z-50 flex items-center justify-between px-6 py-4 rounded-2xl backdrop-blur-md bg-black/40 border border-white/10 shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="size-8 rounded-full bg-blue-600 flex items-center justify-center">
            <PhoneIncoming className="size-4 text-white" />
          </div>
          <h1 className="text-xl font-bold font-space-grotesk tracking-tight">
            AI SALES PILOT
          </h1>
        </div>
        <div className="hidden md:flex items-center bg-white/5 border border-white/10 rounded-full px-4 py-2 w-96">
          <Search className="size-4 text-white/50 mr-2" />
          <input
            type="text"
            placeholder="Mijoz ismi yoki qo&apos;ng&apos;iroq ID..."
            className="bg-transparent border-none outline-none text-sm text-white/90 w-full placeholder:text-white/40"
          />
        </div>
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium leading-none">Rustamov S.</p>
              <p className="text-xs text-white/50">Sotuv Rahbari (ROP)</p>
            </div>
            <div className="size-10 rounded-full bg-zinc-800 border-2 border-white/10 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="avatar" />
            </div>
          </div>
          <div className="h-8 w-px bg-white/10 hidden sm:block"></div>
          <Link href="/agents" className="flex items-center gap-2 px-3 py-2 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 rounded-lg transition-colors border border-purple-500/20 text-sm font-medium">
            <Users className="size-4" />
            <span className="hidden sm:inline">Xodimlar</span>
          </Link>
          <Link href="/login" className="flex items-center gap-2 px-3 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 rounded-lg transition-colors border border-rose-500/20 text-sm font-medium">
            <LogOut className="size-4" />
            <span className="hidden sm:inline">Chiqish</span>
          </Link>
        </div>
      </header>

      {/* Main Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Premium Dashboard: Reimagined Circular Gauge Overview */}
        <div className="md:col-span-2 bg-gradient-to-br from-[#18181b] to-[#121214] border border-white/5 rounded-2xl shadow-[0_0_40px_-15px_rgba(52,211,153,0.1)] relative overflow-hidden group p-6">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none" />
          
          <div className="flex flex-col h-full justify-between relative z-10">
            <h3 className="text-white/50 text-xs font-semibold tracking-[0.2em] uppercase mb-8 flex items-center gap-2">
              <Activity className="w-3.5 h-3.5" />
              Bo&apos;limning Bugungi O&apos;rtacha Bali {showsPlaceholder && "(Demo Data)"}
            </h3>
            
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 h-full">
              {/* Left: Circular Score */}
              <div className="flex items-center gap-6">
                <div className="relative w-36 h-36">
                  {/* SVG Circular Progress */}
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="18" cy="18" r="15.5" fill="none" className="stroke-white/5" strokeWidth="2.5" />
                    {/* Dynamic offset based on score */}
                    <circle 
                      cx="18" cy="18" r="15.5" fill="none" 
                      className="stroke-emerald-400 transition-all duration-1000 ease-out" 
                      strokeWidth="2.5" strokeDasharray="97.38" strokeDashoffset={dashOffset} strokeLinecap="round" />
                  </svg>
                  {/* Inner Text */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-bold text-white tracking-tight font-sans">
                      {Math.floor(displayScore)}<span className="text-xl text-white/50 px-0.5">.</span>{Math.round((displayScore % 1) * 10)}
                    </span>
                    <span className="text-[10px] text-emerald-400/80 font-medium uppercase tracking-widest mt-1">/ 5.0</span>
                  </div>
                </div>
                
                <div className="flex flex-col gap-2">
                  <Badge variant="outline" className={`px-3 py-1 font-normal w-fit ${displayDiff >= 0 ? "border-emerald-500/20 text-emerald-400 bg-emerald-500/5" : "border-rose-500/20 text-rose-400 bg-rose-500/5"}`}>
                    {displayDiff >= 0 ? <ArrowUpRight className="w-3.5 h-3.5 mr-1" /> : <ArrowDownRight className="w-3.5 h-3.5 mr-1" />}
                    {displayDiff > 0 ? "+" : ""}{displayDiff} O&apos;sish
                  </Badge>
                  <p className="text-xs text-white/40 max-w-[120px] leading-relaxed">
                    Kechagiga nisbatan {displayDiff >= 0 ? "ijobiy" : "salbiy"} dinamika {displayDiff >= 0 ? "saqlanib qolmoqda." : "kuzatilmoqda."}
                  </p>
                </div>
              </div>

              {/* Right: Breakdown Bars */}
              <div className="w-full md:w-64 space-y-4">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs items-center">
                    <span className="text-white/60 font-medium tracking-wide">5 BALL</span>
                    <span className="font-bold text-emerald-400">{displayPct5}%</span>
                  </div>
                  <Progress value={displayPct5} className="h-1.5 bg-white/5 [&>div]:bg-emerald-400" />
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs items-center">
                    <span className="text-white/60 font-medium tracking-wide">4 BALL</span>
                    <span className="font-bold text-cyan-400">{displayPct4}%</span>
                  </div>
                  <Progress value={displayPct4} className="h-1.5 bg-white/5 [&>div]:bg-cyan-400" />
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs items-center">
                    <span className="text-white/60 font-medium tracking-wide">1-3 BALL</span>
                    <span className="font-bold text-rose-500">{displayPctLow}%</span>
                  </div>
                  <Progress value={displayPctLow} className="h-1.5 bg-white/5 [&>div]:bg-rose-500" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Critical Alerts Zone */}
        <Card className="bg-[#18181b] border-rose-500/30 shadow-xl shadow-rose-500/5 hover:border-rose-500/50 transition-colors">
          <CardHeader className="pb-3 border-b border-white/5">
            <CardTitle className="text-rose-500 flex items-center gap-2 text-sm font-semibold tracking-wide">
              <AlertCircle className="size-4" />
              DIQQAT! (QIZIL ZONA)
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            {displayRedZone.length > 0 ? displayRedZone.map((err, i) => (
              <div key={i} className="flex items-start justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer border border-transparent hover:border-white/10 group">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm">{err.name}</span>
                    <span className="text-xs text-white/40">{err.id}</span>
                  </div>
                  <p className="text-xs text-rose-400 mt-1" title={err.reason}>{err.reason}</p>
                </div>
                <div className="size-7 rounded-sm bg-rose-500/20 text-rose-500 flex items-center justify-center font-bold text-xs border border-rose-500/20 group-hover:bg-rose-500 group-hover:text-white transition-colors">
                  {err.score}
                </div>
              </div>
            )) : (
              <div className="text-center text-white/40 text-sm py-8">
                Qizil zonaga tushgan qo&apos;ng&apos;iroqlar topilmadi.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Leaderboard and Latest Calls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Top Reyting (Leaderboard) */}
        <Card className="bg-[#18181b] border-white/5 shadow-xl">
          <CardHeader className="pb-3 border-b border-white/5">
            <CardTitle className="text-white/90 text-sm font-semibold tracking-wide flex items-center justify-between">
              <span>Top Reyting (Leaderboard)</span>
              <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-400 font-normal hover:bg-emerald-500/20">Ajoyib natija</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 p-0">
            <div className="flex flex-col">
              {displayLeaderboard.length > 0 ? displayLeaderboard.map((user, i) => (
                <div key={i} className="flex items-center justify-between p-4 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="text-white/30 font-bold w-4 text-xs">{i + 1}</div>
                    <div className={`size-8 rounded-full flex items-center justify-center text-xs font-bold text-white ${user.color}`}>
                      {user.initial}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white/90">{user.name}</p>
                      <p className="text-xs text-white/50">{user.sales} ta suhbat</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center justify-end gap-1 text-emerald-400 font-bold text-sm">
                      {user.score.toFixed(1)}
                    </div>
                    <p className="text-[10px] text-white/40 uppercase tracking-widest mt-0.5">O&apos;rtacha ball</p>
                  </div>
                </div>
              )) : (
                <div className="text-center text-white/40 text-sm py-8 border-b border-white/5">
                  Xodimlar yetarli emas.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* So'nggi Qo'ng'iroqlar */}
        <Card className="bg-[#18181b] border-white/5 shadow-xl">
          <CardHeader className="pb-3 border-b border-white/5 flex flex-row items-center justify-between">
            <CardTitle className="text-white/90 text-sm font-semibold tracking-wide">
              So&apos;nggi Qo&apos;ng&apos;iroqlar
            </CardTitle>
            <Link href="/calls" className="text-xs text-blue-400 hover:text-blue-300 transition-colors">Barchasini ko&apos;rish</Link>
          </CardHeader>
          <CardContent className="p-0">
            <div className="flex flex-col">
               {displayLatest.length > 0 ? displayLatest.map((call, i) => (
                <div key={i} className="flex items-center justify-between p-4 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <div className="text-xs text-white/40">{call.time}</div>
                    <div>
                      <p className="text-sm font-medium text-white/90">{call.agent}</p>
                      <p className="text-xs text-white/40 font-mono tracking-wider">{call.client}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className={`font-medium ${call.statusColor}`}>
                    {call.status}
                  </Badge>
                </div>
              )) : (
                 <div className="text-center text-white/40 text-sm py-8 border-b border-white/5">
                  Qo&apos;ng&apos;iroqlar topilmadi.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
