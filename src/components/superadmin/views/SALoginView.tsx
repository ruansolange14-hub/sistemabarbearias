import React, { useState } from 'react';
import { useSuperAdmin } from '../../../context/SuperAdminContext';
import { Shield, Lock, Mail, ArrowRight, AlertCircle, Eye, EyeOff, CheckCircle } from 'lucide-react';

interface SALoginViewProps {
  onBackToApp: () => void;
}

export const SALoginView: React.FC<SALoginViewProps> = ({ onBackToApp }) => {
  const { loginSuperAdmin } = useSuperAdmin();

  const [email, setEmail] = useState('admin@barberpilot.app');
  const [senha, setSenha] = useState('admin123');
  const [showSenha, setShowSenha] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    setTimeout(() => {
      const res = loginSuperAdmin(email, senha);
      if (!res.success) {
        setError(res.error || 'Credenciais inválidas.');
      }
      setLoading(false);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#0f1218] flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-900/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-blue-950/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full space-y-6 relative z-10">
        {/* Header Logo */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-700 to-blue-950 mx-auto flex items-center justify-center text-white shadow-xl shadow-blue-900/40 border border-blue-600/30">
            <Shield className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Barber<span className="text-blue-500">Pilot</span>
          </h1>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-950/80 border border-blue-800/60 text-blue-300 text-xs font-mono font-bold uppercase tracking-wider">
            Painel Super Administrador
          </div>
          <p className="text-xs text-slate-400 max-w-xs mx-auto">
            Acesso exclusivo para controle global da plataforma, multi-tenancy e gestão financeira do SaaS.
          </p>
        </div>

        {/* Card Form */}
        <div className="bg-[#161a25] border border-[#26324b] rounded-3xl p-6 md:p-8 shadow-2xl space-y-5">
          {error && (
            <div className="bg-rose-500/15 border border-rose-500/30 rounded-xl p-3 text-xs text-rose-300 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="text-slate-300 font-semibold block mb-1.5">
                E-mail de Administrador
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@barberpilot.app"
                  className="w-full bg-[#121622] border border-[#242c3f] rounded-xl pl-10 pr-3.5 py-3 text-white text-sm placeholder-slate-500 focus:outline-hidden focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-slate-300 font-semibold">
                  Senha de Acesso
                </label>
                <span className="text-[11px] text-blue-400/90 font-mono">
                  Ambiente Protegido
                </span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type={showSenha ? 'text' : 'password'}
                  required
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#121622] border border-[#242c3f] rounded-xl pl-10 pr-10 py-3 text-white text-sm placeholder-slate-500 focus:outline-hidden focus:border-blue-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowSenha(!showSenha)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white p-1"
                >
                  {showSenha ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Quick Helper Credentials */}
            <div className="bg-[#121622] p-3 rounded-xl border border-[#222a3d] text-[11px] text-slate-400 space-y-1">
              <span className="font-semibold text-slate-300 block">Credenciais Master pré-carregadas:</span>
              <div>Usuário: <strong className="text-blue-300 font-mono">admin@barberpilot.app</strong></div>
              <div>Senha: <strong className="text-blue-300 font-mono">admin123</strong></div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-700 hover:bg-blue-600 disabled:opacity-50 text-white font-bold py-3 rounded-xl text-sm transition-all shadow-lg shadow-blue-950/50 flex items-center justify-center gap-2"
            >
              <span>{loading ? 'Validando acesso...' : 'Entrar como Super Admin'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Back to Tenant App Link */}
        <div className="text-center">
          <button
            onClick={onBackToApp}
            className="text-xs text-slate-400 hover:text-white transition-colors"
          >
            ← Voltar para a Barbearia do manel
          </button>
        </div>
      </div>
    </div>
  );
};
