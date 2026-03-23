export const dynamic = "force-dynamic";
import Link from "next/link";
import { Search, PhoneIncoming, LogOut, Users } from "lucide-react";
import prisma from "@/lib/db";
import { startOfDay, subDays } from "date-fns";
import { DashboardClient } from "@/components/features/dashboard-client";

export default async function Dashboard() {
  const today = startOfDay(new Date());
  const yesterday = subDays(today, 1);

  let dbUsers: any[] = [];
  let todayCalls: any[] = [];
  let yesterdayCalls: any[] = [];
  let redZoneCalls: any[] = [];
  let latestDbCalls: any[] = [];

  try {
    dbUsers = await prisma.user.findMany({
      where: { role: 'AGENT' },
      include: { calls: { include: { analysis: true } } }
    });

    todayCalls = await prisma.callRecord.findMany({
      where: { createdAt: { gte: today } },
      include: { analysis: true }
    });

    yesterdayCalls = await prisma.callRecord.findMany({
      where: { createdAt: { gte: yesterday, lt: today } },
      include: { analysis: true }
    });

    redZoneCalls = await prisma.aiAnalysis.findMany({
      where: { score: { lte: 3 } },
      orderBy: { createdAt: 'desc' },
      take: 3,
      include: { call: { include: { user: true } } }
    });

    latestDbCalls = await prisma.callRecord.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: { user: true, analysis: true }
    });
  } catch (error) {
    console.error("DB xato, mock data ishlatiladi:", error);
  }

  // Leaderboard hisoblash
  const leaderboard = dbUsers.map(user => {
    const scoredCalls = user.calls.filter((c: any) => c.analysis !== null);
    const totalScore = scoredCalls.reduce((sum: number, c: any) => sum + (c.analysis?.score || 0), 0);
    const avgScore = scoredCalls.length > 0 ? totalScore / scoredCalls.length : 0;
    const words = user.name.split(' ');
    const initial = words.length > 1 ? `${words[0][0]}${words[1][0]}` : user.name.substring(0, 2);
    const colors = ["bg-blue-500", "bg-purple-500", "bg-emerald-500", "bg-orange-500", "bg-cyan-500"];
    const randColor = colors[user.id.charCodeAt(0) % colors.length];
    return { name: user.name, sales: user.calls.length, score: Number(avgScore.toFixed(1)), initial: initial.toUpperCase(), color: randColor };
  }).sort((a, b) => b.score - a.score || b.sales - a.sales).slice(0, 5);

  const getAvg = (calls: any[]) => {
    const scored = calls.filter(c => c.analysis !== null);
    if (!scored.length) return 0;
    return scored.reduce((sum, c) => sum + c.analysis.score, 0) / scored.length;
  };

  const todayAvg = getAvg(todayCalls);
  const yesterdayAvg = getAvg(yesterdayCalls);
  const diffAvg = todayAvg - yesterdayAvg;

  const scoredToday = todayCalls.filter(c => c.analysis !== null);
  const totalScored = scoredToday.length || 1;
  const fiveStars = scoredToday.filter(c => c.analysis.score === 5).length;
  const fourStars = scoredToday.filter(c => c.analysis.score === 4).length;
  const lowStars = scoredToday.filter(c => c.analysis.score <= 3).length;

  const pct5 = Math.round((fiveStars / totalScored) * 100);
  const pct4 = Math.round((fourStars / totalScored) * 100);
  const pctLow = Math.round((lowStars / totalScored) * 100);

  const redZoneList = redZoneCalls.map(analysis => {
    const summary = analysis.summary || "Nomalum xato";
    const reason = summary.length > 30 ? summary.substring(0, 30) + "..." : summary;
    return { name: analysis.call.user.name, id: `#${analysis.call.id.slice(-4).toUpperCase()}`, reason, score: analysis.score };
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
    let clientPhone = c.customerPhone;
    if (clientPhone.length >= 12) {
      clientPhone = `${clientPhone.slice(0, 4)} ${clientPhone.slice(4, 6)} *** ${clientPhone.slice(-4, -2)} ${clientPhone.slice(-2)}`;
    }
    return {
      time: new Date(c.createdAt).toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' }),
      agent: c.user.name,
      client: clientPhone,
      status: statusText,
      statusColor
    };
  });

  const showsPlaceholder = todayCalls.length === 0 && dbUsers.length === 0;

  const displayScore    = showsPlaceholder ? 4.2 : Number(todayAvg.toFixed(1));
  const displayDiff     = showsPlaceholder ? 0.4 : Number(diffAvg.toFixed(1));
  const displayPct5     = showsPlaceholder ? 45 : pct5;
  const displayPct4     = showsPlaceholder ? 30 : pct4;
  const displayPctLow   = showsPlaceholder ? 25 : pctLow;

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

  return (
    <div className="min-h-screen bg-[#09090b] text-white">
      <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">

        {/* ===== HEADER ===== */}
        <header className="sticky top-4 z-50 flex items-center justify-between px-6 py-4 rounded-2xl backdrop-blur-md bg-black/40 border border-white/10 shadow-2xl">
          <div className="flex items-center gap-3">
            <div className="size-8 rounded-full bg-blue-600 flex items-center justify-center shadow-[0_0_15px_rgba(37,99,235,0.5)]">
              <PhoneIncoming className="size-4 text-white" />
            </div>
            <h1 className="text-xl font-bold font-space-grotesk tracking-tight bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
              AI SALES PILOT
            </h1>
          </div>

          <div className="hidden md:flex items-center bg-white/5 border border-white/10 rounded-full px-4 py-2 w-96 focus-within:border-blue-500/40 focus-within:bg-blue-500/5 transition-all">
            <Search className="size-4 text-white/50 mr-2 shrink-0" />
            <input
              type="text"
              placeholder="Mijoz ismi yoki qo'ng'iroq ID..."
              className="bg-transparent border-none outline-none text-sm text-white/90 w-full placeholder:text-white/40"
            />
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium leading-none">Rustamov S.</p>
              <p className="text-xs text-white/50">Sotuv Rahbari (ROP)</p>
            </div>
            <div className="size-10 rounded-full bg-zinc-800 border-2 border-white/10 overflow-hidden ring-2 ring-blue-500/20">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="avatar" />
            </div>
            <div className="hidden sm:block h-8 w-px bg-white/10" />
            <Link
              href="/agents"
              className="flex items-center gap-2 px-3 py-2 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 rounded-lg transition-all border border-purple-500/20 hover:border-purple-500/40 text-sm font-medium"
            >
              <Users className="size-4" />
              <span className="hidden sm:inline">Xodimlar</span>
            </Link>
            <Link
              href="/login"
              className="flex items-center gap-2 px-3 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 rounded-lg transition-all border border-rose-500/20 hover:border-rose-500/40 text-sm font-medium"
            >
              <LogOut className="size-4" />
              <span className="hidden sm:inline">Chiqish</span>
            </Link>
          </div>
        </header>

        {/* ===== ANIMATED CLIENT CONTENT ===== */}
        <DashboardClient
          displayScore={displayScore}
          displayDiff={displayDiff}
          displayPct5={displayPct5}
          displayPct4={displayPct4}
          displayPctLow={displayPctLow}
          displayLeaderboard={displayLeaderboard}
          displayRedZone={displayRedZone}
          displayLatest={displayLatest}
          showsPlaceholder={showsPlaceholder}
        />

      </div>
    </div>
  );
}
