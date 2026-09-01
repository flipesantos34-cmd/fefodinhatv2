import { useEffect, useState, useMemo } from 'react';
import { AlertCircle, Clock, Tv, Search, Shield, Filter, Check, Star } from 'lucide-react';

const SUPABASE_URL = "https://dethjmxcqlpdpcjddjyo.supabase.co/storage/v1/object/public/escudos";

interface Jogo {
  horario: string;
  time_casa: string;
  time_fora: string;
  liga: string;
  canais: string[];
}

const TeamBadge = ({ nomeTime }: { nomeTime: string }) => {
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [nomeTime]);

  if (imgError || !nomeTime) {
    return (
      <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0" title={nomeTime}>
        <Shield size={12} className="text-text-dim" />
      </div>
    );
  }

  const formatName = (name: string) => {
    const baseName = name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');

    const aliases: Record<string, string> = {
      'athletico-pr': 'athletico-paranaense',
      'atletico-mg': 'atletico-mineiro',
      'america-mg': 'america-mineiro',
      'atletico-go': 'atletico-goianiense',
      'coritiba': 'coritiba-fc',
      'goias': 'goias-ec',
      'red-bull-bragantino': 'bragantino',
      'psg': 'paris-saint-germain',
      'inter-de-milao': 'inter-milan',
      'milan': 'ac-milan',
      'bayern-de-munique': 'bayern-munich',
      'manchester-united': 'manchester-united-fc',
      'manchester-city': 'manchester-city-fc'
    };

    return aliases[baseName] || baseName;
  };

  const fileName = `${formatName(nomeTime)}.football-logos.cc.png`;
  const imgUrl = `${SUPABASE_URL}/${fileName}`;

  return (
    <img 
      src={imgUrl} 
      alt={`Escudo do ${nomeTime}`} 
      className="w-5 h-5 sm:w-6 sm:h-6 object-contain shrink-0 drop-shadow-sm"
      loading="lazy"
      onError={() => setImgError(true)}
    />
  );
};

const getMatchStatus = (horarioStr: string) => {
  const agora = new Date();
  const [horas, minutos] = horarioStr.split(':').map(Number);
  const inicio = new Date();
  inicio.setHours(horas, minutos, 0, 0);
  const fim = new Date(inicio.getTime() + 135 * 60000);
  
  if (agora > fim) return 'finished';
  if (agora >= inicio && agora <= fim) return 'live';
  return 'upcoming';
};

const SkeletonLoader = () => (
  <div className="flex-1 overflow-y-hidden pr-2 space-y-2 mt-4">
    {[1, 2, 3, 4, 5, 6].map((i) => (
      <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl bg-black/10 border border-white/5 gap-4 animate-pulse">
        <div className="flex items-center gap-3 sm:gap-4 flex-1">
          <div className="w-14 h-7 bg-white/5 rounded"></div>
          <div className="flex flex-col gap-1.5 w-full max-w-[200px]">
            <div className="w-full h-4 bg-white/5 rounded"></div>
            <div className="w-1/2 h-3 bg-white/5 rounded mt-1"></div>
          </div>
        </div>
        <div className="w-16 h-7 bg-white/5 rounded"></div>
      </div>
    ))}
  </div>
);

