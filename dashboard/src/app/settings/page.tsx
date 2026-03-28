'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Settings, Key, Phone, Save, CheckCircle, AlertCircle, Eye, EyeOff, ExternalLink, Wifi } from 'lucide-react';
import { motion } from 'framer-motion';

interface OrgSettings {
  id?: string;
  name?: string;
  zadarmApiKey?: string;
  zadarmApiSecret?: string;
  zadarmSipBase?: string;
}

export default function SettingsPage() {
  const [org, setOrg] = useState<OrgSettings>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [showSecret, setShowSecret] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ ok: boolean; message: string } | null>(null);

  const [formKey, setFormKey] = useState('');
  const [formSecret, setFormSecret] = useState('');
  const [formSipBase, setFormSipBase] = useState('');
  const [formName, setFormName] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('/api/organization', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => {
        if (data.organization) {
          setOrg(data.organization);
          setFormKey(data.organization.zadarmApiKey || '');
          setFormSecret(data.organization.zadarmApiSecret || '');
          setFormSipBase(data.organization.zadarmSipBase || '');
          setFormName(data.organization.name || '');
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSaved(false);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/organization', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          name: formName,
          zadarmApiKey: formKey,
          zadarmApiSecret: formSecret,
          zadarmSipBase: formSipBase,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Xato'); return; }
      setOrg(data.organization);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setError('Server bilan aloqa yo\'q');
    } finally {
      setSaving(false);
    }
  };

  const handleTestApi = async () => {
    if (!formKey || !formSecret) { setTestResult({ ok: false, message: 'API Key va Secret kiriting' }); return; }
    setTesting(true);
    setTestResult(null);
    try {
      const res = await fetch('/api/organization/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify({ apiKey: formKey, apiSecret: formSecret }),
      });
      const data = await res.json();
      setTestResult({ ok: data.success, message: data.message || (data.success ? 'Ulanish muvaffaqiyatli!' : 'Ulanish xato') });
    } catch {
      setTestResult({ ok: false, message: 'Server bilan aloqa yo\'q' });
    } finally {
      setTesting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center">
        <div className="size-8 border-2 border-white/10 border-t-purple-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-white p-4 md:p-8 max-w-3xl mx-auto space-y-6">

      {/* HEADER */}
      <header className="sticky top-4 z-50 flex items-center gap-4 px-6 py-4 rounded-2xl backdrop-blur-md bg-black/40 border border-white/10 shadow-2xl">
        <Link href="/dashboard" className="flex items-center gap-2 text-white/60 hover:text-white transition-colors">
          <ArrowLeft className="size-4" />
          <span className="text-sm hidden sm:inline">Dashboard</span>
        </Link>
        <div className="h-5 w-px bg-white/10" />
        <div className="size-8 rounded-full bg-purple-600 flex items-center justify-center">
          <Settings className="size-4 text-white" />
        </div>
        <h1 className="text-xl font-bold tracking-tight">Tizim Sozlamalari</h1>
      </header>

      {/* ZADARMA CARD */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-[#18181b] border border-white/5 rounded-2xl overflow-hidden">
        {/* Card header */}
        <div className="flex items-center gap-4 p-6 border-b border-white/5">
          <div className="size-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
            <Phone className="size-6 text-red-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold">Zadarma ATS Integratsiyasi</h2>
            <p className="text-sm text-white/40">Sotuvchilar uchun WebRTC telefon ulanishi</p>
          </div>
          <a href="https://my.zadarma.com/settings/api/" target="_blank" rel="noreferrer"
            className="ml-auto flex items-center gap-1.5 text-xs text-white/40 hover:text-white/70 transition-colors">
            <ExternalLink className="size-3.5" />
            Zadarma API
          </a>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-5">

          {/* Organization name */}
          <div>
            <label className="text-xs text-white/50 mb-1.5 block font-medium">Tashkilot nomi</label>
            <input
              type="text"
              value={formName}
              onChange={e => setFormName(e.target.value)}
              placeholder="Kompaniya nomi (masalan: Mega Group)"
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/10 transition-all"
            />
          </div>

          {/* Info box */}
          <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4 text-xs text-blue-300/80 leading-relaxed">
            <strong className="text-blue-400">Qayerdan olish mumkin?</strong><br />
            Zadarma.com → Nastroyki → Integrasii i API → API klyuchi generatsiya qiling. 
            ATS bazasi — Moya ATS bo'limidagi login prefiksi (masalan: <code className="bg-white/10 px-1 rounded">559324</code>).
          </div>

          {/* API Key */}
          <div>
            <label className="text-xs text-white/50 mb-1.5 block font-medium flex items-center gap-1.5">
              <Key className="size-3.5" /> Zadarma API Key
            </label>
            <input
              type="text"
              value={formKey}
              onChange={e => setFormKey(e.target.value)}
              placeholder="8566b102fc85b36d638a"
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/10 transition-all font-mono"
            />
          </div>

          {/* API Secret */}
          <div>
            <label className="text-xs text-white/50 mb-1.5 block font-medium flex items-center gap-1.5">
              <Key className="size-3.5" /> Zadarma API Secret
            </label>
            <div className="relative">
              <input
                type={showSecret ? 'text' : 'password'}
                value={formSecret}
                onChange={e => setFormSecret(e.target.value)}
                placeholder="b309d9eb3873e704eccd"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-4 pr-12 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/10 transition-all font-mono"
              />
              <button type="button" onClick={() => setShowSecret(!showSecret)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-white/30 hover:text-white/60">
                {showSecret ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>

          {/* ATS SIP Base */}
          <div>
            <label className="text-xs text-white/50 mb-1.5 block font-medium">ATS SIP Bazasi (Prefiksi)</label>
            <input
              type="text"
              value={formSipBase}
              onChange={e => setFormSipBase(e.target.value)}
              placeholder="559324  (Moya ATS dagi login prefiksi)"
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/10 transition-all font-mono"
            />
            <p className="text-[11px] text-white/30 mt-1.5">
              Sotuvchi &quot;100&quot; extension bilan ulansa, to&apos;liq login: <span className="font-mono text-white/50">{formSipBase || '559324'}-100</span>
            </p>
          </div>

          {/* Test result */}
          {testResult && (
            <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
              className={`flex items-center gap-3 p-4 rounded-xl border text-sm ${testResult.ok ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'}`}>
              {testResult.ok ? <CheckCircle className="size-4 shrink-0" /> : <AlertCircle className="size-4 shrink-0" />}
              {testResult.message}
            </motion.div>
          )}

          {/* Error */}
          {error && (
            <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={handleTestApi} disabled={testing}
              className="flex items-center gap-2 px-5 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 rounded-xl text-sm font-medium transition-all disabled:opacity-50">
              <Wifi className={`size-4 ${testing ? 'animate-pulse text-yellow-400' : ''}`} />
              {testing ? 'Tekshirilmoqda...' : 'Ulanishni tekshirish'}
            </button>

            <button type="submit" disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-semibold rounded-xl transition-colors text-sm">
              {saved ? <CheckCircle className="size-4 text-emerald-400" /> : <Save className="size-4" />}
              {saving ? 'Saqlanmoqda...' : saved ? 'Saqlandi!' : 'Sozlamalarni saqlash'}
            </button>
          </div>
        </form>
      </motion.div>

      {/* ATS extension guide */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.1 } }}
        className="bg-[#18181b] border border-white/5 rounded-2xl p-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Phone className="size-4 text-emerald-400" />
          Keyingi qadam: Sotuvchilarga ATS raqam biriktirish
        </h3>
        <div className="space-y-3 text-sm text-white/60">
          <div className="flex items-start gap-3">
            <span className="flex-shrink-0 size-6 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center text-xs font-bold">1</span>
            <p>Zadarma <strong className="text-white/80">Moya ATS → Vnutrennie nomera</strong> bo&apos;limida sotuvchi soni qadar ichki raqamlar yarating (100, 101, 102...)</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="flex-shrink-0 size-6 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center text-xs font-bold">2</span>
            <p><strong className="text-white/80">Xodimlar boshqaruvi</strong> sahifasiga o&apos;ting va har bir sotuvchiga tegishli ATS raqamini biriktiring</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="flex-shrink-0 size-6 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center text-xs font-bold">3</span>
            <p>Sotuvchi mobil ilovadan qo&apos;ng&apos;iroq qilganda — tizim avtomatik uning ATS raqami orqali ulanadi</p>
          </div>
        </div>
        <Link href="/agents" className="mt-5 inline-flex items-center gap-2 text-sm text-purple-400 hover:text-purple-300 font-medium transition-colors">
          Xodimlar boshqaruviga o&apos;tish →
        </Link>
      </motion.div>
    </div>
  );
}
