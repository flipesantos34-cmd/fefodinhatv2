import { Trophy, Github, Twitter, Youtube } from 'lucide-react';

const FOOTER_LINKS = [
  {
    title: 'Conteúdo',
    links: ['Ao Vivo', 'Hoje', 'Esta Semana', 'Competições', 'Times'],
  },
  {
    title: 'Plataforma',
    links: ['Como Funciona', 'Qualidade', 'Dispositivos', 'Status'],
  },
  {
    title: 'Suporte',
    links: ['Ajuda', 'Contato', 'Reportar Problema', 'FAQ'],
  },
];

export function Footer() {
  return (
    <footer
      className="border-t border-border mt-16"
      role="contentinfo"
      aria-label="Rodapé"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <a
              href="#inicio"
              className="flex items-center gap-3 text-text-primary font-bold text-lg mb-4"
            >
              <span
                className="w-9 h-9 rounded-xs flex items-center justify-center bg-accent text-accent-contrast"
                aria-hidden="true"
              >
                <Trophy size={20} />
              </span>
              <span>
                Fefodinha<span className="text-accent">TV</span>
              </span>
            </a>
            <p className="text-sm text-text-secondary max-w-xs leading-relaxed">
              Futebol ao vivo, rápido e gratuito. Assista aos principais jogos do Brasil e do mundo.
            </p>
            <div className="flex gap-2 mt-6">
              <a
                href="#"
                className="btn btn-ghost btn-icon"
                aria-label="Twitter / X"
              >
                <Twitter size={18} aria-hidden="true" />
              </a>
              <a
                href="#"
                className="btn btn-ghost btn-icon"
                aria-label="YouTube"
              >
                <Youtube size={18} aria-hidden="true" />
              </a>
              <a
                href="#"
                className="btn btn-ghost btn-icon"
                aria-label="GitHub"
              >
                <Github size={18} aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* Link columns */}
          {FOOTER_LINKS.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h2 className="text-xs text-text-primary font-semibold uppercase tracking-wide mb-4">
                {col.title}
              </h2>
              <ul className="flex flex-col gap-3">
                {col.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="link text-sm">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-text-dim">
            © {new Date().getFullYear()} FefodinhaTV. Todos os direitos reservados.
          </p>
          <div className="flex gap-6">
            <a href="#" className="link text-xs">Termos de Uso</a>
            <a href="#" className="link text-xs">Privacidade</a>
            <a href="#" className="link text-xs">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