export function LiveGames() {
  const [data, setData] = useState<{ atualizado_em: string; jogos: Jogo[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'todos' | 'aovivo' | 'encerrados'>('todos');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [favLeagues, setFavLeagues] = useState<string[]>(() => {
    const saved = localStorage.getItem('fefodinha_fav_leagues');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [favChannels, setFavChannels] = useState<string[]>(() => {
    const saved = localStorage.getItem('fefodinha_fav_channels');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('fefodinha_fav_leagues', JSON.stringify(favLeagues));
  }, [favLeagues]);

  useEffect(() => {
    localStorage.setItem('fefodinha_fav_channels', JSON.stringify(favChannels));
  }, [favChannels]);

  const fetchData = async (silent = false) => {
    if (!silent) setLoading(true);
    setError(false);
    
    try {
      const apiUrl = 'https://fefodinhatv.flipesantos33.workers.dev/';
      const res = await fetch(apiUrl);
      if (!res.ok) throw new Error('Erro ao acessar Worker');
      
      const html = await res.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      
      const jogosExtraidos: Jogo[] = [];
      const ligasIgnoradas = ['peruano', 'russo', 'tcheco', 'turco', 'série c', 'série d'];
      
      doc.querySelectorAll('h3').forEach((el) => {
        const headerText = el.textContent?.trim() || '';
        if (/^\d{2}[:h]\d{2}/.test(headerText)) {
          const nextElement = el.nextElementSibling;
          
          if (nextElement && nextElement.tagName.toLowerCase() === 'p') {
            const canaisText = nextElement.textContent?.trim() || '';
            const partes = headerText.split(/\s*[-–]\s*/);
            
            if (partes.length >= 3) {
              const horario = partes[0].replace('h', ':').trim();
              const times = partes[1].split(/\s+x\s+/i);
              const liga = partes.slice(2).join(' - ').trim();
              
              if (!ligasIgnoradas.some(termo => liga.toLowerCase().includes(termo))) {
                let canaisStr = canaisText.replace(/canais:\s*/i, '');
                if (!canaisText.toLowerCase().includes('canais')) canaisStr = "Canal não informado";
                
                let listaCanais = canaisStr.split(/[,e]\s+/).map(c => c.trim()).filter(Boolean);
                listaCanais = listaCanais.map(c => {
                  const lower = c.toLowerCase();
                  if (lower.includes('youtube') || lower.includes('youtu.be')) return 'YouTube';
                  if (lower.includes('twitch')) return 'Twitch';
                  if (lower.includes('tempo real') || lower.includes('minuto')) return ''; 
                  return c;
                }).filter(Boolean);

                listaCanais = Array.from(new Set(listaCanais));
                if (listaCanais.length === 0) listaCanais = ["Não informado"];

                jogosExtraidos.push({
                  horario,
                  time_casa: times[0]?.trim() || 'Indefinido',
                  time_fora: times[1]?.trim() || 'Indefinido',
                  liga,
                  canais: listaCanais
                });
              }
            }
          }
        }
      });

      setData({ atualizado_em: new Date().toISOString(), jogos: jogosExtraidos });
    } catch (err) {
      if (!silent) setError(true);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => fetchData(true), 60000);
    return () => clearInterval(interval);
  }, []);

  const ligasUnicas = useMemo(() => {
    if (!data) return [];
    return Array.from(new Set(data.jogos.map(j => j.liga))).sort();
  }, [data]);

  const canaisUnicos = useMemo(() => {
    if (!data) return [];
    return Array.from(new Set(data.jogos.flatMap(j => j.canais))).sort();
  }, [data]);

  const jogosFiltrados = useMemo(() => {
    if (!data) return [];
    return data.jogos.filter(jogo => {
      const matchSearch = `${jogo.time_casa} ${jogo.time_fora} ${jogo.liga}`.toLowerCase().includes(search.toLowerCase());
      const status = getMatchStatus(jogo.horario);
      const matchStatus = statusFilter === 'todos' || (statusFilter === 'aovivo' && status === 'live') || (statusFilter === 'encerrados' && status === 'finished');
      const matchFavLeague = favLeagues.length === 0 || favLeagues.includes(jogo.liga);
      const matchFavChannel = favChannels.length === 0 || jogo.canais.some(c => favChannels.includes(c));

      return matchSearch && matchStatus && matchFavLeague && matchFavChannel;
    });
  }, [data, search, statusFilter, favLeagues, favChannels]);

  const toggleFavLeague = (liga: string) => setFavLeagues(prev => prev.includes(liga) ? prev.filter(l => l !== liga) : [...prev, liga]);
  const toggleFavChannel = (canal: string) => setFavChannels(prev => prev.includes(canal) ? prev.filter(c => c !== canal) : [...prev, canal]);
  const clearFavorites = () => { setFavLeagues([]); setFavChannels([]); };

  if (error) return (
    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-center">
      <AlertCircle className="text-red-500 mx-auto mb-2" size={24} />
      <p className="text-sm text-text-secondary mb-3">Falha ao carregar agenda</p>
      <button onClick={() => fetchData()} className="text-xs bg-white/10 px-4 py-2 rounded-lg hover:bg-white/20 transition font-medium">Tentar novamente</button>
    </div>
  );

  return (
    // Altura ajustada para ocupar a tela toda dinamicamente (min-h-[80vh])
    <div className="flex flex-col lg:flex-row gap-6 w-full min-h-[80vh]">
      
      <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="lg:hidden w-full flex items-center justify-center gap-2 bg-white/5 border border-white/10 text-white font-bold py-3 rounded-xl shadow-lg hover:bg-white/10 transition-colors">
        <Filter size={16} className="text-accent" />
        {isSidebarOpen ? 'Esconder Filtros' : 'Meus Favoritos'}
      </button>

      <div className={`${isSidebarOpen ? 'flex' : 'hidden'} lg:flex flex-col w-full lg:w-72 bg-white/5 border border-white/10 rounded-2xl p-5 shadow-xl backdrop-blur-sm shrink-0 h-[80vh] sticky top-24`}>
        <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
          <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
            <Star size={16} className="text-accent fill-accent" />
            Meus Favoritos
          </h3>
          {(favLeagues.length > 0 || favChannels.length > 0) && (
            <button onClick={clearFavorites} className="text-[10px] text-text-dim hover:text-white underline transition-colors">Limpar</button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-6">
          <div>
            <span className="text-[11px] font-bold text-text-secondary uppercase tracking-wider mb-2 block">Ligas</span>
            <div className="flex flex-col gap-1">
              {loading ? <div className="text-xs text-text-dim animate-pulse">Carregando...</div> : ligasUnicas.map(liga => (
                <label key={liga} className="flex items-start gap-2.5 p-1.5 rounded-lg hover:bg-white/5 cursor-pointer transition-colors group">
                  <div className={`w-4 h-4 rounded mt-0.5 border flex items-center justify-center shrink-0 transition-colors ${favLeagues.includes(liga) ? 'bg-accent border-accent' : 'border-white/20 group-hover:border-accent/50'}`}>
                    {favLeagues.includes(liga) && <Check size={12} className="text-black stroke-[3]" />}
                  </div>
                  <span className={`text-xs leading-tight transition-colors ${favLeagues.includes(liga) ? 'text-white font-bold' : 'text-text-secondary group-hover:text-white'}`}>
                    <input type="checkbox" className="hidden" checked={favLeagues.includes(liga)} onChange={() => toggleFavLeague(liga)} />
                    {liga}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <span className="text-[11px] font-bold text-text-secondary uppercase tracking-wider mb-2 block">Canais</span>
            <div className="flex flex-col gap-1">
              {loading ? <div className="text-xs text-text-dim animate-pulse">Carregando...</div> : canaisUnicos.map(canal => (
                <label key={canal} className="flex items-center gap-2.5 p-1.5 rounded-lg hover:bg-white/5 cursor-pointer transition-colors group">
                  <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${favChannels.includes(canal) ? 'bg-accent border-accent' : 'border-white/20 group-hover:border-accent/50'}`}>
                    {favChannels.includes(canal) && <Check size={12} className="text-black stroke-[3]" />}
                  </div>
                  <span className={`text-xs transition-colors ${favChannels.includes(canal) ? 'text-white font-bold' : 'text-text-secondary group-hover:text-white'}`}>
                    <input type="checkbox" className="hidden" checked={favChannels.includes(canal)} onChange={() => toggleFavChannel(canal)} />
                    {canal}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col bg-white/5 border border-white/10 rounded-2xl p-4 md:p-6 shadow-xl backdrop-blur-sm h-full min-h-[80vh]">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-5 border-b border-white/10 pb-4">
          <div className="flex flex-col gap-3 w-full">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              Agenda de Jogos
            </h2>
            <div className="flex items-center gap-2">
              <button onClick={() => setStatusFilter('todos')} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${statusFilter === 'todos' ? 'bg-accent/10 text-accent border-accent/30' : 'bg-white/5 text-text-secondary border-transparent hover:bg-white/10 hover:text-white'}`}>Todos</button>
              <button onClick={() => setStatusFilter('aovivo')} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${statusFilter === 'aovivo' ? 'bg-red-500/15 text-red-500 border-red-500/30' : 'bg-white/5 text-text-secondary border-transparent hover:bg-red-500/10 hover:text-red-400'}`}>
                <span className={`w-1.5 h-1.5 rounded-full bg-current ${statusFilter === 'aovivo' ? 'animate-pulse' : ''}`}></span> Ao Vivo
              </button>
              <button onClick={() => setStatusFilter('encerrados')} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${statusFilter === 'encerrados' ? 'bg-white/15 text-white border-white/30' : 'bg-white/5 text-text-secondary border-transparent hover:bg-white/10 hover:text-white'}`}>Encerrados</button>
            </div>
          </div>
          <div className="relative w-full sm:w-64 shrink-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-dim" size={14} />
            <input type="text" placeholder="Buscar time ou liga..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-9 pr-4 py-2 bg-black/40 border border-border rounded-lg text-white text-xs placeholder:text-text-dim focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all" />
          </div>
        </div>

        {loading ? (
          <SkeletonLoader />
        ) : (
          <div className="flex-1 space-y-2">
            {jogosFiltrados.map((jogo) => {
              const status = getMatchStatus(jogo.horario);
              const aoVivo = status === 'live';
              const encerrado = status === 'finished';
              const jogoID = `${jogo.time_casa}-${jogo.time_fora}-${jogo.horario}`;
              
              return (
                <div key={jogoID} className={`group flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl bg-black/20 transition-all duration-300 gap-4 
                  ${encerrado ? 'opacity-60 hover:opacity-100 border border-transparent' : 
                    aoVivo ? 'border border-red-500/40 shadow-[0_0_12px_rgba(239,68,68,0.15)] bg-red-500/5 hover:bg-red-500/10' : 
                    'border border-transparent hover:border-white/5 hover:bg-black/40'}`}>
                  
                  <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                    <div className={`text-[11px] sm:text-xs font-mono font-semibold px-2 py-1 sm:px-2.5 sm:py-1.5 rounded flex items-center shrink-0 border ${
                      aoVivo ? 'bg-red-500/20 text-red-400 border-red-500/30 gap-1.5' : encerrado ? 'bg-white/5 text-white border-white/10 gap-1.5' : 'bg-accent/5 text-accent border-accent/20 gap-1.5'
                    }`}>
                      {aoVivo && <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />}
                      {encerrado ? (
                        <span className="flex items-center gap-2">
                          <span className="line-through opacity-80">{jogo.horario}</span>
                          <span className="text-[9px] uppercase tracking-wider font-bold">Encerrado</span>
                        </span>
                      ) : jogo.horario}
                    </div>
                    
                    <div className="flex flex-col min-w-0 gap-1">
                      <div className="flex items-center gap-2 text-[13px] sm:text-sm font-semibold text-white">
                        <TeamBadge nomeTime={jogo.time_casa} />
                        <span className="truncate max-w-[100px] sm:max-w-[140px]">{jogo.time_casa}</span>
                        <span className="text-text-dim text-[10px] sm:text-xs font-normal">x</span>
                        <span className="truncate max-w-[100px] sm:max-w-[140px] text-right">{jogo.time_fora}</span>
                        <TeamBadge nomeTime={jogo.time_fora} />
                      </div>
                      <span className={`text-[9px] sm:text-[10px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded border w-fit ${
                        encerrado ? 'border-white/10 text-white bg-white/5' : 'border-accent/20 text-accent bg-accent/5'
                      }`}>{jogo.liga}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5 mt-1 sm:mt-0 w-full sm:w-auto justify-start sm:justify-end">
                    {jogo.canais.map((canal, i) => (
                      <a key={i} href={`/canais?busca=${encodeURIComponent(canal)}`}
                        className={`flex items-center gap-1.5 text-[9px] sm:text-[10px] font-medium px-2.5 py-1.5 rounded border whitespace-nowrap transition-all cursor-pointer no-underline ${
                          encerrado ? 'text-white bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/20' : 
                          aoVivo ? 'text-white bg-red-500/10 border-red-500/20 hover:bg-red-500/20 hover:border-red-500/40 hover:scale-105 active:scale-95' :
                          'text-white bg-white/5 border-white/10 hover:bg-white/10 hover:border-accent/50 hover:scale-105 active:scale-95'
                        }`} title={`Assistir no ${canal}`}>
                        <Tv size={11} className={encerrado ? "text-white opacity-80" : aoVivo ? "text-red-400" : "text-accent"} />
                        <span>{canal}</span>
                      </a>
                    ))}
                  </div>
                </div>
              );
            })}
            
            {jogosFiltrados.length === 0 && (
              <div className="py-12 flex flex-col items-center justify-center text-text-dim text-xs opacity-70">
                <Shield size={32} className="mb-2 opacity-50" />
                <p>Você ainda não tem jogos para seus filtros hoje.</p>
                <button onClick={clearFavorites} className="mt-4 px-4 py-2 bg-white/10 rounded-lg text-white font-bold hover:bg-white/20 transition-colors">Limpar filtros</button>
              </div>
            )}
          </div>
        )}

        <div className="pt-3 border-t border-white/10 flex justify-end mt-4">
          {data && (
            <span className="text-[10px] text-text-dim flex items-center gap-1 font-medium">
              <Clock size={10} /> Atualizado às {new Date(data.atualizado_em).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}