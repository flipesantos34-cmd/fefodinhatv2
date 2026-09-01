import { useEffect, useRef, useState, useCallback } from 'react';
import { ArrowLeft, Play, Loader2, AlertCircle } from 'lucide-react';
import type { Channel, StreamOption } from '@/data/channels';

interface ChannelPlayerProps {
  channel: Channel;
  onBack: () => void;
}

/** Normalize any option into raw HTML that can be injected into the player */
function getIframeHtml(option: StreamOption): string {
  if (option.html) return option.html;
  if (option.url) {
    return `<iframe src="${option.url}" allow="autoplay; encrypted-media; picture-in-picture; fullscreen; accelerometer; gyroscope" allowfullscreen frameborder="0" width="100%" height="100%" scrolling="no" style="width:100%;height:100%;border:0;"></iframe>`;
  }
  return '';
}

export function ChannelPlayer({ channel, onBack }: ChannelPlayerProps) {
  // Começa automaticamente com a primeira opção disponível
  const [activeOption, setActiveOption] = useState<StreamOption | null>(channel.options?.[0] || null);
  // Já inicia o estado de loading se houver uma opção válida
  const [loading, setLoading] = useState(!!channel.options?.[0]);
  const [error, setError] = useState(false);
  
  const playerRef = useRef<HTMLDivElement>(null);
  const backBtnRef = useRef<HTMLButtonElement>(null);
  const firstOptionRef = useRef<HTMLButtonElement>(null);

  // Move focus to the back button when the view opens
  useEffect(() => {
    backBtnRef.current?.focus();
    window.scrollTo(0, 0);
  }, []);

  // Quando o canal mudar, seleciona a opção 1 automaticamente
  useEffect(() => {
    if (channel?.options?.length > 0) {
      setActiveOption(channel.options[0]);
      setLoading(true);
      setError(false);
    } else {
      setActiveOption(null);
    }
  }, [channel]);

  const handleSelectOption = useCallback((option: StreamOption) => {
    setActiveOption(option);
    setLoading(true);
    setError(false);
  }, []);

  // Simulate load completion — injected iframes don't reliably fire onLoad
  useEffect(() => {
    if (!activeOption || !loading) return;
    const t = setTimeout(() => setLoading(false), 3000);
    return () => clearTimeout(t);
  }, [activeOption, loading]);

  // Re-inject HTML whenever the active option changes
  useEffect(() => {
    if (!activeOption || !playerRef.current) return;
    const html = getIframeHtml(activeOption);
    if (!html) {
      setError(true);
      setLoading(false);
      return;
    }
    playerRef.current.innerHTML = html;

    // Try to attach load listener to the injected iframe
    const iframe = playerRef.current.querySelector('iframe');
    if (iframe) {
      const handleLoad = () => setLoading(false);
      iframe.addEventListener('load', handleLoad);
      return () => iframe.removeEventListener('load', handleLoad);
    }
  }, [activeOption]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onBack();
    }
  };

  return (
    <div
      className="flex flex-col min-h-screen"
      role="region"
      aria-label={`Player do canal ${channel.name}`}
      onKeyDown={handleKeyDown}
    >
      {/* Top bar */}
      <div className="sticky top-16 z-30 bg-bg/90 backdrop-blur-md border-b border-border">
        <div className="mx-auto max-w-5xl px-5 sm:px-6 py-4 flex items-center justify-between gap-4">
          <button
            ref={backBtnRef}
            type="button"
            className="btn btn-ghost"
            aria-label="Voltar para a página inicial"
            onClick={onBack}
          >
            <ArrowLeft size={18} aria-hidden="true" />
            Voltar
          </button>
          
          <div className="flex items-center gap-3 min-w-0">
            {/* Renderização condicional da logo ou do box colorido */}
            {channel.logo ? (
              <div className="w-8 h-8 rounded-xs flex items-center justify-center bg-white shrink-0 overflow-hidden shadow-sm">
                <img
                  src={channel.logo}
                  alt={`Logo ${channel.name}`}
                  className="w-full h-full object-contain p-1"
                />
              </div>
            ) : (
              <span
                className="w-8 h-8 rounded-xs flex items-center justify-center text-xs font-bold shrink-0"
                style={{
                  backgroundColor: channel.logoColor,
                  color: '#fff',
                  textShadow: '0 1px 2px rgba(0,0,0,0.6)',
                }}
                aria-hidden="true"
              >
                {channel.logoText}
              </span>
            )}
            <h1 className="text-sm font-semibold text-text-primary truncate">
              {channel.name}
            </h1>
          </div>
        </div>
      </div>

      {/* Player area */}
      <div className="flex-1 mx-auto w-full max-w-5xl px-5 sm:px-6 py-8 flex flex-col gap-6">
        <div
          className="relative w-full aspect-video bg-black rounded-xs overflow-hidden border border-border"
          role="region"
          aria-label="Área do player de vídeo"
        >
          {/* Idle state — dark background with large play icon */}
          {!activeOption && !loading && !error && (
            <button
              type="button"
              className="absolute inset-0 flex flex-col items-center justify-center gap-6 bg-black cursor-pointer group"
              aria-label={`Iniciar ${channel.name} — selecione uma opção abaixo`}
              onClick={() => firstOptionRef.current?.focus()}
            >
              <span
                className="w-20 h-20 rounded-full flex items-center justify-center border-2 border-border-mid group-hover:border-accent transition-colors"
                aria-hidden="true"
              >
                <Play
                  size={36}
                  className="text-text-dim group-hover:text-accent transition-colors ml-1"
                  fill="currentColor"
                />
              </span>
              <p className="text-sm text-text-secondary">
                Selecione uma opção abaixo para iniciar
              </p>
            </button>
          )}

          {/* Loading state */}
          {loading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black z-10">
              <Loader2 size={32} className="animate-spin text-accent" aria-hidden="true" />
              <p className="text-sm text-text-secondary">Carregando transmissão...</p>
            </div>
          )}

          {/* Error state */}
          {error && (
            <div
              className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-center px-6 bg-black"
              role="alert"
            >
              <AlertCircle size={40} className="text-text-dim" aria-hidden="true" />
              <div>
                <p className="text-sm text-text-primary font-medium mb-1">
                  Transmissão indisponível
                </p>
                <p className="text-xs text-text-secondary max-w-sm">
                  Não foi possível carregar o vídeo. Tente outra opção abaixo.
                </p>
              </div>
            </div>
          )}

          {/* Iframe container */}
          <div
            ref={playerRef}
            className="w-full h-full [&_iframe]:w-full [&_iframe]:h-full [&_iframe]:border-0"
            aria-live="polite"
          />
        </div>

        {/* Option buttons */}
        <div>
          <div
            role="group"
            aria-label={`Opções de transmissão para ${channel.name}`}
            className="flex flex-wrap gap-3"
          >
            {channel.options.map((option, idx) => {
              const isActive = activeOption?.id === option.id;
              return (
                <button
                  key={option.id}
                  ref={idx === 0 ? firstOptionRef : undefined}
                  type="button"
                  className={`chip ${isActive ? 'bg-accent/10 text-accent border-accent' : ''}`}
                  aria-pressed={isActive}
                  aria-label={`${option.label} para assistir ${channel.name}`}
                  onClick={() => handleSelectOption(option)}
                >
                  {option.label}
                </button>
              );
            })}
          </div>

          {/* Warning text */}
          <p className="text-xs text-text-secondary mt-5 leading-relaxed max-w-2xl">
            Se uma opção travar, troque para outra. Os players são links de
            terceiros e podem sofrer instabilidade.
          </p>
        </div>
      </div>
    </div>
  );
}