import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import * as cheerio from 'cheerio';

// Cache em memória para não esgotar as requisições da API do TheSportsDB
const logoCache = new Map<string, string>();

async function getTeamLogo(teamName: string): Promise<string> {
  // Se o time já estiver no cache, retorna direto da memória
  if (logoCache.has(teamName)) {
    return logoCache.get(teamName)!;
  }

  try {
    // Chave '3' é a chave pública padrão da v1 gratuita do TheSportsDB
    const url = `https://www.thesportsdb.com/api/v1/json/3/searchteams.php?t=${encodeURIComponent(teamName)}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data && data.teams && data.teams.length > 0) {
      // Pega a URL do escudo (badge) do primeiro resultado encontrado
      const badge = data.teams[0].strTeamBadge;
      logoCache.set(teamName, badge);
      return badge;
    }
  } catch (error) {
    console.error(`Erro ao buscar logo para ${teamName}:`, error);
  }

  // Se não encontrar ou der erro, salva vazio para não ficar tentando toda hora
  logoCache.set(teamName, '');
  return '';
}

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'api-jogos-hoje',
      configureServer(server) {
        let cache: any = null;
        let cacheTime = 0;
        const CACHE_TTL = 15 * 60 * 1000; // 15 minutos

        server.middlewares.use('/api/jogos', async (req, res) => {
          res.setHeader('Content-Type', 'application/json');

          if (cache && Date.now() - cacheTime < CACHE_TTL) {
            return res.end(JSON.stringify(cache));
          }

          try {
            const response = await fetch('https://mantosdofutebol.com.br/guia-de-jogos-tv-hoje-ao-vivo/', {
              headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7'
              }
            });
            
            if (!response.ok) throw new Error(`Status: ${response.status}`);

            const html = await response.text();
            const $ = cheerio.load(html);
            
            const rawJogos: any[] = [];

            // Passo 1: Extrai todos os textos primeiro
            $('h3').each((_, el) => {
              const headerText = $(el).text().trim();
              if (/^\d{2}[:h]\d{2}/.test(headerText)) {
                const nextElement = $(el).next('p');
                const canaisText = nextElement.text().trim();
                const partes = headerText.split(/\s*[-–]\s*/);
                
                if (partes.length >= 3) {
                  const horario = partes[0].replace('h', ':').trim();
                  const times = partes[1].split(/\s+x\s+/i);
                  const time_casa = times[0]?.trim() || 'Indefinido';
                  const time_fora = times[1]?.trim() || 'Indefinido';
                  const liga = partes.slice(2).join(' - ').trim();

                  let canaisStr = canaisText.replace(/canais:\s*/i, '');
                  if (!canaisText.toLowerCase().includes('canais')) canaisStr = "Canal não informado";
                  const canais = canaisStr.split(/[,e]\s+/).map(c => c.trim()).filter(Boolean);

                  rawJogos.push({ horario, time_casa, time_fora, liga, canais });
                }
              }
            });

            // Passo 2: Busca os escudos de forma assíncrona (com for...of)
            const jogosComEscudos = [];
            for (const jogo of rawJogos) {
              const escudo_casa = await getTeamLogo(jogo.time_casa);
              const escudo_fora = await getTeamLogo(jogo.time_fora);
              
              jogosComEscudos.push({
                ...jogo,
                escudo_casa,
                escudo_fora
              });
            }

            cache = { atualizado_em: new Date().toISOString(), jogos: jogosComEscudos };
            cacheTime = Date.now();

            res.end(JSON.stringify(cache));
          } catch (error: any) {
            console.error("Erro na API:", error);
            res.statusCode = 500;
            res.end(JSON.stringify({ error: 'Falha', detalhes: error.message }));
          }
        });
      }
    }
  ],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
});