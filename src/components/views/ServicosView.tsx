import React, { useState } from 'react';
import { useBarber } from '../../context/BarberContext';
import {
  Scissors,
  Plus,
  Clock,
  DollarSign,
  Edit2,
  Trash2,
  Sparkles,
  Layers,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { Servico } from '../../types';

export const ServicosView: React.FC = () => {
  const { servicos, toggleServicoAtivo, openNovoServico, deleteServico, combos } = useBarber();

  const [activeTab, setActiveTab] = useState<'seus_servicos' | 'modelos'>('seus_servicos');
  const [filterAtivos, setFilterAtivos] = useState<'todos' | 'ativos' | 'inativos'>('todos');

  const filteredServicos = servicos.filter((s) => {
    if (filterAtivos === 'ativos') return s.ativo;
    if (filterAtivos === 'inativos') return !s.ativo;
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Serviços
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Cadastre, ative e organize os serviços oferecidos pela sua barbearia.
          </p>
        </div>

        <button
          onClick={() => openNovoServico()}
          className="bg-blue-700 hover:bg-blue-600 text-white font-semibold text-xs md:text-sm px-4 py-2.5 rounded-lg transition-all shadow-md shadow-blue-950/40 flex items-center justify-center gap-2 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Novo serviço</span>
        </button>
      </div>

      {/* Tabs bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#161a25] border border-[#242c3f] p-2.5 rounded-xl">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('seus_servicos')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'seus_servicos'
                ? 'bg-blue-700 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Seus serviços ({servicos.length})
          </button>

          <button
            onClick={() => setActiveTab('modelos')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'modelos'
                ? 'bg-blue-700 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Modelos de serviços</span>
          </button>
        </div>

        <div className="flex items-center gap-1.5 text-xs">
          <button
            onClick={() => setFilterAtivos('todos')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
              filterAtivos === 'todos'
                ? 'bg-[#182032] text-blue-300 border border-blue-700/50'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setFilterAtivos('ativos')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
              filterAtivos === 'ativos'
                ? 'bg-[#182032] text-emerald-400 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Ativos ({servicos.filter((s) => s.ativo).length})
          </button>
          <button
            onClick={() => setFilterAtivos('inativos')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
              filterAtivos === 'inativos'
                ? 'bg-[#182032] text-slate-300 border border-[#2c3852]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Inativos ({servicos.filter((s) => !s.ativo).length})
          </button>
        </div>
      </div>

      {/* Services Grid matching exact list */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredServicos.map((servico) => (
          <div
            key={servico.id}
            className={`bg-[#161a25] border rounded-xl p-4 transition-all shadow-xs space-y-3 relative group ${
              servico.ativo
                ? 'border-[#242c3f] hover:border-blue-700/50'
                : 'border-[#1e2434] opacity-75'
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: servico.cor || '#2563eb' }}
                  />
                  <h3 className="font-bold text-white text-sm">
                    {servico.nome}
                  </h3>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{servico.duracao} min</span>
                  </span>
                  <span>·</span>
                  <span className="font-semibold text-blue-400">
                    R$ {servico.preco.toFixed(2).replace('.', ',')}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                    servico.ativo
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                      : 'bg-slate-700/40 text-slate-400 border border-slate-700'
                  }`}
                >
                  {servico.ativo ? 'Ativo' : 'Inativo'}
                </span>

                <button
                  onClick={() => openNovoServico(servico)}
                  className="p-1 text-slate-400 hover:text-white rounded hover:bg-white/5 transition-colors"
                  title="Editar serviço"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {servico.descricao && (
              <p className="text-[11px] text-slate-400 line-clamp-2">
                {servico.descricao}
              </p>
            )}

            <div className="flex items-center justify-between pt-2 border-t border-[#202738] text-xs">
              <span className="text-[11px] text-slate-500">
                Categoria: <strong className="text-slate-300 font-medium">{servico.categoria}</strong>
              </span>

              <button
                onClick={() => toggleServicoAtivo(servico.id)}
                className={`text-[11px] font-semibold px-2.5 py-1 rounded transition-colors ${
                  servico.ativo
                    ? 'text-amber-400 hover:bg-amber-500/10'
                    : 'text-emerald-400 hover:bg-emerald-500/10'
                }`}
              >
                {servico.ativo ? 'Desativar' : 'Ativar no site'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pacotes e Combos Section matching exact user transcription */}
      <div className="bg-[#161a25] border border-[#242c3f] rounded-xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-400" />
              <span>Pacotes e combos</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Junte 2 ou mais serviços com preço especial. Aparecem na sua página de agendamento.
            </p>
          </div>

          <button
            onClick={() => {
              alert('Novo combo: Selecione os serviços base (ex: Cabelo + Barba) e o preço promocional.');
            }}
            className="bg-[#182032] hover:bg-[#202c45] text-blue-300 border border-blue-700/40 text-xs px-3.5 py-2 rounded-lg font-semibold transition-all flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Novo combo</span>
          </button>
        </div>

        {combos.length === 0 ? (
          <div className="border border-dashed border-[#232a3d] rounded-xl p-8 text-center space-y-2">
            <h4 className="text-sm font-semibold text-white">
              Crie seu primeiro combo
            </h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Ex.: Cabelo + Barba com preço especial para atrair mais clientes e aumentar o ticket médio.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {combos.map((c) => (
              <div
                key={c.id}
                className="bg-[#121622] border border-[#232a3d] rounded-xl p-3.5 flex items-center justify-between text-xs"
              >
                <div>
                  <h4 className="font-bold text-white">{c.nome}</h4>
                  <div className="flex items-center gap-2 text-slate-400 mt-1">
                    <span>{c.duracao} min</span>
                    <span>•</span>
                    <span className="line-through text-slate-500">
                      R$ {c.precoOriginal.toFixed(2).replace('.', ',')}
                    </span>
                    <span className="text-blue-400 font-bold">
                      R$ {c.precoPromocional.toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                </div>

                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold uppercase">
                  Ativo no site
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
