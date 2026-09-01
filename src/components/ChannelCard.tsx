import { Tv, Play } from 'lucide-react';
import type { Channel } from '@/data/channels';

interface ChannelCardProps {
  channel: Channel;
  onSelect: (channel: Channel) => void;
}

export function ChannelCard({ channel, onSelect }: ChannelCardProps) {
  return (
    <button
      type="button"
      className="card group text-left w-full"
      aria-label={`Assistir ${channel.name}`}
      onClick={() => onSelect(channel)}
    >
      {/* Header */}
      <div className="flex items-center gap-4 p-5 border-b border-border">
        
        {/* Renderização condicional da Logo */}
        {channel.logo ? (
          <div className="w-12 h-12 rounded-xs flex items-center justify-center bg-white shrink-0 overflow-hidden shadow-sm">
            <img 
              src={channel.logo} 
              alt={`Logo ${channel.name}`}
              className="w-full h-full object-contain p-1.5" 
            />
          </div>
        ) : (
          <span
            className="w-12 h-12 rounded-xs flex items-center justify-center text-sm font-bold shrink-0"
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

        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold text-text-primary truncate">
            {channel.name}
          </h3>
          <p className="text-xs text-text-secondary truncate mt-1">
            {channel.description}
          </p>
        </div>
        <Tv size={20} className="text-text-dim shrink-0" aria-hidden="true" />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-5 py-4">
        <span className="flex items-center gap-2 text-xs text-text-secondary">
          <span className="live-badge">
            <span className="live-dot" aria-hidden="true" />
            Ao Vivo
          </span>
          <span className="text-text-dim">
            {channel.options.length} opções
          </span>
        </span>
        <span className="flex items-center gap-2 text-xs font-medium text-accent group-hover:gap-3 transition-all">
          Assistir
          <Play size={14} aria-hidden="true" />
        </span>
      </div>
    </button>
  );
}