import React, { useState } from 'react';
import { useSuperAdmin } from '../../../context/SuperAdminContext';
import { BarbeariaStatus, BarbeariaTenant } from '../../../types/superAdmin';
import {
  Building2,
  Search,
  Filter,
  Plus,
  ArrowUpDown,
  AlertOctagon,
  CheckCircle2,
  Eye,
  Sliders,
  X,
  ExternalLink,
  ShieldAlert,
  Lock,
  Unlock,
} from 'lucide-react';

interface SABarbeariasViewProps {
  onImpersonateTenant?: (barbearia: BarbeariaTenant) => void;
}

export const SABarbeariasView: React.FC<SABarbeariasViewProps> = ({ onImpersonateTenant }) => {
  const {
    barbearias,
    planos,
    suspenderBarbearia,
    reativarBarbearia,
    alterarPlanoBarbearia,
    adicionarBarbearia,
    setCurrentSAView,
    setSelectedBarbeariaId,
    superAdminUser,
  } = useSuperAdmin();

  const [busca, setBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState<string>('TODOS');
  const [filtroPlano, setFiltroPlano] = useState<string>('TODOS');
  const [ordenacao, setOrdenacao] = useState<'recente' | 'antiga' | 'nome' | 'receita' | 'vencimento'>('recente');

  // Modal Suspender
  const [barbeariaParaSuspender, setBarbeariaParaSuspender] = useState<BarbeariaTenant | null>(null);
  const [motivoSuspensao, setMotivoSuspensao] = useState('');

  // Modal Reativar
  const [barbeariaParaReativar, setBarbeariaParaReativar] = useState<BarbeariaTenant | null>(null);
  const [motivoReativacao, setMotivoReativacao] = useState('');

  // Modal Alterar Plano
  const [barbeariaParaPlano, setBarbeariaParaPlano] = useState<BarbeariaTenant | null>(null);
  const [novoPlanoSelecionado, setNovoPlanoSelecionado] = useState('');

  // Modal Nova Barbearia
  const [modalNovaBarbearia, setModalNovaBarbearia] = useState(false);
  const [novoNome, setNovoNome] = useState('');
  const [novoProprietario, setNovoProprietario] = useState('');
  const [novoEmail, setNovoEmail] = useState('');
  const [novoTelefone, setNovoTelefone] = useState('');
  const [novoPlanoId, setNovoPlanoId] = useState(planos[0]?.id || 'plano-profissional');
  const [novoStatus, setNovoStatus] = useState<BarbeariaStatus>('TRIAL');

  // Filter & Sort
  const filteredBarbearias = barbearias
    .filter((b) => {
      const matchBusca =
        b.nome.toLowerCase().includes(busca.toLowerCase()) ||
        b.proprietarioNome.toLowerCase().includes(busca.toLowerCase()) ||
        b.proprietarioEmail.toLowerCase().includes(busca.toLowerCase()) ||
        b.endereco.cidade.toLowerCase().includes(busca.toLowerCase());

      const matchStatus = filtroStatus === 'TODOS' || b.status === filtroStatus;
      const matchPlano = filtroPlano === 'TODOS' || b.planoId === filtroPlano;

      return matchBusca && matchStatus && matchPlano;
    })
    .sort((a, b) => {
      if (ordenacao === 'recente') return b.dataCadastro.localeCompare(a.dataCadastro);
      if (ordenacao === 'antiga') return a.dataCadastro.localeCompare(b.dataCadastro);
      if (ordenacao === 'nome') return a.nome.localeCompare(b.nome);
      if (ordenacao === 'receita') return b.receitaSaaSMensal - a.receitaSaaSMensal;
      if (ordenacao === 'vencimento') return a.proximoVencimento.localeCompare(b.proximoVencimento);
      return 0;
    });

  const handleConfirmarSuspensao = (e: React.FormEvent) => {
    e.preventDefault();
    if (barbeariaParaSuspender) {
      suspenderBarbearia(barbeariaParaSuspender.id, motivoSuspensao || 'Suspensão manual via Super Admin');
      setBarbeariaParaSuspender(null);
      setMotivoSuspensao('');
    }
  };

  const handleConfirmarReativacao = (e: React.FormEvent) => {
    e.preventDefault();
    if (barbeariaParaReativar) {
      reativarBarbearia(barbeariaParaReativar.id, motivoReativacao);
      setBarbeariaParaReativar(null);
      setMotivoReativacao('');
    }
  };

  const handleConfirmarAlterarPlano = (e: React.FormEvent) => {
    e.preventDefault();
    if (barbeariaParaPlano && novoPlanoSelecionado) {
      alterarPlanoBarbearia(barbeariaParaPlano.id, novoPlanoSelecionado);
      setBarbeariaParaPlano(null);
      setNovoPlanoSelecionado('');
    }
  };

  const handleSalvarNovaBarbearia = (e: React.FormEvent) => {
    e.preventDefault();
    if (!novoNome.trim() || !novoProprietario.trim()) return;

    const selectedPlano = planos.find((p) => p.id === novoPlanoId) || planos[0];
    const slug = novoNome
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    adicionarBarbearia({
      nome: novoNome,
      slug,
      proprietarioNome: novoProprietario,
      proprietarioEmail: novoEmail,
      proprietarioTelefone: novoTelefone,
      whatsapp: novoTelefone,
      endereco: {
        rua: 'Rua Principal',
        numero: '100',
        bairro: 'Centro',
        cidade: 'São Paulo',
        estado: 'SP',
        cep: '01000-000',
      },
      planoId: selectedPlano.id,
      planoNome: selectedPlano.nome,
      status: novoStatus,
      proximoVencimento: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      receitaSaaSMensal: selectedPlano.precoMensal,
    });

    setModalNovaBarbearia(false);
    setNovoNome('');
    setNovoProprietario('');
    setNovoEmail('');
    setNovoTelefone('');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <span>Barbearias Cadastradas</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-900/40 text-blue-300 font-bold border border-blue-700/50">
              {filteredBarbearias.length} tenants
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Visualização, suspensão, reativação e controle de assinaturas de cada barbearia.
          </p>
        </div>

        <button
          onClick={() => setModalNovaBarbearia(true)}
          className="bg-blue-700 hover:bg-blue-600 text-white font-bold text-xs md:text-sm px-4 py-2.5 rounded-xl transition-all shadow-md shadow-blue-950/40 flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Cadastrar Nova Barbearia</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#161a25] border border-[#242c3f] rounded-2xl p-4 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 text-xs">
          {/* Search */}
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar por barbearia, proprietário, email ou cidade..."
              className="w-full bg-[#121622] border border-[#222a3d] rounded-xl pl-10 pr-3.5 py-2 text-white placeholder-slate-500 focus:outline-hidden focus:border-blue-500"
            />
          </div>

          {/* Status Filter */}
          <div className="md:col-span-2.5">
            <select
              value={filtroStatus}
              onChange={(e) => setFiltroStatus(e.target.value)}
              className="w-full bg-[#121622] border border-[#222a3d] rounded-xl px-3 py-2 text-white focus:outline-hidden focus:border-blue-500"
            >
              <option value="TODOS">Todos os Status</option>
              <option value="ATIVA">ATIVA</option>
              <option value="TRIAL">TRIAL</option>
              <option value="INADIMPLENTE">INADIMPLENTE</option>
              <option value="SUSPENSA">SUSPENSA</option>
              <option value="CANCELADA">CANCELADA</option>
            </select>
          </div>

          {/* Plan Filter */}
          <div className="md:col-span-2.5">
            <select
              value={filtroPlano}
              onChange={(e) => setFiltroPlano(e.target.value)}
              className="w-full bg-[#121622] border border-[#222a3d] rounded-xl px-3 py-2 text-white focus:outline-hidden focus:border-blue-500"
            >
              <option value="TODOS">Todos os Planos</option>
              {planos.map((p) => (
                <option key={p.id} value={p.id}>
                  Plano {p.nome}
                </option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div className="md:col-span-2">
            <select
              value={ordenacao}
              onChange={(e) => setOrdenacao(e.target.value as any)}
              className="w-full bg-[#121622] border border-[#222a3d] rounded-xl px-3 py-2 text-white focus:outline-hidden focus:border-blue-500"
            >
              <option value="recente">Mais Recente</option>
              <option value="antiga">Mais Antiga</option>
              <option value="nome">Nome A-Z</option>
              <option value="receita">Maior Receita</option>
              <option value="vencimento">Vencimento Próximo</option>
            </select>
          </div>
        </div>
      </div>

      {/* Barbearias Table */}
      <div className="bg-[#161a25] border border-[#242c3f] rounded-2xl overflow-hidden shadow-sm">
        {filteredBarbearias.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400 space-y-2">
            <Building2 className="w-10 h-10 text-slate-600 mx-auto" />
            <p className="font-semibold text-white">Nenhuma barbearia encontrada com estes filtros.</p>
            <p>Tente ajustar os termos de busca ou filtros selecionados.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#121622] text-slate-400 uppercase font-semibold text-[10px] tracking-wider border-b border-[#222a3d]">
                <tr>
                  <th className="p-4">Barbearia</th>
                  <th className="p-4">Proprietário</th>
                  <th className="p-4">Plano</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Cadastro</th>
                  <th className="p-4">Vencimento</th>
                  <th className="p-4 text-center">Usuários</th>
                  <th className="p-4 text-center">Clientes</th>
                  <th className="p-4 text-right">Mensalidade</th>
                  <th className="p-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#202738]">
                {filteredBarbearias.map((b) => (
                  <tr key={b.id} className="hover:bg-[#1a2030] transition-colors group">
                    <td className="p-4">
                      <div>
                        <span className="font-bold text-white text-sm block">
                          {b.nome}
                        </span>
                        <span className="text-[11px] text-blue-400 font-mono">
                          /{b.slug}
                        </span>
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="text-slate-200 font-medium">{b.proprietarioNome}</div>
                      <div className="text-[11px] text-slate-400">{b.proprietarioEmail}</div>
                    </td>

                    <td className="p-4">
                      <span className="font-semibold text-slate-200">
                        {b.planoNome}
                      </span>
                    </td>

                    <td className="p-4">
                      <span
                        className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                          b.status === 'ATIVA'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : b.status === 'TRIAL'
                            ? 'bg-blue-900/40 text-blue-300 border border-blue-700/50'
                            : b.status === 'INADIMPLENTE'
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : b.status === 'SUSPENSA'
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            : 'bg-slate-700/40 text-slate-400 border border-slate-600'
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>

                    <td className="p-4 text-slate-300 font-mono text-[11px]">
                      {b.dataCadastro}
                    </td>

                    <td className="p-4 text-slate-300 font-mono text-[11px]">
                      {b.proximoVencimento}
                    </td>

                    <td className="p-4 text-center font-bold text-slate-200">
                      {b.totalUsuarios}
                    </td>

                    <td className="p-4 text-center font-bold text-blue-300">
                      {b.totalClientes}
                    </td>

                    <td className="p-4 text-right font-extrabold text-white">
                      R$ {b.receitaSaaSMensal.toFixed(2).replace('.', ',')}
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Detalhes */}
                        <button
                          onClick={() => {
                            setSelectedBarbeariaId(b.id);
                            setCurrentSAView('barbearia-detalhes');
                          }}
                          className="p-1.5 bg-[#121622] hover:bg-[#1a2235] text-blue-400 rounded-lg transition-colors border border-[#222a3d]"
                          title="Ver detalhes completos"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {/* Alterar Plano */}
                        <button
                          onClick={() => {
                            setBarbeariaParaPlano(b);
                            setNovoPlanoSelecionado(b.planoId);
                          }}
                          className="p-1.5 bg-[#121622] hover:bg-[#1a2235] text-slate-300 hover:text-white rounded-lg transition-colors border border-[#222a3d]"
                          title="Alterar plano comercial"
                        >
                          <Sliders className="w-3.5 h-3.5" />
                        </button>

                        {/* Suspender ou Reativar */}
                        {b.status === 'SUSPENSA' ? (
                          <button
                            onClick={() => setBarbeariaParaReativar(b)}
                            className="p-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 rounded-lg transition-colors border border-emerald-500/40"
                            title="Reativar barbearia"
                          >
                            <Unlock className="w-3.5 h-3.5" />
                          </button>
                        ) : (
                          <button
                            onClick={() => setBarbeariaParaSuspender(b)}
                            className="p-1.5 bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 rounded-lg transition-colors border border-rose-500/30"
                            title="Suspender acesso da barbearia"
                          >
                            <Lock className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Suspender Barbearia with CONFIRMATION as required */}
      {barbeariaParaSuspender && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-[#161a25] border-2 border-rose-500/40 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-rose-400 border-b border-[#242c3f] pb-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 flex items-center justify-center">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-white">
                  SUSPENDER BARBEARIA
                </h3>
                <span className="text-[10px] text-rose-400 font-mono font-bold uppercase">
                  Ação Sensível de Administração
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-200">
              Tem certeza que deseja suspender a barbearia <strong className="text-white font-bold">{barbeariaParaSuspender.nome}</strong>?
            </p>

            <div className="bg-[#121622] p-3 rounded-xl border border-[#222a3d] text-[11px] text-slate-300 space-y-1">
              <p>• O acesso administrativo dos proprietários e barbeiros será bloqueado.</p>
              <p>• O site público não aceitará novos agendamentos.</p>
              <p className="text-emerald-400 font-semibold">• Todos os dados históricos e clientes serão integralmente preservados.</p>
            </div>

            <form onSubmit={handleConfirmarSuspensao} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">
                  Motivo da suspensão (registrado em auditoria):
                </label>
                <input
                  type="text"
                  required
                  value={motivoSuspensao}
                  onChange={(e) => setMotivoSuspensao(e.target.value)}
                  placeholder="Ex: Inadimplência superior a 15 dias"
                  className="w-full bg-[#121622] border border-[#222a3d] rounded-xl px-3 py-2 text-white focus:outline-hidden focus:border-rose-400"
                />
              </div>

              <div className="text-[10px] text-slate-400 font-mono">
                Administrador: {superAdminUser?.nome} ({superAdminUser?.email})
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#242c3f]">
                <button
                  type="button"
                  onClick={() => setBarbeariaParaSuspender(null)}
                  className="px-4 py-2 text-slate-300 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-rose-600 hover:bg-rose-500 text-white font-bold px-4 py-2 rounded-xl transition-all shadow-md shadow-rose-600/30"
                >
                  Confirmar Suspensão
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Reativar Barbearia */}
      {barbeariaParaReativar && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-[#161a25] border-2 border-emerald-500/40 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-emerald-400 border-b border-[#242c3f] pb-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                <Unlock className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-white">
                  REATIVAR BARBEARIA
                </h3>
                <span className="text-[10px] text-emerald-400 font-mono font-bold uppercase">
                  Restauração de Acesso
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-200">
              Deseja reativar imediatamente o acesso da barbearia <strong className="text-white font-bold">{barbeariaParaReativar.nome}</strong>?
            </p>

            <form onSubmit={handleConfirmarReativacao} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">
                  Observação / Motivo de reativação (opcional):
                </label>
                <input
                  type="text"
                  value={motivoReativacao}
                  onChange={(e) => setMotivoReativacao(e.target.value)}
                  placeholder="Ex: Pagamento regularizado via PIX"
                  className="w-full bg-[#121622] border border-[#222a3d] rounded-xl px-3 py-2 text-white focus:outline-hidden focus:border-emerald-400"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#242c3f]">
                <button
                  type="button"
                  onClick={() => setBarbeariaParaReativar(null)}
                  className="px-4 py-2 text-slate-300 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-emerald-500 hover:bg-emerald-400 text-[#070e1b] font-bold px-4 py-2 rounded-xl transition-all shadow-md shadow-emerald-500/20"
                >
                  Reativar Barbearia
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Alterar Plano */}
      {barbeariaParaPlano && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-[#161a25] border border-[#26324b] rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#242c3f] pb-3">
              <h3 className="font-bold text-white text-base">Alterar Plano SaaS</h3>
              <button onClick={() => setBarbeariaParaPlano(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Barbearia: <strong className="text-white">{barbeariaParaPlano.nome}</strong> (Plano Atual: {barbeariaParaPlano.planoNome})
            </p>

            <form onSubmit={handleConfirmarAlterarPlano} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">
                  Selecione o Novo Plano:
                </label>
                <select
                  value={novoPlanoSelecionado}
                  onChange={(e) => setNovoPlanoSelecionado(e.target.value)}
                  className="w-full bg-[#121622] border border-[#222a3d] rounded-xl px-3 py-2 text-white focus:outline-hidden focus:border-blue-500"
                >
                  {planos.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nome} — R$ {p.precoMensal.toFixed(2).replace('.', ',')}/mês
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#242c3f]">
                <button
                  type="button"
                  onClick={() => setBarbeariaParaPlano(null)}
                  className="px-4 py-2 text-slate-300 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-blue-700 hover:bg-blue-600 text-white font-bold px-4 py-2 rounded-xl"
                >
                  Salvar Novo Plano
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Nova Barbearia */}
      {modalNovaBarbearia && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#161a25] border border-[#26324b] rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative my-8">
            <div className="flex items-center justify-between border-b border-[#242c3f] pb-3">
              <h3 className="font-bold text-white text-base">Cadastrar Nova Barbearia na Plataforma</h3>
              <button onClick={() => setModalNovaBarbearia(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSalvarNovaBarbearia} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Nome da Barbearia *</label>
                <input
                  type="text"
                  required
                  value={novoNome}
                  onChange={(e) => setNovoNome(e.target.value)}
                  placeholder="Ex: Barbearia Viking Club"
                  className="w-full bg-[#121622] border border-[#222a3d] rounded-xl px-3 py-2 text-white focus:outline-hidden focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Nome do Proprietário *</label>
                  <input
                    type="text"
                    required
                    value={novoProprietario}
                    onChange={(e) => setNovoProprietario(e.target.value)}
                    placeholder="Ex: João Vitor"
                    className="w-full bg-[#121622] border border-[#222a3d] rounded-xl px-3 py-2 text-white focus:outline-hidden focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">WhatsApp *</label>
                  <input
                    type="text"
                    required
                    value={novoTelefone}
                    onChange={(e) => setNovoTelefone(e.target.value)}
                    placeholder="(11) 98888-7777"
                    className="w-full bg-[#121622] border border-[#222a3d] rounded-xl px-3 py-2 text-white focus:outline-hidden focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">E-mail do Proprietário</label>
                <input
                  type="email"
                  value={novoEmail}
                  onChange={(e) => setNovoEmail(e.target.value)}
                  placeholder="contato@barbearia.com"
                  className="w-full bg-[#121622] border border-[#222a3d] rounded-xl px-3 py-2 text-white focus:outline-hidden focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Plano Inicial</label>
                  <select
                    value={novoPlanoId}
                    onChange={(e) => setNovoPlanoId(e.target.value)}
                    className="w-full bg-[#121622] border border-[#222a3d] rounded-xl px-3 py-2 text-white focus:outline-hidden focus:border-blue-500"
                  >
                    {planos.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.nome} (R$ {p.precoMensal}/mês)
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Status Inicial</label>
                  <select
                    value={novoStatus}
                    onChange={(e) => setNovoStatus(e.target.value as any)}
                    className="w-full bg-[#121622] border border-[#222a3d] rounded-xl px-3 py-2 text-white focus:outline-hidden focus:border-blue-500"
                  >
                    <option value="TRIAL">TRIAL (14 dias grátis)</option>
                    <option value="ATIVA">ATIVA (Já assinado)</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#242c3f]">
                <button
                  type="button"
                  onClick={() => setModalNovaBarbearia(false)}
                  className="px-4 py-2 text-slate-300 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-blue-700 hover:bg-blue-600 text-white font-bold px-5 py-2.5 rounded-xl shadow-md shadow-blue-950/40"
                >
                  Cadastrar Barbearia
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
