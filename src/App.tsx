import { useState, useEffect } from 'react';
import { Tv } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ChannelCard } from '@/components/ChannelCard';
import { ChannelPlayer } from '@/components/ChannelPlayer';
import { LiveGames } from '@/components/LiveGames';
import { useTheme } from '@/hooks/useTheme';
import { CHANNELS, type Channel } from '@/data/channels';

// Fundo Dinâmico com Brilho (Estilo HBO/Netflix)
function AmbientBackground() {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-bg pointer-events-none">
      <div className="absolute -top-[20%] -left-[10%] w-[50%] sm:w-[30%] h-[40%] sm:h-[50%] bg-accent/20 rounded-full blur-[100px] sm:blur-[150px] opacity-70"></div>
      <div className="absolute top-[60%] -right-[10%] w-[60%] sm:w-[40%] h-[50%] bg-accent/10 rounded-full blur-[100px] sm:blur-[150px] opacity-50"></div>
      <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay" style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }}></div>
    </div>
  );
}

export default function App() {
  const { theme, setTheme } = useTheme();
  const [activeChannel, setActiveChannel] = useState<Channel | null>(null);
  const [currentRoute, setCurrentRoute] = useState('canais');

  // Sistema de navegação pelas abas da URL
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash === 'agenda') setCurrentRoute('agenda');
      else setCurrentRoute('canais');
    };
    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Executa ao carregar a página
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  if (activeChannel) {
    return (
      <div className="min-h-screen flex flex-col bg-bg text-text-primary relative z-0">
        <AmbientBackground />
        <Navbar theme={theme} onThemeChange={setTheme} />
        <ChannelPlayer
          channel={activeChannel}
          onBack={() => setActiveChannel(null)}
        />
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-bg text-text-primary relative z-0">
      <AmbientBackground />
      <Navbar theme={theme} onThemeChange={setTheme} />

      <main className="flex-1 mx-auto w-full max-w-7xl px-5 sm:px-6 py-8" role="main">
        {currentRoute === 'agenda' ? (
          
          /* ================= TELA DA AGENDA ================= */
          <section aria-labelledby="jogos-title" className="h-full animate-in fade-in duration-500">
            <LiveGames />
          </section>

        ) : (
          
          /* ================= TELA INICIAL (CANAIS) ================= */
          <div className="animate-in fade-in duration-500">
            <section aria-labelledby="hero-title" className="mb-8">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <span className="live-badge">
                    <span className="live-dot" aria-hidden="true" />
                    {CHANNELS.length} canais ao vivo
                  </span>
                </div>
                <h1 id="hero-title" className="text-lg sm:text-3xl font-bold text-text-primary tracking-tight">
                  Futebol ao vivo, sem complicação.
                </h1>
                <p className="text-sm sm:text-base text-text-secondary max-w-2xl leading-relaxed">
                  Escolha um canal e assista aos principais jogos do Brasil e do mundo
                  em alta qualidade. Rápido, gratuito e direto ao ponto.
                </p>
              </div>
            </section>

            <section aria-labelledby="channels-title">
              <div className="flex items-center gap-3 mb-5">
                <Tv size={20} className="text-accent" aria-hidden="true" />
                <h2 id="channels-title" className="text-md font-semibold text-text-primary">
                  Canais ao vivo
                </h2>
                <span className="text-xs text-text-dim">
                  {CHANNELS.length} canais disponíveis
                </span>
              </div>
              <div role="list" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {CHANNELS.map((channel) => (
                  <div role="listitem" key={channel.id}>
                    <ChannelCard channel={channel} onSelect={setActiveChannel} />
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}