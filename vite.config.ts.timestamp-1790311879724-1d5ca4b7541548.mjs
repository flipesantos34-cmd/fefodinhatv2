// vite.config.ts
import { defineConfig } from "file:///home/project/node_modules/vite/dist/node/index.js";
import react from "file:///home/project/node_modules/@vitejs/plugin-react/dist/index.mjs";
import path from "path";
import * as cheerio from "file:///home/project/node_modules/cheerio/dist/esm/index.js";
var __vite_injected_original_dirname = "/home/project";
var logoCache = /* @__PURE__ */ new Map();
async function getTeamLogo(teamName) {
  if (logoCache.has(teamName)) {
    return logoCache.get(teamName);
  }
  try {
    const url = `https://www.thesportsdb.com/api/v1/json/3/searchteams.php?t=${encodeURIComponent(teamName)}`;
    const response = await fetch(url);
    const data = await response.json();
    if (data && data.teams && data.teams.length > 0) {
      const badge = data.teams[0].strTeamBadge;
      logoCache.set(teamName, badge);
      return badge;
    }
  } catch (error) {
    console.error(`Erro ao buscar logo para ${teamName}:`, error);
  }
  logoCache.set(teamName, "");
  return "";
}
var vite_config_default = defineConfig({
  plugins: [
    react(),
    {
      name: "api-jogos-hoje",
      configureServer(server) {
        let cache = null;
        let cacheTime = 0;
        const CACHE_TTL = 15 * 60 * 1e3;
        server.middlewares.use("/api/jogos", async (req, res) => {
          res.setHeader("Content-Type", "application/json");
          if (cache && Date.now() - cacheTime < CACHE_TTL) {
            return res.end(JSON.stringify(cache));
          }
          try {
            const response = await fetch("https://mantosdofutebol.com.br/guia-de-jogos-tv-hoje-ao-vivo/", {
              headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
                "Accept-Language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7"
              }
            });
            if (!response.ok) throw new Error(`Status: ${response.status}`);
            const html = await response.text();
            const $ = cheerio.load(html);
            const rawJogos = [];
            $("h3").each((_, el) => {
              const headerText = $(el).text().trim();
              if (/^\d{2}[:h]\d{2}/.test(headerText)) {
                const nextElement = $(el).next("p");
                const canaisText = nextElement.text().trim();
                const partes = headerText.split(/\s*[-–]\s*/);
                if (partes.length >= 3) {
                  const horario = partes[0].replace("h", ":").trim();
                  const times = partes[1].split(/\s+x\s+/i);
                  const time_casa = times[0]?.trim() || "Indefinido";
                  const time_fora = times[1]?.trim() || "Indefinido";
                  const liga = partes.slice(2).join(" - ").trim();
                  let canaisStr = canaisText.replace(/canais:\s*/i, "");
                  if (!canaisText.toLowerCase().includes("canais")) canaisStr = "Canal n\xE3o informado";
                  const canais = canaisStr.split(/[,e]\s+/).map((c) => c.trim()).filter(Boolean);
                  rawJogos.push({ horario, time_casa, time_fora, liga, canais });
                }
              }
            });
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
            cache = { atualizado_em: (/* @__PURE__ */ new Date()).toISOString(), jogos: jogosComEscudos };
            cacheTime = Date.now();
            res.end(JSON.stringify(cache));
          } catch (error) {
            console.error("Erro na API:", error);
            res.statusCode = 500;
            res.end(JSON.stringify({ error: "Falha", detalhes: error.message }));
          }
        });
      }
    }
  ],
  resolve: {
    alias: { "@": path.resolve(__vite_injected_original_dirname, "./src") }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9wcm9qZWN0XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9wcm9qZWN0L3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL3Byb2plY3Qvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCAqIGFzIGNoZWVyaW8gZnJvbSAnY2hlZXJpbyc7XG5cbi8vIENhY2hlIGVtIG1lbVx1MDBGM3JpYSBwYXJhIG5cdTAwRTNvIGVzZ290YXIgYXMgcmVxdWlzaVx1MDBFN1x1MDBGNWVzIGRhIEFQSSBkbyBUaGVTcG9ydHNEQlxuY29uc3QgbG9nb0NhY2hlID0gbmV3IE1hcDxzdHJpbmcsIHN0cmluZz4oKTtcblxuYXN5bmMgZnVuY3Rpb24gZ2V0VGVhbUxvZ28odGVhbU5hbWU6IHN0cmluZyk6IFByb21pc2U8c3RyaW5nPiB7XG4gIC8vIFNlIG8gdGltZSBqXHUwMEUxIGVzdGl2ZXIgbm8gY2FjaGUsIHJldG9ybmEgZGlyZXRvIGRhIG1lbVx1MDBGM3JpYVxuICBpZiAobG9nb0NhY2hlLmhhcyh0ZWFtTmFtZSkpIHtcbiAgICByZXR1cm4gbG9nb0NhY2hlLmdldCh0ZWFtTmFtZSkhO1xuICB9XG5cbiAgdHJ5IHtcbiAgICAvLyBDaGF2ZSAnMycgXHUwMEU5IGEgY2hhdmUgcFx1MDBGQWJsaWNhIHBhZHJcdTAwRTNvIGRhIHYxIGdyYXR1aXRhIGRvIFRoZVNwb3J0c0RCXG4gICAgY29uc3QgdXJsID0gYGh0dHBzOi8vd3d3LnRoZXNwb3J0c2RiLmNvbS9hcGkvdjEvanNvbi8zL3NlYXJjaHRlYW1zLnBocD90PSR7ZW5jb2RlVVJJQ29tcG9uZW50KHRlYW1OYW1lKX1gO1xuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2godXJsKTtcbiAgICBjb25zdCBkYXRhID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xuXG4gICAgaWYgKGRhdGEgJiYgZGF0YS50ZWFtcyAmJiBkYXRhLnRlYW1zLmxlbmd0aCA+IDApIHtcbiAgICAgIC8vIFBlZ2EgYSBVUkwgZG8gZXNjdWRvIChiYWRnZSkgZG8gcHJpbWVpcm8gcmVzdWx0YWRvIGVuY29udHJhZG9cbiAgICAgIGNvbnN0IGJhZGdlID0gZGF0YS50ZWFtc1swXS5zdHJUZWFtQmFkZ2U7XG4gICAgICBsb2dvQ2FjaGUuc2V0KHRlYW1OYW1lLCBiYWRnZSk7XG4gICAgICByZXR1cm4gYmFkZ2U7XG4gICAgfVxuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGNvbnNvbGUuZXJyb3IoYEVycm8gYW8gYnVzY2FyIGxvZ28gcGFyYSAke3RlYW1OYW1lfTpgLCBlcnJvcik7XG4gIH1cblxuICAvLyBTZSBuXHUwMEUzbyBlbmNvbnRyYXIgb3UgZGVyIGVycm8sIHNhbHZhIHZhemlvIHBhcmEgblx1MDBFM28gZmljYXIgdGVudGFuZG8gdG9kYSBob3JhXG4gIGxvZ29DYWNoZS5zZXQodGVhbU5hbWUsICcnKTtcbiAgcmV0dXJuICcnO1xufVxuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBwbHVnaW5zOiBbXG4gICAgcmVhY3QoKSxcbiAgICB7XG4gICAgICBuYW1lOiAnYXBpLWpvZ29zLWhvamUnLFxuICAgICAgY29uZmlndXJlU2VydmVyKHNlcnZlcikge1xuICAgICAgICBsZXQgY2FjaGU6IGFueSA9IG51bGw7XG4gICAgICAgIGxldCBjYWNoZVRpbWUgPSAwO1xuICAgICAgICBjb25zdCBDQUNIRV9UVEwgPSAxNSAqIDYwICogMTAwMDsgLy8gMTUgbWludXRvc1xuXG4gICAgICAgIHNlcnZlci5taWRkbGV3YXJlcy51c2UoJy9hcGkvam9nb3MnLCBhc3luYyAocmVxLCByZXMpID0+IHtcbiAgICAgICAgICByZXMuc2V0SGVhZGVyKCdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24vanNvbicpO1xuXG4gICAgICAgICAgaWYgKGNhY2hlICYmIERhdGUubm93KCkgLSBjYWNoZVRpbWUgPCBDQUNIRV9UVEwpIHtcbiAgICAgICAgICAgIHJldHVybiByZXMuZW5kKEpTT04uc3RyaW5naWZ5KGNhY2hlKSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goJ2h0dHBzOi8vbWFudG9zZG9mdXRlYm9sLmNvbS5ici9ndWlhLWRlLWpvZ29zLXR2LWhvamUtYW8tdml2by8nLCB7XG4gICAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICAnVXNlci1BZ2VudCc6ICdNb3ppbGxhLzUuMCAoV2luZG93cyBOVCAxMC4wOyBXaW42NDsgeDY0KSBBcHBsZVdlYktpdC81MzcuMzYgKEtIVE1MLCBsaWtlIEdlY2tvKSBDaHJvbWUvMTIwLjAuMC4wIFNhZmFyaS81MzcuMzYnLFxuICAgICAgICAgICAgICAgICdBY2NlcHQnOiAndGV4dC9odG1sLGFwcGxpY2F0aW9uL3hodG1sK3htbCxhcHBsaWNhdGlvbi94bWw7cT0wLjksaW1hZ2Uvd2VicCwqLyo7cT0wLjgnLFxuICAgICAgICAgICAgICAgICdBY2NlcHQtTGFuZ3VhZ2UnOiAncHQtQlIscHQ7cT0wLjksZW4tVVM7cT0wLjgsZW47cT0wLjcnXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAoIXJlc3BvbnNlLm9rKSB0aHJvdyBuZXcgRXJyb3IoYFN0YXR1czogJHtyZXNwb25zZS5zdGF0dXN9YCk7XG5cbiAgICAgICAgICAgIGNvbnN0IGh0bWwgPSBhd2FpdCByZXNwb25zZS50ZXh0KCk7XG4gICAgICAgICAgICBjb25zdCAkID0gY2hlZXJpby5sb2FkKGh0bWwpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBjb25zdCByYXdKb2dvczogYW55W10gPSBbXTtcblxuICAgICAgICAgICAgLy8gUGFzc28gMTogRXh0cmFpIHRvZG9zIG9zIHRleHRvcyBwcmltZWlyb1xuICAgICAgICAgICAgJCgnaDMnKS5lYWNoKChfLCBlbCkgPT4ge1xuICAgICAgICAgICAgICBjb25zdCBoZWFkZXJUZXh0ID0gJChlbCkudGV4dCgpLnRyaW0oKTtcbiAgICAgICAgICAgICAgaWYgKC9eXFxkezJ9WzpoXVxcZHsyfS8udGVzdChoZWFkZXJUZXh0KSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IG5leHRFbGVtZW50ID0gJChlbCkubmV4dCgncCcpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGNhbmFpc1RleHQgPSBuZXh0RWxlbWVudC50ZXh0KCkudHJpbSgpO1xuICAgICAgICAgICAgICAgIGNvbnN0IHBhcnRlcyA9IGhlYWRlclRleHQuc3BsaXQoL1xccypbLVx1MjAxM11cXHMqLyk7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgaWYgKHBhcnRlcy5sZW5ndGggPj0gMykge1xuICAgICAgICAgICAgICAgICAgY29uc3QgaG9yYXJpbyA9IHBhcnRlc1swXS5yZXBsYWNlKCdoJywgJzonKS50cmltKCk7XG4gICAgICAgICAgICAgICAgICBjb25zdCB0aW1lcyA9IHBhcnRlc1sxXS5zcGxpdCgvXFxzK3hcXHMrL2kpO1xuICAgICAgICAgICAgICAgICAgY29uc3QgdGltZV9jYXNhID0gdGltZXNbMF0/LnRyaW0oKSB8fCAnSW5kZWZpbmlkbyc7XG4gICAgICAgICAgICAgICAgICBjb25zdCB0aW1lX2ZvcmEgPSB0aW1lc1sxXT8udHJpbSgpIHx8ICdJbmRlZmluaWRvJztcbiAgICAgICAgICAgICAgICAgIGNvbnN0IGxpZ2EgPSBwYXJ0ZXMuc2xpY2UoMikuam9pbignIC0gJykudHJpbSgpO1xuXG4gICAgICAgICAgICAgICAgICBsZXQgY2FuYWlzU3RyID0gY2FuYWlzVGV4dC5yZXBsYWNlKC9jYW5haXM6XFxzKi9pLCAnJyk7XG4gICAgICAgICAgICAgICAgICBpZiAoIWNhbmFpc1RleHQudG9Mb3dlckNhc2UoKS5pbmNsdWRlcygnY2FuYWlzJykpIGNhbmFpc1N0ciA9IFwiQ2FuYWwgblx1MDBFM28gaW5mb3JtYWRvXCI7XG4gICAgICAgICAgICAgICAgICBjb25zdCBjYW5haXMgPSBjYW5haXNTdHIuc3BsaXQoL1ssZV1cXHMrLykubWFwKGMgPT4gYy50cmltKCkpLmZpbHRlcihCb29sZWFuKTtcblxuICAgICAgICAgICAgICAgICAgcmF3Sm9nb3MucHVzaCh7IGhvcmFyaW8sIHRpbWVfY2FzYSwgdGltZV9mb3JhLCBsaWdhLCBjYW5haXMgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8gUGFzc28gMjogQnVzY2Egb3MgZXNjdWRvcyBkZSBmb3JtYSBhc3NcdTAwRURuY3JvbmEgKGNvbSBmb3IuLi5vZilcbiAgICAgICAgICAgIGNvbnN0IGpvZ29zQ29tRXNjdWRvcyA9IFtdO1xuICAgICAgICAgICAgZm9yIChjb25zdCBqb2dvIG9mIHJhd0pvZ29zKSB7XG4gICAgICAgICAgICAgIGNvbnN0IGVzY3Vkb19jYXNhID0gYXdhaXQgZ2V0VGVhbUxvZ28oam9nby50aW1lX2Nhc2EpO1xuICAgICAgICAgICAgICBjb25zdCBlc2N1ZG9fZm9yYSA9IGF3YWl0IGdldFRlYW1Mb2dvKGpvZ28udGltZV9mb3JhKTtcbiAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgIGpvZ29zQ29tRXNjdWRvcy5wdXNoKHtcbiAgICAgICAgICAgICAgICAuLi5qb2dvLFxuICAgICAgICAgICAgICAgIGVzY3Vkb19jYXNhLFxuICAgICAgICAgICAgICAgIGVzY3Vkb19mb3JhXG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjYWNoZSA9IHsgYXR1YWxpemFkb19lbTogbmV3IERhdGUoKS50b0lTT1N0cmluZygpLCBqb2dvczogam9nb3NDb21Fc2N1ZG9zIH07XG4gICAgICAgICAgICBjYWNoZVRpbWUgPSBEYXRlLm5vdygpO1xuXG4gICAgICAgICAgICByZXMuZW5kKEpTT04uc3RyaW5naWZ5KGNhY2hlKSk7XG4gICAgICAgICAgfSBjYXRjaCAoZXJyb3I6IGFueSkge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkVycm8gbmEgQVBJOlwiLCBlcnJvcik7XG4gICAgICAgICAgICByZXMuc3RhdHVzQ29kZSA9IDUwMDtcbiAgICAgICAgICAgIHJlcy5lbmQoSlNPTi5zdHJpbmdpZnkoeyBlcnJvcjogJ0ZhbGhhJywgZGV0YWxoZXM6IGVycm9yLm1lc3NhZ2UgfSkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICBdLFxuICByZXNvbHZlOiB7XG4gICAgYWxpYXM6IHsgJ0AnOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi9zcmMnKSB9LFxuICB9LFxufSk7Il0sCiAgIm1hcHBpbmdzIjogIjtBQUF5TixTQUFTLG9CQUFvQjtBQUN0UCxPQUFPLFdBQVc7QUFDbEIsT0FBTyxVQUFVO0FBQ2pCLFlBQVksYUFBYTtBQUh6QixJQUFNLG1DQUFtQztBQU16QyxJQUFNLFlBQVksb0JBQUksSUFBb0I7QUFFMUMsZUFBZSxZQUFZLFVBQW1DO0FBRTVELE1BQUksVUFBVSxJQUFJLFFBQVEsR0FBRztBQUMzQixXQUFPLFVBQVUsSUFBSSxRQUFRO0FBQUEsRUFDL0I7QUFFQSxNQUFJO0FBRUYsVUFBTSxNQUFNLCtEQUErRCxtQkFBbUIsUUFBUSxDQUFDO0FBQ3ZHLFVBQU0sV0FBVyxNQUFNLE1BQU0sR0FBRztBQUNoQyxVQUFNLE9BQU8sTUFBTSxTQUFTLEtBQUs7QUFFakMsUUFB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
