export interface StreamOption {
  id: string;
  label: string;
  /** Raw HTML containing an <iframe> element to inject directly */
  html?: string;
  /** A plain URL to encapsulate in an <iframe src=...> */
  url?: string;
}

export interface Channel {
  id: string;
  name: string;
  description: string;
  logoColor: string;
  logoText: string;
  logo?: string; // Nova propriedade adicionada para as imagens
  options: StreamOption[];
}

export const CHANNELS: Channel[] = [
  {
    id: 'espn',
    name: 'ESPN',
    description: 'Esportes ao vivo 24 horas por dia',
    logoColor: '#d50000',
    logoText: 'ESPN',
    logo: 'https://logodownload.org/wp-content/uploads/2015/05/espn-logo-4-1.png',
    options: [
      {
        id: 'es1',
        label: 'Opção 1',
        html: '<iframe marginheight="0" marginwidth="0" src="https://meuplayeronlinehd.com/myplay/watch.html?id=espn" scrolling="no" allowfullscreen="yes" allow="encrypted-media; picture-in-picture;" width="100%" height="100%" frameborder="0"></iframe>',
      },
      {
        id: 'es2',
        label: 'Opção 2',
        html: '<iframe marginheight="0" marginwidth="0" src="https://meuplayeronlinehd.com/myplay/watch.html?id=espn-2" scrolling="no" allowfullscreen="yes" allow="encrypted-media; picture-in-picture;" width="100%" height="100%" frameborder="0"></iframe>',
      },
      {
        id: 'es3',
        label: 'Opção 3',
        url: 'https://ww5.embedtv.lat/espn',
      },
      {
        id: 'es4',
        label: 'Opção 4',
        html: '<iframe src="https://embedcanaisdetv.xyz/e/index.php?canal=espn" allow="autoplay; fullscreen; encrypted-media" frameborder="0" width="100%" height="550" loading="lazy"></iframe>',
      },
    ],
  },
  {
    id: 'cazetv',
    name: 'CazeTV',
    description: 'Esportes e entretenimento',
    logoColor: '#ff6600',
    logoText: 'CZ',
    logo: 'https://logodownload.org/wp-content/uploads/2024/03/cazetv-logo-2.png',
    options: [
      {
        id: 'cz1',
        label: 'Opção 1',
        html: '<iframe marginheight="0" marginwidth="0" src="https://meuplayeronlinehd.com/myplay/watch.html?id=cazetv" scrolling="no" allowfullscreen="yes" allow="encrypted-media; picture-in-picture;" width="100%" height="100%" frameborder="0"></iframe>',
      },
      {
        id: 'cz2',
        label: 'Opção 2',
        html: '<iframe marginheight="0" marginwidth="0" src="https://meuplayeronlinehd.com/myplay/watch.html?id=cazetv1" scrolling="no" allowfullscreen="yes" allow="encrypted-media; picture-in-picture;" width="100%" height="100%" frameborder="0"></iframe>',
      },
      {
        id: 'cz3',
        label: 'Opção 3',
        html: '<iframe marginheight="0" marginwidth="0" src="https://meuplayeronlinehd.com/myplay/watch.html?id=cazetv1-2" scrolling="no" allowfullscreen="yes" allow="encrypted-media; picture-in-picture;" width="100%" height="100%" frameborder="0"></iframe>',
      },
    ],
  },
  {
    id: 'xsports',
    name: 'xSports',
    description: 'Esportes e conteúdo esportivo variado',
    logoColor: '#00cc66',
    logoText: 'XS',
    // Sem logo definida aqui para manter o fallback de iniciais ativado como teste
    options: [
      {
        id: 'xs1',
        label: 'Opção 1',
        html: '<iframe marginheight="0" marginwidth="0" src="https://meuplayeronlinehd.com/myplay/watch.html?id=xsports" scrolling="no" allowfullscreen="yes" allow="encrypted-media; picture-in-picture;" width="100%" height="100%" frameborder="0"></iframe>',
      },
      {
        id: 'xs2',
        label: 'Opção 2',
        html: '<iframe marginheight="0" marginwidth="0" src="https://meuplayeronlinehd.com/myplay/watch.html?id=xsports-2" scrolling="no" allowfullscreen="yes" allow="encrypted-media; picture-in-picture;" width="100%" height="100%" frameborder="0"></iframe>',
      },
      {
        id: 'xs3',
        label: 'Opção 3',
        html: '<iframe marginheight="0" marginwidth="0" src="https://sporturbo.link/player/canais/dspl-xsports" scrolling="no" allowfullscreen="yes" allow="encrypted-media; picture-in-picture;" width="100%" height="100%" frameborder="0"></iframe>',
      },
    ],
  },
  {
    id: 'premiere',
    name: 'Premiere',
    description: 'Campeonato Brasileiro ao vivo',
    logoColor: '#0066cc',
    logoText: 'PRE',
    logo: 'https://logodownload.org/wp-content/uploads/2017/05/premiere-fc-logo-4.png', // Ajustado para .png
    options: [
      {
        id: 'pr1',
        label: 'Opção 1',
        html: '<iframe marginheight="0" marginwidth="0" src="https://meuplayeronlinehd.com/myplay/watch.html?id=premiere" scrolling="no" allowfullscreen="yes" allow="encrypted-media; picture-in-picture;" width="100%" height="100%" frameborder="0"></iframe>',
      },
      {
        id: 'pr2',
        label: 'Opção 2',
        html: '<iframe marginheight="0" marginwidth="0" src="https://meuplayeronlinehd.com/myplay/watch.html?id=premiere-2" scrolling="no" allowfullscreen="yes" allow="encrypted-media; picture-in-picture;" width="100%" height="100%" frameborder="0"></iframe>',
      },
      {
        id: 'pr3',
        label: 'Opção 3',
        html: '<iframe marginheight="0" marginwidth="0" src="https://sporturbo.link/player/canais/ampv-pfc1" scrolling="no" allowfullscreen="yes" allow="encrypted-media; picture-in-picture;" width="100%" height="100%" frameborder="0"></iframe>',
      },
    ],
  },
  {
    id: 'primevideo',
    name: 'Amazon Prime Video',
    description: 'Futebol, filmes e séries',
    logoColor: '#00A8E1',
    logoText: 'PV',
    logo: 'https://logodownload.org/wp-content/uploads/2018/07/prime-video-logo-1.png',
    options: [
      {
        id: 'pv1',
        label: 'Opção 1',
        html: '<iframe marginheight="0" marginwidth="0" src="https://meuplayeronlinehd.com/myplay/watch.html?id=brasileiraoprime" scrolling="no" allowfullscreen="yes" allow="encrypted-media; picture-in-picture;" width="100%" height="100%" frameborder="0"></iframe>',
      },
      {
        id: 'pv2',
        label: 'Opção 2',
        html: '<iframe marginheight="0" marginwidth="0" src="https://meuplayeronlinehd.com/myplay/watch.html?id=brasileiraoprime-2" scrolling="no" allowfullscreen="yes" allow="encrypted-media; picture-in-picture;" width="100%" height="100%" frameborder="0"></iframe>',
      },
      {
        id: 'pv3',
        label: 'Opção 3',
        html: '<iframe marginheight="0" marginwidth="0" src="https://sporturbo.link/player/canais/ampv1" scrolling="no" allowfullscreen="yes" allow="encrypted-media; picture-in-picture;" width="100%" height="100%" frameborder="0"></iframe>',
      },
      {
        id: 'pv4',
        label: 'Opção 4',
        url: 'https://ww5.embedtv.lat/primevideo',
      },
      {
        id: 'pv5',
        label: 'Opção 5',
        url: 'https://embedcanaisdetv.xyz/e/index.php?canal=amazonprimevideo',
      },
    ],
  },
];