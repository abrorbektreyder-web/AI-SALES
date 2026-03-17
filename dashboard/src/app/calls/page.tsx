"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { format, subDays, isSameDay } from "date-fns";
import { uz } from "date-fns/locale";
import { Search, Calendar as CalendarIcon, Play, Pause, ChevronLeft, PhoneIncoming, AlertCircle, PlayCircle, Clock } from "lucide-react";
import Link from "next/link";
import WaveSurfer from "wavesurfer.js";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";


// Dummy kiritish ma'lumotlari (eski kunlar va oylar uchun)
const generateMockCalls = () => {
  const calls = [];
  const agents = ["Rustamov S.", "Qodirova M.", "Aliev J.", "Jo'rayev A.", "Sattorov B.", "Olimov D.", "Toshmatov N."];
  const statuses = [
    { score: 5.0, color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
    { score: 4.2, color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20" },
    { score: 3.5, color: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20" },
    { score: 2.0, color: "text-rose-400 bg-rose-500/10 border-rose-500/20" },
    { score: 1.0, color: "text-rose-400 bg-rose-500/10 border-rose-500/20" },
  ];

  for (let i = 0; i < 50; i++) {
    const isToday = i < 5;
    const date = isToday ? new Date() : subDays(new Date(), Math.floor(Math.random() * 60) + 1);
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const durationObj = Math.floor(Math.random() * 300) + 60; // 60s to 360s
    
    calls.push({
      id: `C${1000 + i}`,
      agent: agents[Math.floor(Math.random() * agents.length)],
      client: `+998 9${Math.floor(Math.random() * 10)} *** ${Math.floor(Math.random() * 90) + 10} ${Math.floor(Math.random() * 90) + 10}`,
      date: date,
      duration: `${Math.floor(durationObj / 60)}:${(durationObj % 60).toString().padStart(2, '0')}`,
      score: status.score,
      statusColor: status.color,
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", // Demo audio
      aiSummary: status.score >= 4 ? "Suhbat a'lo darajada o'tdi. Sotuvchi barcha savollarga to'g'ri va xushmuomala javob berdi. Skriptga 100% amal qilingan." :
                status.score >= 3 ? "Suhbat yaxshi, lekin qo'shimcha mahsulot (cross-sell) haqida ma'lumot berilmadi. Mijozning ba'zi e'tirozlari ochiq qoldi." :
                "Kritik Suhbat. Sotuvchi mijozning o'tkir savollariga tutilib qoldi va qo'pollik ishlatishga sal qoldi. Shoshilinch dars tavsiya etiladi."
    });
  }
  return calls.sort((a, b) => b.date.getTime() - a.date.getTime());
};

const mockCalls = generateMockCalls();

export default function CallsHistory() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [searchQuery, setSearchQuery] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedCall, setSelectedCall] = useState<any>(null);
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [realCalls, setRealCalls] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchCalls() {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("/api/calls", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (!res.ok) throw new Error("API xatosi");
        
        const data = await res.json();
        
        if (data && data.length > 0) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const mappedCalls = data.map((c: any) => {
             let clientPhone = c.customerPhone || "";
             if (clientPhone.length >= 12) {
               clientPhone = `${clientPhone.slice(0, 4)} ${clientPhone.slice(4, 6)} *** ${clientPhone.slice(-4, -2)} ${clientPhone.slice(-2)}`;
             }
             
             let score = 0;
             let summary = "Hali tahlil qilinmadi";
             let color = "text-yellow-400 bg-yellow-500/10 border-yellow-500/20";
             
             if (c.analysis) {
               score = c.analysis.score;
               summary = c.analysis.summary || "";
               if (score >= 4.5) color = "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
               else if (score >= 4) color = "text-cyan-400 bg-cyan-500/10 border-cyan-500/20";
               else color = "text-rose-400 bg-rose-500/10 border-rose-500/20";
             }
             
             return {
               id: c.id,
               agent: c.user?.name || "Noma'lum xodim",
               client: clientPhone,
               date: new Date(c.createdAt),
               duration: `${Math.floor(c.durationSec / 60)}:${(c.durationSec % 60).toString().padStart(2, '0')}`,
               score: score,
               statusColor: color,
               audioUrl: c.audioUrl || "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
               aiSummary: summary
             };
          });
          setRealCalls(mappedCalls);
        }
      } catch (err) {
        console.error("Qo'ng'iroqlarni yuklashda xato, Mock dataga o'tilmoqda:", err);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchCalls();
  }, []);

  // Filter with useMemo
  const filteredCalls = useMemo(() => {
    let result = realCalls.length > 0 ? realCalls : mockCalls;
    if (date) {
      result = result.filter(call => isSameDay(call.date, date));
    }
    if (searchQuery) {
      result = result.filter(call => 
        call.agent.toLowerCase().includes(searchQuery.toLowerCase()) || 
        call.client.includes(searchQuery)
      );
    }
    return result;
  }, [date, searchQuery, realCalls]);

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="outline" size="icon" className="border-white/10 hover:bg-white/5 bg-transparent text-white rounded-full">
              <ChevronLeft className="size-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold font-space-grotesk tracking-tight text-white flex items-center gap-3">
              <PhoneIncoming className="size-6 text-blue-500" />
              Suhbatlar Arxivi & Analitikasi
            </h1>
            <p className="text-white/40 text-sm mt-1">Eski va yangi suhbatlarni izlash, tinglash va AI xulosalarini o&apos;qish imkoniyati</p>
          </div>
        </div>
      </header>

      {/* Filters Bar */}
      <Card className="bg-[#18181b] border-white/5 shadow-xl">
        <CardContent className="p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex w-full md:w-1/2 items-center bg-white/5 border border-white/10 rounded-xl px-4 py-2">
            <Search className="size-4 text-white/50 mr-2" />
            <input
              type="text"
              placeholder="Xodim ismi yoki mijoz raqami..."
              className="bg-transparent border-none outline-none text-sm text-white/90 w-full placeholder:text-white/40"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex gap-4 w-full md:w-auto">
            <Popover>
              <PopoverTrigger
                className={`inline-flex items-center w-full md:w-[240px] justify-start text-left font-normal rounded-md border px-3 py-2 text-sm bg-white/5 border-white/10 text-white hover:bg-white/10 cursor-pointer ${!date && "text-white/50"}`}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP", { locale: uz }) : "Sanani tanlang"}
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-[#18181b] border-white/10 text-white" align="end">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  className="bg-[#18181b] text-white"
                />
              </PopoverContent>
            </Popover>
            
            <Button variant="outline" className="bg-transparent border-white/10 hover:bg-white/5 text-white" onClick={() => { setDate(undefined); setSearchQuery(""); }}>
              Barchasi
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Calls Table */}
      <Card className="bg-[#18181b] border-white/5 shadow-xl overflow-hidden">
        <div className="max-h-[600px] overflow-y-auto custom-scrollbar">
          <table className="w-full text-sm text-left text-white/80">
            <thead className="text-xs text-white/50 uppercase bg-white/5 sticky top-0 backdrop-blur-md">
              <tr>
                <th scope="col" className="px-6 py-4 font-medium tracking-widest">Sana & Vaqt</th>
                <th scope="col" className="px-6 py-4 font-medium tracking-widest">Xodim</th>
                <th scope="col" className="px-6 py-4 font-medium tracking-widest">Mijoz Raqami</th>
                <th scope="col" className="px-6 py-4 font-medium tracking-widest">Davomiyligi</th>
                <th scope="col" className="px-6 py-4 font-medium tracking-widest text-center">AI Bahosi</th>
                <th scope="col" className="px-6 py-4 font-medium tracking-widest text-right">Eshitish</th>
              </tr>
            </thead>
            <tbody>
              {filteredCalls.length > 0 ? (
                filteredCalls.map((call, idx) => (
                  <tr key={idx} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-medium">{format(call.date, "dd MMM, yyyy", { locale: uz })}</div>
                      <div className="text-xs text-white/40">{format(call.date, "HH:mm")}</div>
                    </td>
                    <td className="px-6 py-4 font-medium text-white/90">{call.agent}</td>
                    <td className="px-6 py-4 font-mono">{call.client}</td>
                    <td className="px-6 py-4 text-white/60 flex items-center gap-2">
                       <Clock className="size-3" /> {call.duration}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Badge variant="outline" className={`font-bold px-3 py-1 ${call.statusColor}`}>
                        {call.score.toFixed(1)}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 transition-colors rounded-full"
                        onClick={() => setSelectedCall(call)}
                      >
                        <PlayCircle className="size-5 mr-1" /> Tinglash
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-white/40">
                    Suhbatlar topilmadi. Boshqa sanani tanlang.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Premium Audio Player & AI Analysis Modal */}
      <Dialog open={!!selectedCall} onOpenChange={(open) => !open && setSelectedCall(null)}>
        <DialogContent className="sm:max-w-[490px] max-h-[90vh] overflow-y-auto border-white/10 bg-[#121214] text-white p-0 shadow-[0_0_50px_-12px_rgba(0,0,0,0.8)]">
          {selectedCall && <AudioPlayerModalContent call={selectedCall} />}
        </DialogContent>
      </Dialog>
      
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: rgba(255, 255, 255, 0.2);
        }
      `}} />
    </div>
  );
}

// ----------------------------------------------------
// WAVE SURFER AUDIO PLAYER COMPONENT (PREMIUM UX)
// ----------------------------------------------------
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function AudioPlayerModalContent({ call }: { call: any }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize WaveSurfer
    const ws = WaveSurfer.create({
      container: containerRef.current,
      waveColor: 'rgba(255, 255, 255, 0.2)',
      progressColor: call.score >= 4 ? '#34d399' : call.score >= 3 ? '#fbbf24' : '#f43f5e',
      cursorColor: 'transparent',
      barWidth: 3,
      barGap: 2,
      barRadius: 3,
      height: 50,
      url: call.audioUrl,
    });

    wavesurferRef.current = ws;

    ws.on('ready', () => {
      setIsReady(true);
      setDuration(ws.getDuration());
    });

    ws.on('audioprocess', () => {
      setCurrentTime(ws.getCurrentTime());
    });

    ws.on('play', () => setIsPlaying(true));
    ws.on('pause', () => setIsPlaying(false));
    ws.on('finish', () => setIsPlaying(false));

    return () => {
      ws.destroy();
    };
  }, [call.audioUrl, call.score]);

  const togglePlayPause = () => {
    if (wavesurferRef.current) {
      wavesurferRef.current.playPause();
    }
  };

  const formatTime = (time: number) => {
    const min = Math.floor(time / 60);
    const sec = Math.floor(time % 60);
    return `${min}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col h-full w-full">
      {/* Header Info */}
      <div className="px-6 py-4 bg-[#18181b] border-b border-white/5 flex items-start justify-between shrink-0">
        <div>
          <Badge variant="outline" className={`mb-2 ${call.statusColor}`}>
            AI Bahosi: {call.score.toFixed(1)} / 5.0
          </Badge>
          <h2 className="text-base font-bold text-white tracking-wide">{call.agent} <span className="text-white/40 font-normal">bilan suhbat</span></h2>
          <p className="text-xs font-mono text-white/50 mt-1">{call.client} • {format(call.date, "dd MMM, yyyy HH:mm", { locale: uz })}</p>
        </div>
      </div>

      {/* Waveform Player */}
      <div className="px-6 py-5 bg-gradient-to-b from-[#18181b] to-[#121214] flex flex-col items-center shrink-0">
        <div className="w-full relative">
          {!isReady && (
            <div className="absolute inset-0 flex items-center justify-center bg-[#121214]/80 z-10 backdrop-blur-sm">
              <div className="text-xs text-white/50 flex flex-col items-center animate-pulse">
                <span className="mb-2 size-5 border-2 border-white/20 border-t-white/80 rounded-full animate-spin"></span>
                Audio yuklanmoqda...
              </div>
            </div>
          )}
          <div ref={containerRef} className="w-full" />
        </div>
        
        <div className="w-full flex items-center justify-between mt-3 text-[10px] font-mono text-white/40">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>

        <div className="mt-4 flex items-center gap-6">
          <Button 
            onClick={togglePlayPause} 
            disabled={!isReady}
            className={`size-12 rounded-full p-0 flex items-center justify-center text-white shadow-lg shadow-white/5 transition-all ${isPlaying ? 'bg-white/10 hover:bg-white/20' : call.score >= 4 ? 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20' : call.score >= 3 ? 'bg-yellow-500 hover:bg-yellow-600 shadow-yellow-500/20' : 'bg-rose-500 hover:bg-rose-600 shadow-rose-500/20'}`}
          >
            {isPlaying ? <Pause className="size-5 fill-current" /> : <Play className="size-5 fill-current ml-1" />}
          </Button>
        </div>
      </div>

      {/* AI Summary Section */}
      <div className="p-5 bg-[#18181b] border-t border-white/5 overflow-y-auto">
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-white/40 flex items-center gap-2 mb-2">
          <AlertCircle className="size-3" />
          Neyrotarmoq Xulosasi
        </h3>
        <p className="text-sm text-white/80 leading-relaxed font-medium">
          {call.aiSummary}
        </p>

        {call.score < 4 && (
          <div className="mt-4 p-3 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-start gap-3">
            <div className="size-7 rounded-full bg-orange-500/20 flex items-center justify-center shrink-0">
               <span className="text-orange-400 font-bold text-sm">!</span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-orange-400">Tavsiya etilgan dars:</h4>
              <p className="text-xs text-white/60 mt-1 mb-2 leading-tight">{call.score < 3 ? "\"E'tirozlarni yengish va agressiv mijoz bilan ishlash\"" : "\"Cross-sell: Qo'shimcha savdo sirlari\""} nomli videokursni xodimga zudlik bilan yuboring.</p>
              <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white text-[10px] h-6 px-3">Xodim rejasiga qo&apos;shish</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
