import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Search, PhoneIncoming, AlertCircle, Activity, ArrowUpRight } from "lucide-react";

export default function Dashboard() {
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
            placeholder="Mijoz ismi yoki qo'ng'iroq ID..."
            className="bg-transparent border-none outline-none text-sm text-white/90 w-full placeholder:text-white/40"
          />
        </div>
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
              Bo'limning Bugungi O'rtacha Bali
            </h3>
            
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 h-full">
              {/* Left: Circular Score */}
              <div className="flex items-center gap-6">
                <div className="relative w-36 h-36">
                  {/* SVG Circular Progress */}
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="18" cy="18" r="15.5" fill="none" className="stroke-white/5" strokeWidth="2.5" />
                    {/* 4.2 / 5.0 = 84% -> strokeDashoffset = length * (1 - 0.84) -> 97.38 * 0.16 = 15.58 */}
                    <circle cx="18" cy="18" r="15.5" fill="none" className="stroke-emerald-400" strokeWidth="2.5" strokeDasharray="97.38" strokeDashoffset="15.58" strokeLinecap="round" />
                  </svg>
                  {/* Inner Text */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-bold text-white tracking-tight font-sans">
                      4<span className="text-xl text-white/50 px-0.5">.</span>2
                    </span>
                    <span className="text-[10px] text-emerald-400/80 font-medium uppercase tracking-widest mt-1">/ 5.0</span>
                  </div>
                </div>
                
                <div className="flex flex-col gap-2">
                  <Badge variant="outline" className="border-emerald-500/20 text-emerald-400 bg-emerald-500/5 px-3 py-1 font-normal w-fit">
                    <ArrowUpRight className="w-3.5 h-3.5 mr-1" />
                    +0.4 O'sish
                  </Badge>
                  <p className="text-xs text-white/40 max-w-[120px] leading-relaxed">
                    Kechagiga nisbatan ijobiy dinamika saqlanib qolmoqda.
                  </p>
                </div>
              </div>

              {/* Right: Breakdown Bars */}
              <div className="w-full md:w-64 space-y-4">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs items-center">
                    <span className="text-white/60 font-medium tracking-wide">5 BALL</span>
                    <span className="font-bold text-emerald-400">45%</span>
                  </div>
                  <Progress value={45} className="h-1.5 bg-white/5 [&>div]:bg-emerald-400" />
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs items-center">
                    <span className="text-white/60 font-medium tracking-wide">4 BALL</span>
                    <span className="font-bold text-cyan-400">30%</span>
                  </div>
                  <Progress value={30} className="h-1.5 bg-white/5 [&>div]:bg-cyan-400" />
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs items-center">
                    <span className="text-white/60 font-medium tracking-wide">1-3 BALL</span>
                    <span className="font-bold text-rose-500">25%</span>
                  </div>
                  <Progress value={25} className="h-1.5 bg-white/5 [&>div]:bg-rose-500" />
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
            {[
              { name: "Aliev J.", id: "#1142", reason: "Mijoz asabiylashdi", score: 1 },
              { name: "Sattorov B.", id: "#1138", reason: "Qo'pollik", score: 1 },
              { name: "Karimov N.", id: "#1099", reason: "Skript buzilgan", score: 2 },
            ].map((err, i) => (
              <div key={i} className="flex items-start justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer border border-transparent hover:border-white/10 group">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm">{err.name}</span>
                    <span className="text-xs text-white/40">{err.id}</span>
                  </div>
                  <p className="text-xs text-rose-400 mt-1">{err.reason}</p>
                </div>
                <div className="size-7 rounded-sm bg-rose-500/20 text-rose-500 flex items-center justify-center font-bold text-xs border border-rose-500/20 group-hover:bg-rose-500 group-hover:text-white transition-colors">
                  {err.score}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Placeholder for Leaderboard and Latest Calls (To be built next) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-[#18181b] border-white/10 h-64 flex flex-col items-center justify-center text-white/30 border-dashed">
          <h3 className="font-space-grotesk text-sm">Top Reyting (Leaderboard) Xaritasi</h3>
          <p className="text-xs mt-2">Keyingi bosqichda ulanadi</p>
        </Card>
        <Card className="bg-[#18181b] border-white/10 h-64 flex flex-col items-center justify-center text-white/30 border-dashed">
          <h3 className="font-space-grotesk text-sm">So'nggi Qo'ng'iroqlar jadvali</h3>
          <p className="text-xs mt-2">Keyingi bosqichda ulanadi</p>
        </Card>
      </div>

    </div>
  );
}
