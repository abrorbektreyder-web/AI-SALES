'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { 
  UserPlus, Users, Search, ArrowLeft, Phone, Lock, User, 
  Trash2, Edit3, X, Eye, EyeOff, Copy, Check, RefreshCw,
  PhoneIncoming, Shield
} from 'lucide-react';

interface Agent {
  id: string;
  name: string;
  phone: string;
  averageScore: number | null;
  createdAt: string;
  _count: { calls: number };
}

// ========== PAROL GENERATOR ==========
function generatePassword(length = 8): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);

  // Form states
  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formPassword, setFormPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [copiedId, setCopiedId] = useState('');
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // ========== FETCH AGENTS ==========
  const fetchAgents = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/agents');
      const data = await res.json();
      setAgents(data.agents || []);
    } catch {
      console.error('Agentlarni yuklashda xato');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAgents();
  }, [fetchAgents]);

  // ========== ADD AGENT ==========
  const handleAddAgent = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setSubmitting(true);

    try {
      const res = await fetch('/api/agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formName,
          phone: formPhone,
          password: formPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setFormError(data.error || 'Xato yuz berdi');
        return;
      }

      setShowAddModal(false);
      resetForm();
      fetchAgents();
    } catch {
      setFormError('Server bilan bog\'lanishda xato');
    } finally {
      setSubmitting(false);
    }
  };

  // ========== EDIT AGENT (Password Reset) ==========
  const handleEditAgent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAgent) return;
    setFormError('');
    setSubmitting(true);

    try {
      const updateData: Record<string, string> = {};
      if (formName && formName !== selectedAgent.name) updateData.name = formName;
      if (formPhone && formPhone !== selectedAgent.phone) updateData.phone = formPhone;
      if (formPassword) updateData.password = formPassword;

      if (Object.keys(updateData).length === 0) {
        setFormError("Hech qanday o'zgartirish kiritilmadi");
        setSubmitting(false);
        return;
      }

      const res = await fetch(`/api/agents/${selectedAgent.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });

      const data = await res.json();
      if (!res.ok) {
        setFormError(data.error || 'Xato yuz berdi');
        return;
      }

      setShowEditModal(false);
      resetForm();
      fetchAgents();
    } catch {
      setFormError('Server bilan bog\'lanishda xato');
    } finally {
      setSubmitting(false);
    }
  };

  // ========== DELETE AGENT ==========
  const handleDeleteAgent = async () => {
    if (!selectedAgent) return;
    setSubmitting(true);

    try {
      const res = await fetch(`/api/agents/${selectedAgent.id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const data = await res.json();
        setFormError(data.error || 'Xato yuz berdi');
        return;
      }

      setShowDeleteModal(false);
      setSelectedAgent(null);
      fetchAgents();
    } catch {
      setFormError('Server bilan bog\'lanishda xato');
    } finally {
      setSubmitting(false);
    }
  };

  // ========== HELPERS ==========
  const resetForm = () => {
    setFormName('');
    setFormPhone('');
    setFormPassword('');
    setFormError('');
    setShowPassword(false);
    setSelectedAgent(null);
  };

  const openEditModal = (agent: Agent) => {
    setSelectedAgent(agent);
    setFormName(agent.name);
    setFormPhone(agent.phone);
    setFormPassword('');
    setFormError('');
    setShowEditModal(true);
  };

  const openDeleteModal = (agent: Agent) => {
    setSelectedAgent(agent);
    setShowDeleteModal(true);
  };

  const handleCopyCredentials = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(''), 2000);
  };

  const filteredAgents = agents.filter(
    (a) =>
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.phone.includes(searchQuery)
  );

  const getScoreColor = (score: number | null) => {
    if (!score) return 'text-white/40';
    if (score >= 4) return 'text-emerald-400';
    if (score >= 3) return 'text-yellow-400';
    return 'text-rose-400';
  };

  const getScoreBg = (score: number | null) => {
    if (!score) return 'bg-white/5';
    if (score >= 4) return 'bg-emerald-500/10';
    if (score >= 3) return 'bg-yellow-500/10';
    return 'bg-rose-500/10';
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-white p-4 md:p-8 max-w-7xl mx-auto space-y-6">

      {/* ===== HEADER ===== */}
      <header className="sticky top-4 z-50 flex items-center justify-between px-6 py-4 rounded-2xl backdrop-blur-md bg-black/40 border border-white/10 shadow-2xl">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="flex items-center gap-2 text-white/60 hover:text-white transition-colors">
            <ArrowLeft className="size-4" />
            <span className="text-sm hidden sm:inline">Dashboard</span>
          </Link>
          <div className="h-5 w-px bg-white/10" />
          <div className="size-8 rounded-full bg-purple-600 flex items-center justify-center">
            <Users className="size-4 text-white" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">
            Xodimlar boshqaruvi
          </h1>
        </div>
        <button
          onClick={() => { resetForm(); setFormPassword(generatePassword()); setShowAddModal(true); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl transition-colors text-sm font-semibold shadow-lg shadow-emerald-500/20"
        >
          <UserPlus className="size-4" />
          <span className="hidden sm:inline">Yangi sotuvchi</span>
        </button>
      </header>

      {/* ===== STATS + SEARCH ===== */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Stats */}
        <div className="bg-[#18181b] border border-white/5 rounded-2xl p-5 flex items-center gap-4">
          <div className="size-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
            <Users className="size-6 text-purple-400" />
          </div>
          <div>
            <p className="text-2xl font-bold">{agents.length}</p>
            <p className="text-xs text-white/50">Jami sotuvchilar</p>
          </div>
        </div>

        <div className="bg-[#18181b] border border-white/5 rounded-2xl p-5 flex items-center gap-4">
          <div className="size-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
            <PhoneIncoming className="size-6 text-emerald-400" />
          </div>
          <div>
            <p className="text-2xl font-bold">
              {agents.reduce((sum, a) => sum + a._count.calls, 0)}
            </p>
            <p className="text-xs text-white/50">Jami qo&apos;ng&apos;iroqlar</p>
          </div>
        </div>

        <div className="bg-[#18181b] border border-white/5 rounded-2xl p-5 flex items-center gap-4">
          <div className="size-12 rounded-xl bg-cyan-500/10 flex items-center justify-center">
            <Shield className="size-6 text-cyan-400" />
          </div>
          <div>
            <p className="text-2xl font-bold">
              {agents.filter(a => (a.averageScore ?? 0) >= 4).length}
            </p>
            <p className="text-xs text-white/50">4+ ball olgan</p>
          </div>
        </div>

        {/* Search */}
        <div className="bg-[#18181b] border border-white/5 rounded-2xl p-3 flex items-center">
          <Search className="size-4 text-white/40 ml-2 mr-3 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Ism yoki telefon qidirish..."
            className="bg-transparent border-none outline-none text-sm text-white/90 w-full placeholder:text-white/30"
          />
        </div>
      </div>

      {/* ===== AGENTS TABLE ===== */}
      <div className="bg-[#18181b] border border-white/5 rounded-2xl overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-white/[0.02] border-b border-white/5 text-xs font-semibold text-white/40 uppercase tracking-widest">
          <div className="col-span-4">Sotuvchi</div>
          <div className="col-span-2 hidden md:block">Telefon</div>
          <div className="col-span-1 hidden md:block text-center">Ball</div>
          <div className="col-span-2 hidden md:block text-center">Qo&apos;ng&apos;iroqlar</div>
          <div className="col-span-1 hidden md:block">Sana</div>
          <div className="col-span-2 text-right">Amallar</div>
        </div>

        {/* Table Body */}
        {loading ? (
          <div className="flex items-center justify-center py-20 text-white/40">
            <RefreshCw className="size-5 animate-spin mr-3" />
            Yuklanmoqda...
          </div>
        ) : filteredAgents.length === 0 ? (
          <div className="text-center py-20">
            <Users className="size-12 text-white/10 mx-auto mb-4" />
            <p className="text-white/40 text-sm">
              {searchQuery ? "Hech qanday natija topilmadi" : "Hali sotuvchilar qo'shilmagan"}
            </p>
            {!searchQuery && (
              <button
                onClick={() => { resetForm(); setFormPassword(generatePassword()); setShowAddModal(true); }}
                className="mt-4 text-emerald-400 hover:text-emerald-300 text-sm font-medium"
              >
                + Birinchi sotuvchini qo&apos;shing
              </button>
            )}
          </div>
        ) : (
          filteredAgents.map((agent) => {
            const initials = agent.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
            const colors = ['bg-blue-500', 'bg-purple-500', 'bg-emerald-500', 'bg-orange-500', 'bg-cyan-500', 'bg-pink-500'];
            const color = colors[agent.id.charCodeAt(0) % colors.length];

            return (
              <div key={agent.id} className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors items-center">
                {/* Name */}
                <div className="col-span-4 flex items-center gap-3">
                  <div className={`size-10 rounded-full flex items-center justify-center text-xs font-bold text-white ${color} shrink-0`}>
                    {initials}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white/90 truncate">{agent.name}</p>
                    <p className="text-xs text-white/40 md:hidden">{agent.phone}</p>
                  </div>
                </div>

                {/* Phone */}
                <div className="col-span-2 hidden md:flex items-center gap-2">
                  <span className="text-sm text-white/70 font-mono">{agent.phone}</span>
                  <button
                    onClick={() => handleCopyCredentials(agent.phone, `phone-${agent.id}`)}
                    className="text-white/20 hover:text-white/60 transition-colors"
                    title="Nusxalash"
                  >
                    {copiedId === `phone-${agent.id}` ? <Check className="size-3.5 text-emerald-400" /> : <Copy className="size-3.5" />}
                  </button>
                </div>

                {/* Score */}
                <div className="col-span-1 hidden md:flex justify-center">
                  <span className={`text-sm font-bold px-2.5 py-1 rounded-lg ${getScoreColor(agent.averageScore)} ${getScoreBg(agent.averageScore)}`}>
                    {agent.averageScore ? agent.averageScore.toFixed(1) : '—'}
                  </span>
                </div>

                {/* Calls count */}
                <div className="col-span-2 hidden md:flex justify-center">
                  <span className="text-sm text-white/60">{agent._count.calls} ta</span>
                </div>

                {/* Date */}
                <div className="col-span-1 hidden md:block">
                  <span className="text-xs text-white/40">
                    {new Date(agent.createdAt).toLocaleDateString('uz-UZ', { day: '2-digit', month: '2-digit' })}
                  </span>
                </div>

                {/* Actions */}
                <div className="col-span-8 md:col-span-2 flex items-center justify-end gap-2">
                  <button
                    onClick={() => openEditModal(agent)}
                    className="p-2 rounded-lg bg-white/5 hover:bg-blue-500/20 text-white/40 hover:text-blue-400 transition-colors"
                    title="Tahrirlash"
                  >
                    <Edit3 className="size-4" />
                  </button>
                  <button
                    onClick={() => openDeleteModal(agent)}
                    className="p-2 rounded-lg bg-white/5 hover:bg-rose-500/20 text-white/40 hover:text-rose-400 transition-colors"
                    title="O'chirish"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ===== ADD AGENT MODAL ===== */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setShowAddModal(false)}>
          <div className="bg-[#1c1c1e] border border-white/10 rounded-2xl w-full max-w-md shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-white/5">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <UserPlus className="size-5 text-emerald-400" />
                Yangi sotuvchi qo&apos;shish
              </h2>
              <button onClick={() => setShowAddModal(false)} className="text-white/40 hover:text-white">
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleAddAgent} className="p-6 space-y-4">
              {formError && (
                <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm px-4 py-3 rounded-xl">
                  {formError}
                </div>
              )}

              {/* Name */}
              <div>
                <label className="text-xs text-white/50 mb-1.5 block font-medium">Ism va familiya</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-white/30" />
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Rustamov Sardor"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/10 transition-all"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="text-xs text-white/50 mb-1.5 block font-medium">Telefon raqam (login sifatida)</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-white/30" />
                  <input
                    type="tel"
                    required
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    placeholder="+998901234567"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/10 transition-all font-mono"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="text-xs text-white/50 mb-1.5 block font-medium">Parol</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-white/30" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={formPassword}
                    onChange={(e) => setFormPassword(e.target.value)}
                    placeholder="Kamida 6 belgi"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-24 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/10 transition-all font-mono"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="p-1.5 text-white/30 hover:text-white/60">
                      {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                    <button type="button" onClick={() => setFormPassword(generatePassword())} className="p-1.5 text-white/30 hover:text-emerald-400" title="Yangi parol yaratish">
                      <RefreshCw className="size-4" />
                    </button>
                    <button type="button" onClick={() => handleCopyCredentials(formPassword, 'new-pass')} className="p-1.5 text-white/30 hover:text-white/60">
                      {copiedId === 'new-pass' ? <Check className="size-4 text-emerald-400" /> : <Copy className="size-4" />}
                    </button>
                  </div>
                </div>
                <p className="text-[11px] text-white/30 mt-1.5">
                  💡 Ushbu login va parolni sotuvchiga bering — u telefonidan ilovaga kirish uchun ishlatadi
                </p>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-colors text-sm mt-2"
              >
                {submitting ? 'Saqlanmoqda...' : "Sotuvchini qo'shish"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ===== EDIT AGENT MODAL ===== */}
      {showEditModal && selectedAgent && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setShowEditModal(false)}>
          <div className="bg-[#1c1c1e] border border-white/10 rounded-2xl w-full max-w-md shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-white/5">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Edit3 className="size-5 text-blue-400" />
                Sotuvchini tahrirlash
              </h2>
              <button onClick={() => setShowEditModal(false)} className="text-white/40 hover:text-white">
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleEditAgent} className="p-6 space-y-4">
              {formError && (
                <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm px-4 py-3 rounded-xl">
                  {formError}
                </div>
              )}

              {/* Name */}
              <div>
                <label className="text-xs text-white/50 mb-1.5 block font-medium">Ism va familiya</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-white/30" />
                  <input
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10 transition-all"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="text-xs text-white/50 mb-1.5 block font-medium">Telefon raqam</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-white/30" />
                  <input
                    type="tel"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white font-mono focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10 transition-all"
                  />
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="text-xs text-white/50 mb-1.5 block font-medium">Yangi parol (ixtiyoriy)</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-white/30" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formPassword}
                    onChange={(e) => setFormPassword(e.target.value)}
                    placeholder="Bo'sh qoldiring — o'zgarishsiz qoladi"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-24 text-sm text-white placeholder:text-white/20 font-mono focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10 transition-all"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="p-1.5 text-white/30 hover:text-white/60">
                      {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                    <button type="button" onClick={() => setFormPassword(generatePassword())} className="p-1.5 text-white/30 hover:text-blue-400">
                      <RefreshCw className="size-4" />
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-colors text-sm mt-2"
              >
                {submitting ? 'Saqlanmoqda...' : "Saqlash"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ===== DELETE CONFIRM MODAL ===== */}
      {showDeleteModal && selectedAgent && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setShowDeleteModal(false)}>
          <div className="bg-[#1c1c1e] border border-rose-500/20 rounded-2xl w-full max-w-sm shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 text-center">
              <div className="size-14 rounded-full bg-rose-500/10 flex items-center justify-center mx-auto mb-4">
                <Trash2 className="size-7 text-rose-400" />
              </div>
              <h3 className="text-lg font-bold mb-2">Sotuvchini o&apos;chirish?</h3>
              <p className="text-sm text-white/50 mb-1">
                <span className="text-white font-medium">{selectedAgent.name}</span> ni tizimdan butunlay o&apos;chiriladi.
              </p>
              <p className="text-xs text-rose-400/70">
                ⚠️ Barcha qo&apos;ng&apos;iroqlar va tahlillar ham o&apos;chadi. Bu amalni qaytarib bo&apos;lmaydi!
              </p>
            </div>
            <div className="flex gap-3 p-6 pt-0">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 text-sm font-medium transition-colors"
              >
                Bekor qilish
              </button>
              <button
                onClick={handleDeleteAgent}
                disabled={submitting}
                className="flex-1 py-3 rounded-xl bg-rose-500 hover:bg-rose-600 disabled:opacity-50 text-white text-sm font-semibold transition-colors"
              >
                {submitting ? "O'chirilmoqda..." : "Ha, o'chirish"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
