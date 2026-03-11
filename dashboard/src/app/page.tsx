import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Search, PhoneIncoming, AlertCircle } from "lucide-react";

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
        
        {/* Massive Number Overview */}
        <Card className="md:col-span-2 bg-[#18181b] border-white/10 shadow-xl overflow-hidden relative group">
          <div className="absolute inset-0 bg-blue-600/5 group-hover:bg-blue-600/10 transition-colors duration-500" />
          <CardHeader>
            <CardTitle className="text-white/60 text-sm font-medium tracking-wide">
               BO'LIMNING BUGUNGI O'RTACHA BALI
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-end justify-between">
            <div className="flex flex-col">
              <span className="text-7xl font-bold font-space-grotesk text-transparent bg-clip-text bg-gradient-to-br from-emerald-400 to-cyan-400 drop-shadow-sm">
                4.2
              </span>
              <span className="text-sm text-emerald-400 mt-2 flex items-center gap-1 font-medium">
                <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 bg-emerald-500/10">
                  +0.4 kechagiga nisbatan
                </Badge>
              </span>
            </div>
            
            <div className="space-y-3 w-48 hidden sm:block">
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-white/60">
                  <span>5 ball:</span>
                  <span className="font-medium text-emerald-400">45%</span>
                </div>
                <Progress value={45} className="h-1 bg-white/5 [&>div]:bg-emerald-400" />
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-white/60">
                  <span>4 ball:</span>
                  <span className="font-medium text-cyan-400">30%</span>
                </div>
                <Progress value={30} className="h-1 bg-white/5 [&>div]:bg-cyan-400" />
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-white/60">
                  <span>1-3 ball:</span>
                  <span className="font-medium text-rose-500">25%</span>
                </div>
                <Progress value={25} className="h-1 bg-white/5 [&>div]:bg-rose-500" />
              </div>
            </div>
          </CardContent>
        </Card>

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
