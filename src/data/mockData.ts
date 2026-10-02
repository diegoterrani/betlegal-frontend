import { BetEntity, RegulatoryChange, ContestationTicket, UserRole, UserSession } from '../types';

export const INITIAL_ENTITIES: BetEntity[] = [
  {
    id: 'ent-1',
    slug: 'betano',
    brandName: 'Betano',
    tradeNames: ['Betano Brasil', 'Kaizen Gaming'],
    legalName: 'Kaizen Gaming Brasil Ltda.',
    cnpj: '41.693.684/0001-44',
    status: 'AUTORIZADA_NACIONAL',
    statusText: 'Autorizada — nacional, SPA/MF',
    sphere: 'federal',
    sigapProtocol: '0002/2024',
    portariaNumber: 'Portaria SPA/MF nº 1.475/2024 e Despacho Decisório nº 42/2025',
    officialSource: 'Secretaria de Prêmios e Apostas do Ministério da Fazenda (SPA/MF)',
    officialSourceUrl: 'https://www.gov.br/fazenda/pt-br/composicao/orgaos/secretaria-de-premios-e-apostas',
    licenseDate: '01/10/2024',
    verifiedAt: '22/09/2026',
    lastCheckedTime: '12:03 BRT',
    domains: [
      {
        host: 'betano.bet.br',
        isPrimary: true,
        registeredToCnpj: '41.693.684/0001-44',
        liveness: 'ONLINE',
        httpCode: 200,
        sslIssuer: "Let's Encrypt Authority E6",
        sslValidUntil: '15/12/2026',
        ipAddress: '104.18.28.140',
        asn: 'AS13335 (Cloudflare, Inc.)',
        hostingProvider: 'Cloudflare Edge Brazil',
        detectedAt: '22/09/2026 12:00 BRT',
      },
      {
        host: 'br.betano.bet.br',
        isPrimary: false,
        registeredToCnpj: '41.693.684/0001-44',
        liveness: 'ONLINE',
        httpCode: 200,
        sslIssuer: "DigiCert Global TLS RSA",
        sslValidUntil: '20/11/2026',
        ipAddress: '104.18.29.140',
        asn: 'AS13335 (Cloudflare, Inc.)',
        hostingProvider: 'Cloudflare Edge Brazil',
        detectedAt: '22/09/2026 12:00 BRT',
      },
    ],
    evidenceSummary: 'Registro formal ativo no SIGAP/MF sob processo nº 0002/2024. Migração e conformidade técnica para a extensão de domínio oficial .bet.br validada pela Secretaria.',
    reputation: {
      reclameAquiScore: 8.1,
      complaintsCount: 14210,
      solvedRatePercent: 86.4,
      answeredRatePercent: 99.2,
      avgResponseHours: 14,
      proconNotificationsCount: 12,
      ratingLabel: 'Ótimo',
    },
    historicalChanges: [
      {
        date: '15/01/2025',
        description: 'Conclusão de transição para o domínio de topo restrito betano.bet.br com certs validados.',
        source: 'Diário Oficial da União (DOU)',
      },
      {
        date: '01/10/2024',
        description: 'Inclusão na lista nacional prioritária da Portaria SPA/MF nº 1.475.',
        source: 'SPA/MF - Consulta Pública',
      },
    ],
  },
  {
    id: 'ent-2',
    slug: 'bet365',
    brandName: 'Bet365',
    tradeNames: ['Bet365 Brasil', 'Hillside'],
    legalName: 'Hillside (Brazil Gaming) Ltda.',
    cnpj: '48.910.123/0001-15',
    status: 'AUTORIZADA_NACIONAL',
    statusText: 'Autorizada — nacional, SPA/MF',
    sphere: 'federal',
    sigapProtocol: '0011/2024',
    portariaNumber: 'Portaria SPA/MF nº 1.475/2024 e DOU nº 193/2024',
    officialSource: 'Secretaria de Prêmios e Apostas do Ministério da Fazenda (SPA/MF)',
    officialSourceUrl: 'https://www.gov.br/fazenda/pt-br/composicao/orgaos/secretaria-de-premios-e-apostas',
    licenseDate: '01/10/2024',
    verifiedAt: '22/09/2026',
    lastCheckedTime: '12:03 BRT',
    domains: [
      {
        host: 'bet365.bet.br',
        isPrimary: true,
        registeredToCnpj: '48.910.123/0001-15',
        liveness: 'ONLINE',
        httpCode: 200,
        sslIssuer: 'Sectigo RSA Domain Validation',
        sslValidUntil: '04/01/2027',
        ipAddress: '151.101.65.140',
        asn: 'AS54113 (Fastly)',
        hostingProvider: 'Fastly Inc.',
        detectedAt: '22/09/2026 12:00 BRT',
      },
    ],
    evidenceSummary: 'Processo SIGAP nº 0011/2024 deferido com operação sob razão social nacional e infraestrutura de dados auditada pela SPA/MF.',
    reputation: {
      reclameAquiScore: 6.9,
      complaintsCount: 22430,
      solvedRatePercent: 71.2,
      answeredRatePercent: 94.0,
      avgResponseHours: 48,
      proconNotificationsCount: 38,
      ratingLabel: 'Regular',
    },
    historicalChanges: [
      {
        date: '02/10/2024',
        description: 'Confirmação do requerimento regularizado e outorga técnica inicial.',
        source: 'SPA/MF - Portaria 1.475',
      },
    ],
  },
  {
    id: 'ent-3',
    slug: 'superbet',
    brandName: 'Superbet',
    tradeNames: ['Superbet Brasil', 'MagicJackpot'],
    legalName: 'Superbet Brasil Tecnologia Ltda.',
    cnpj: '49.332.180/0001-80',
    status: 'AUTORIZADA_NACIONAL',
    statusText: 'Autorizada — nacional, SPA/MF',
    sphere: 'federal',
    sigapProtocol: '0004/2024',
    portariaNumber: 'Portaria SPA/MF nº 1.475/2024',
    officialSource: 'Secretaria de Prêmios e Apostas do Ministério da Fazenda (SPA/MF)',
    officialSourceUrl: 'https://www.gov.br/fazenda/pt-br/composicao/orgaos/secretaria-de-premios-e-apostas',
    licenseDate: '01/10/2024',
    verifiedAt: '22/09/2026',
    lastCheckedTime: '12:03 BRT',
    domains: [
      {
        host: 'superbet.bet.br',
        isPrimary: true,
        registeredToCnpj: '49.332.180/0001-80',
        liveness: 'ONLINE',
        httpCode: 200,
        sslIssuer: 'Cloudflare Inc ECC CA-3',
        sslValidUntil: '28/02/2027',
        ipAddress: '172.67.142.99',
        asn: 'AS13335 (Cloudflare)',
        hostingProvider: 'Cloudflare CDN',
        detectedAt: '22/09/2026 12:00 BRT',
      },
      {
        host: 'magicjackpot.bet.br',
        isPrimary: false,
        registeredToCnpj: '49.332.180/0001-80',
        liveness: 'ONLINE',
        httpCode: 200,
        sslIssuer: 'Cloudflare Inc ECC CA-3',
        sslValidUntil: '19/03/2027',
        ipAddress: '172.67.143.102',
        asn: 'AS13335 (Cloudflare)',
        hostingProvider: 'Cloudflare CDN',
        detectedAt: '22/09/2026 12:00 BRT',
      },
    ],
    evidenceSummary: 'Operador com outorga plena registrada no SIGAP sob nº 0004/2024, sede em São Paulo/SP, capital social integralizado conforme exigência legal.',
    reputation: {
      reclameAquiScore: 7.9,
      complaintsCount: 5120,
      solvedRatePercent: 83.1,
      answeredRatePercent: 98.7,
      avgResponseHours: 19,
      proconNotificationsCount: 5,
      ratingLabel: 'Bom',
    },
    historicalChanges: [
      {
        date: '10/01/2025',
        description: 'Ativação do domínio secundário magicjackpot.bet.br.',
        source: 'SPA/MF - Aditivo Técnico',
      },
    ],
  },
  {
    id: 'ent-4',
    slug: 'estrelabet',
    brandName: 'EstrelaBet',
    tradeNames: ['Estrela Bet Brasil'],
    legalName: 'Stars Investments Brasil Ltda.',
    cnpj: '44.890.320/0001-09',
    status: 'AUTORIZADA_NACIONAL',
    statusText: 'Autorizada — nacional, SPA/MF',
    sphere: 'federal',
    sigapProtocol: '0015/2024',
    portariaNumber: 'Portaria SPA/MF nº 1.475/2024',
    officialSource: 'Secretaria de Prêmios e Apostas do Ministério da Fazenda (SPA/MF)',
    officialSourceUrl: 'https://www.gov.br/fazenda/pt-br/composicao/orgaos/secretaria-de-premios-e-apostas',
    licenseDate: '01/10/2024',
    verifiedAt: '22/09/2026',
    lastCheckedTime: '12:03 BRT',
    domains: [
      {
        host: 'estrelabet.bet.br',
        isPrimary: true,
        registeredToCnpj: '44.890.320/0001-09',
        liveness: 'ONLINE',
        httpCode: 200,
        sslIssuer: 'Amazon RSA 2048 M02',
        sslValidUntil: '12/10/2026',
        ipAddress: '54.232.110.15',
        asn: 'AS16509 (Amazon.com)',
        hostingProvider: 'AWS sa-east-1 (São Paulo)',
        detectedAt: '22/09/2026 12:00 BRT',
      },
    ],
    evidenceSummary: 'Empresa nacional sediada em Belo Horizonte/MG, regularizada com documentação fiscal, certidões negativas e cumprimento de jogo responsável.',
    reputation: {
      reclameAquiScore: 7.7,
      complaintsCount: 8940,
      solvedRatePercent: 81.0,
      answeredRatePercent: 96.5,
      avgResponseHours: 22,
      proconNotificationsCount: 8,
      ratingLabel: 'Bom',
    },
    historicalChanges: [
      {
        date: '01/10/2024',
        description: 'Habilitação concedida na lista nacional da Fazenda.',
        source: 'Ministério da Fazenda',
      },
    ],
  },
  {
    id: 'ent-5',
    slug: 'betfair',
    brandName: 'Betfair',
    tradeNames: ['Betfair Brasil', 'Flutter Group', 'PokerStars'],
    legalName: 'Betfair Brasil Tecnologia Ltda.',
    cnpj: '43.120.301/0001-92',
    status: 'AUTORIZADA_NACIONAL',
    statusText: 'Autorizada — nacional, SPA/MF',
    sphere: 'federal',
    sigapProtocol: '0006/2024',
    portariaNumber: 'Portaria SPA/MF nº 1.475/2024',
    officialSource: 'Secretaria de Prêmios e Apostas do Ministério da Fazenda (SPA/MF)',
    officialSourceUrl: 'https://www.gov.br/fazenda/pt-br/composicao/orgaos/secretaria-de-premios-e-apostas',
    licenseDate: '01/10/2024',
    verifiedAt: '22/09/2026',
    lastCheckedTime: '12:03 BRT',
    domains: [
      {
        host: 'betfair.bet.br',
        isPrimary: true,
        registeredToCnpj: '43.120.301/0001-92',
        liveness: 'ONLINE',
        httpCode: 200,
        sslIssuer: 'GlobalSign Atlas R3 DV TLS CA',
        sslValidUntil: '14/04/2027',
        ipAddress: '199.232.192.133',
        asn: 'AS54113 (Fastly)',
        hostingProvider: 'Fastly Global Edge',
        detectedAt: '22/09/2026 12:00 BRT',
      },
      {
        host: 'pokerstars.bet.br',
        isPrimary: false,
        registeredToCnpj: '43.120.301/0001-92',
        liveness: 'ONLINE',
        httpCode: 200,
        sslIssuer: 'GlobalSign Atlas R3 DV TLS CA',
        sslValidUntil: '14/04/2027',
        ipAddress: '199.232.192.134',
        asn: 'AS54113 (Fastly)',
        hostingProvider: 'Fastly Global Edge',
        detectedAt: '22/09/2026 12:00 BRT',
      },
    ],
    evidenceSummary: 'Grupo Flutter Entertainment licenciado para operação de exchange, sportsbook e pôquer sob requisitos de integridade da SPA/MF.',
    reputation: {
      reclameAquiScore: 7.2,
      complaintsCount: 6840,
      solvedRatePercent: 75.4,
      answeredRatePercent: 93.8,
      avgResponseHours: 36,
      proconNotificationsCount: 14,
      ratingLabel: 'Bom',
    },
    historicalChanges: [
      {
        date: '05/11/2024',
        description: 'Vínculo do domínio pokerstars.bet.br averbado no SIGAP.',
        source: 'SIGAP/SPA',
      },
    ],
  },
  {
    id: 'ent-6',
    slug: 'pixbet',
    brandName: 'Pixbet',
    tradeNames: ['Pixbet Rio', 'Pixstar'],
    legalName: 'Pixstar Brasil Ltda.',
    cnpj: '40.633.348/0001-30',
    status: 'AUTORIZADA_ESTADUAL',
    statusText: 'Autorizada — estadual',
    sphere: 'estadual',
    stateJurisdiction: 'RJ (Loterj)',
    sigapProtocol: 'Credenciamento Loterj nº 001/2023',
    portariaNumber: 'Termo de Credenciamento Loterj nº 001/2023 e Decisão Judicial TRF-2',
    officialSource: 'Loteria do Estado do Rio de Janeiro (Loterj)',
    officialSourceUrl: 'http://www.loterj.rj.gov.br',
    licenseDate: '15/06/2023',
    verifiedAt: '22/09/2026',
    lastCheckedTime: '12:03 BRT',
    domains: [
      {
        host: 'pixbet.com.br',
        isPrimary: true,
        registeredToCnpj: '40.633.348/0001-30',
        liveness: 'ONLINE',
        httpCode: 200,
        sslIssuer: 'Cloudflare Inc ECC CA-3',
        sslValidUntil: '11/08/2027',
        ipAddress: '104.21.55.19',
        asn: 'AS13335 (Cloudflare)',
        hostingProvider: 'Cloudflare',
        detectedAt: '22/09/2026 12:00 BRT',
      },
      {
        host: 'pixbet.rj.gov.br',
        isPrimary: false,
        registeredToCnpj: '40.633.348/0001-30',
        liveness: 'ONLINE',
        httpCode: 200,
        sslIssuer: 'Let\'s Encrypt Authority E6',
        sslValidUntil: '20/12/2026',
        ipAddress: '104.21.55.20',
        asn: 'AS13335 (Cloudflare)',
        hostingProvider: 'Cloudflare',
        detectedAt: '22/09/2026 12:00 BRT',
      },
    ],
    evidenceSummary: 'Autorizada por credenciamento formal na Loteria do Estado do Rio de Janeiro (Loterj). Mantém debate judicial referente ao alcance geográfico da outorga estadual.',
    reputation: {
      reclameAquiScore: 6.8,
      complaintsCount: 18450,
      solvedRatePercent: 70.2,
      answeredRatePercent: 91.5,
      avgResponseHours: 42,
      proconNotificationsCount: 29,
      ratingLabel: 'Regular',
    },
    historicalChanges: [
      {
        date: '10/08/2024',
        description: 'Julgamento de agravo mantendo a vigência do credenciamento Loterj.',
        source: 'Tribunal Regional Federal da 2ª Região (TRF-2)',
      },
    ],
  },
  {
    id: 'ent-7',
    slug: 'apostou-parana',
    brandName: 'Apostou.com',
    tradeNames: ['Apostou Paraná', 'Lotepar Concessionária'],
    legalName: 'Apostou Paraná Serviços Lotéricos S.A.',
    cnpj: '50.112.449/0001-90',
    status: 'AUTORIZADA_ESTADUAL',
    statusText: 'Autorizada — estadual',
    sphere: 'estadual',
    stateJurisdiction: 'PR (Lotepar)',
    sigapProtocol: 'Contrato de Concessão Lotepar 003/2023',
    portariaNumber: 'Edital de Concorrência Internacional Lotepar nº 01/2023',
    officialSource: 'Loterias do Estado do Paraná (Lotepar)',
    officialSourceUrl: 'https://www.lotepar.pr.gov.br',
    licenseDate: '18/11/2023',
    verifiedAt: '22/09/2026',
    lastCheckedTime: '12:03 BRT',
    domains: [
      {
        host: 'apostou.com.br',
        isPrimary: true,
        registeredToCnpj: '50.112.449/0001-90',
        liveness: 'ONLINE',
        httpCode: 200,
        sslIssuer: 'Google Trust Services LLC',
        sslValidUntil: '08/04/2027',
        ipAddress: '34.95.140.22',
        asn: 'AS15169 (Google LLC)',
        hostingProvider: 'Google Cloud Platform (GCP São Paulo)',
        detectedAt: '22/09/2026 12:00 BRT',
      },
    ],
    evidenceSummary: 'Concessão pública lotérica regulada pela Lotepar para operação territorial no Estado do Paraná com integração a sistemas de fiscalização financeira estadual.',
    reputation: {
      reclameAquiScore: 7.5,
      complaintsCount: 920,
      solvedRatePercent: 82.0,
      answeredRatePercent: 97.4,
      avgResponseHours: 16,
      proconNotificationsCount: 1,
      ratingLabel: 'Bom',
    },
    historicalChanges: [
      {
        date: '02/02/2024',
        description: 'Certificação de liveness e integridade homologada pela Lotepar.',
        source: 'Diário Oficial Executivo do Paraná',
      },
    ],
  },
  {
    id: 'ent-8',
    slug: 'betsul',
    brandName: 'BetSul',
    tradeNames: ['BetSul Brasil'],
    legalName: 'BSL Entretenimento e Tecnologia Ltda.',
    cnpj: '38.192.401/0001-55',
    status: 'DECISAO_JUDICIAL',
    statusText: 'Opera por decisão judicial',
    sphere: 'judicial',
    sigapProtocol: 'Processo nº 1092837-12.2024.4.01.3400',
    portariaNumber: 'Mandado de Segurança Coletivo - 8ª Vara Federal Cível da SJDF',
    officialSource: 'Tribunal Regional Federal da 1ª Região (TRF-1) / JFDF',
    officialSourceUrl: 'https://portal.trf1.jus.br',
    verifiedAt: '22/09/2026',
    lastCheckedTime: '12:03 BRT',
    domains: [
      {
        host: 'betsul.com',
        isPrimary: true,
        registeredToCnpj: '38.192.401/0001-55',
        liveness: 'ONLINE',
        httpCode: 200,
        sslIssuer: 'Sectigo RSA Organization Validation',
        sslValidUntil: '22/10/2026',
        ipAddress: '104.22.10.88',
        asn: 'AS13335 (Cloudflare)',
        hostingProvider: 'Cloudflare',
        detectedAt: '22/09/2026 12:00 BRT',
      },
    ],
    evidenceSummary: 'Opera mediante tutela provisória de urgência concedida pela Justiça Federal impedindo atos sancionatórios da Fazenda enquanto pendente recurso administrativo.',
    reputation: {
      reclameAquiScore: 7.0,
      complaintsCount: 3410,
      solvedRatePercent: 74.0,
      answeredRatePercent: 92.1,
      avgResponseHours: 30,
      proconNotificationsCount: 7,
      ratingLabel: 'Bom',
    },
    historicalChanges: [
      {
        date: '28/11/2024',
        description: 'Intimação judicial expedida à União Federal para abstenção de bloqueio.',
        source: 'PJe - Justiça Federal',
      },
    ],
  },
  {
    id: 'ent-9',
    slug: 'lucky-brasil',
    brandName: 'Lucky Brasil',
    tradeNames: ['Lucky Bet'],
    legalName: 'Lucky Brasil Gaming e Loterias Ltda.',
    cnpj: '51.332.901/0001-77',
    status: 'REQUERIMENTO_EM_ANALISE',
    statusText: 'Requerimento em análise',
    sphere: 'federal',
    sigapProtocol: '0089/2024',
    portariaNumber: 'Protocolo de Ingresso SIGAP nº 0089/2024',
    officialSource: 'Secretaria de Prêmios e Apostas do Ministério da Fazenda (SPA/MF)',
    officialSourceUrl: 'https://www.gov.br/fazenda/pt-br/composicao/orgaos/secretaria-de-premios-e-apostas',
    verifiedAt: '22/09/2026',
    lastCheckedTime: '12:03 BRT',
    domains: [
      {
        host: 'luckybrasil.com',
        isPrimary: true,
        registeredToCnpj: '51.332.901/0001-77',
        liveness: 'ONLINE',
        httpCode: 200,
        sslIssuer: 'Let\'s Encrypt Authority E6',
        sslValidUntil: '15/11/2026',
        ipAddress: '198.54.117.200',
        asn: 'AS22612 (Namecheap)',
        hostingProvider: 'Namecheap Hosting',
        detectedAt: '22/09/2026 12:00 BRT',
      },
    ],
    evidenceSummary: 'Submeteu formulário e documentação no SIGAP em 18/08/2024. Processo está sob diligência da Coordenação-Geral de Autorização da SPA/MF. Não possui portaria autorizativa definitiva.',
    reputation: {
      reclameAquiScore: 5.4,
      complaintsCount: 780,
      solvedRatePercent: 58.0,
      answeredRatePercent: 84.0,
      avgResponseHours: 64,
      proconNotificationsCount: 4,
      ratingLabel: 'Ruim',
    },
    historicalChanges: [
      {
        date: '18/08/2024',
        description: 'Protocolo de requerimento cadastrado no sistema SIGAP.',
        source: 'Consulta Pública SPA/MF',
      },
    ],
  },
  {
    id: 'ent-10',
    slug: 'alfabet-brasil',
    brandName: 'AlfaBet',
    tradeNames: ['AlfaBet Brasil'],
    legalName: 'Alfa Soluções em Entretenimento Digital Ltda.',
    cnpj: '47.199.302/0001-22',
    status: 'SUSPENSA_REVOGADA',
    statusText: 'Saiu da lista oficial / suspensa',
    sphere: 'federal',
    sigapProtocol: '0041/2024',
    portariaNumber: 'Despacho Decisório SPA/MF nº 412/2024',
    officialSource: 'Diário Oficial da União (DOU) / SPA/MF',
    officialSourceUrl: 'https://www.in.gov.br',
    verifiedAt: '22/09/2026',
    lastCheckedTime: '12:03 BRT',
    domains: [
      {
        host: 'alfabet.net.br',
        isPrimary: true,
        registeredToCnpj: '47.199.302/0001-22',
        liveness: 'UNRESPONSIVE',
        httpCode: 503,
        sslIssuer: 'Let\'s Encrypt Authority E6',
        sslValidUntil: '02/10/2025',
        ipAddress: '185.199.110.153',
        asn: 'AS54455',
        hostingProvider: 'Offshore Hosting Provider',
        detectedAt: '22/09/2026 12:00 BRT',
      },
    ],
    evidenceSummary: 'Empresa constava na lista de adequação inicial de setembro de 2024, mas teve seu processo indeferido em 12/12/2024 por não atendimento às exigências de conformidade prudencial e patrimonial.',
    reputation: {
      reclameAquiScore: 3.8,
      complaintsCount: 2900,
      solvedRatePercent: 34.0,
      answeredRatePercent: 62.0,
      avgResponseHours: 120,
      proconNotificationsCount: 45,
      ratingLabel: 'Não Recomendado',
    },
    historicalChanges: [
      {
        date: '12/12/2024',
        description: 'Publicação de despacho no DOU determinando o descredenciamento e arquivamento do pedido.',
        source: 'DOU Seção 1 nº 239',
      },
    ],
  },
  {
    id: 'ent-11',
    slug: 'betano-app-bonus-xyz',
    brandName: 'Possível Clone: Betano Bônus VIP',
    tradeNames: ['Betano Bonus 500', 'Betano App Oficial'],
    legalName: 'Titular Não Identificado (WHOIS com dados ocultos)',
    cnpj: 'Sem CNPJ associado nas fontes oficiais',
    status: 'NAO_AUTORIZADA_DETECTADA',
    statusText: 'Não consta nas listas de autorização consultadas',
    sphere: 'nenhuma',
    officialSource: 'Varredura Ativa do Radar BetLegal e Base de Domínios Registrados',
    officialSourceUrl: 'https://registro.br',
    verifiedAt: '22/09/2026',
    lastCheckedTime: '12:03 BRT',
    domains: [
      {
        host: 'betano-app-bonus.xyz',
        isPrimary: true,
        registeredToCnpj: 'N/A',
        liveness: 'ONLINE',
        httpCode: 200,
        sslIssuer: 'ZeroSSL RSA Domain CA',
        sslValidUntil: '30/11/2026',
        ipAddress: '194.87.139.42',
        asn: 'AS49505 (Selectel Russia)',
        hostingProvider: 'Offshore VPS Moscow',
        detectedAt: '21/09/2026 18:30 BRT',
      },
    ],
    evidenceSummary: 'Sinais técnicos de clonagem/lookalike da marca Betano (Kaizen Gaming). Utiliza elementos visuais da marca autorizada sem autorização do titular legítimo e sem vínculo societário.',
    cloneRiskNotice: 'Possível clone / lookalike — veja as evidências. O domínio legítimo autorizado da Betano é betano.bet.br.',
    reputation: {
      reclameAquiScore: 0,
      complaintsCount: 140,
      solvedRatePercent: 0,
      answeredRatePercent: 0,
      avgResponseHours: 0,
      proconNotificationsCount: 19,
      ratingLabel: 'Não Recomendado',
    },
    historicalChanges: [
      {
        date: '21/09/2026',
        description: 'Detecção primária pelo crawler do Radar BetLegal em campanha de links patrocinados.',
        source: 'Radar BetLegal Engine',
      },
    ],
  },
  {
    id: 'ent-12',
    slug: 'bet365-apostas-vip-online',
    brandName: 'Possível Clone: Bet365 VIP',
    tradeNames: ['Bet365 Mobile VIP'],
    legalName: 'WhoisGuard Inc. (Privacidade ativada)',
    cnpj: 'Sem registro de CNPJ',
    status: 'BLOQUEADA_ANATEL',
    statusText: 'Constou em lista de bloqueio publicada',
    sphere: 'nenhuma',
    officialSource: 'Ofício SPA/MF nº 0842/2024 / Anatel Despacho de Bloqueio nº 11.204/2024',
    officialSourceUrl: 'https://www.anatel.gov.br',
    verifiedAt: '22/09/2026',
    lastCheckedTime: '12:03 BRT',
    domains: [
      {
        host: 'bet365-apostas-vip.online',
        isPrimary: true,
        registeredToCnpj: 'N/A',
        liveness: 'BLOCKED_DNS',
        httpCode: 451,
        sslIssuer: 'Let\'s Encrypt Authority E6',
        sslValidUntil: '10/01/2027',
        ipAddress: '127.0.0.1 (DNS Sinkhole)',
        asn: 'N/A (Sinkholed)',
        hostingProvider: 'Provedores de Conexão Nacionais',
        anatelBlockOrder: 'Processo Anatel 53500.081920/2024',
        detectedAt: '20/09/2026 12:00 BRT',
      },
    ],
    evidenceSummary: 'Incluído na listagem de domínios sem outorga submetidos a bloqueio administrativo por determinação da SPA/MF à Anatel e às operadoras de telecomunicações.',
    cloneRiskNotice: 'Constou em lista de bloqueio publicada. Não utilize nem forneça dados cadastrais.',
    reputation: {
      reclameAquiScore: 0,
      complaintsCount: 88,
      solvedRatePercent: 0,
      answeredRatePercent: 0,
      avgResponseHours: 0,
      proconNotificationsCount: 15,
      ratingLabel: 'Não Recomendado',
    },
    historicalChanges: [
      {
        date: '14/10/2024',
        description: 'Envio de notificação às prestadoras para bloqueio DNS do host.',
        source: 'Anatel - Notificação Formal',
      },
    ],
  },
  {
    id: 'ent-13',
    slug: 'fortunebet777-fun',
    brandName: 'Fortune Bet 777',
    tradeNames: ['Tigrinho VIP', 'Fortune Fun'],
    legalName: 'Domain Admin, Privacy Protect, LLC',
    cnpj: 'Não consta',
    status: 'BLOQUEADA_ANATEL',
    statusText: 'Constou em lista de bloqueio publicada',
    sphere: 'nenhuma',
    officialSource: 'Ofício SPA/MF nº 0842/2024 / Anatel',
    officialSourceUrl: 'https://www.anatel.gov.br',
    verifiedAt: '22/09/2026',
    lastCheckedTime: '12:03 BRT',
    domains: [
      {
        host: 'fortunebet777.fun',
        isPrimary: true,
        registeredToCnpj: 'N/A',
        liveness: 'OFFLINE',
        httpCode: 0,
        ipAddress: 'Inacessível',
        anatelBlockOrder: 'Processo Anatel 53500.081920/2024',
        detectedAt: '22/09/2026 06:00 BRT',
      },
    ],
    evidenceSummary: 'Domínio listado no primeiro lote de bloqueio de 2.040 sites irregulares remetido pela Fazenda à Anatel em outubro de 2024.',
    reputation: {
      reclameAquiScore: 0,
      complaintsCount: 312,
      solvedRatePercent: 0,
      answeredRatePercent: 0,
      avgResponseHours: 0,
      proconNotificationsCount: 24,
      ratingLabel: 'Sem índice',
    },
    historicalChanges: [
      {
        date: '11/10/2024',
        description: 'Ordem de bloqueio disparada para as operadoras de telecomunicações.',
        source: 'Ministério da Fazenda',
      },
    ],
  },
  {
    id: 'ent-14',
    slug: 'sportingbet',
    brandName: 'Sportingbet',
    tradeNames: ['Sporting Bet Brasil', 'Entain'],
    legalName: 'ElectraWorks Brasil Ltda.',
    cnpj: '42.119.882/0001-04',
    status: 'AUTORIZADA_NACIONAL',
    statusText: 'Autorizada — nacional, SPA/MF',
    sphere: 'federal',
    sigapProtocol: '0007/2024',
    portariaNumber: 'Portaria SPA/MF nº 1.475/2024',
    officialSource: 'Secretaria de Prêmios e Apostas do Ministério da Fazenda (SPA/MF)',
    officialSourceUrl: 'https://www.gov.br/fazenda/pt-br/composicao/orgaos/secretaria-de-premios-e-apostas',
    licenseDate: '01/10/2024',
    verifiedAt: '22/09/2026',
    lastCheckedTime: '12:03 BRT',
    domains: [
      {
        host: 'sportingbet.bet.br',
        isPrimary: true,
        registeredToCnpj: '42.119.882/0001-04',
        liveness: 'ONLINE',
        httpCode: 200,
        sslIssuer: 'HydrantID Server CA O1',
        sslValidUntil: '22/01/2027',
        ipAddress: '192.225.158.11',
        asn: 'AS20940 (Akamai)',
        hostingProvider: 'Akamai Technologies',
        detectedAt: '22/09/2026 12:00 BRT',
      },
    ],
    evidenceSummary: 'Pertencente ao grupo multinacional Entain. Operação nacional formalizada sob o CNPJ 42.119.882/0001-04 e submetida a auditoria periódica de integridade esportiva.',
    reputation: {
      reclameAquiScore: 7.1,
      complaintsCount: 11200,
      solvedRatePercent: 73.5,
      answeredRatePercent: 95.0,
      avgResponseHours: 26,
      proconNotificationsCount: 16,
      ratingLabel: 'Bom',
    },
    historicalChanges: [
      {
        date: '01/10/2024',
        description: 'Autorização nacional publicada na portaria da SPA/MF.',
        source: 'SPA/MF',
      },
    ],
  },
];

export const REGULATORY_CHANGES: RegulatoryChange[] = [
  {
    id: 'chg-101',
    timestamp: '2026-09-22T12:00:00Z',
    date: '22/09/2026',
    time: '12:00 BRT',
    type: 'block_anatel',
    brandName: 'Possível Clone: Betano Bônus VIP',
    host: 'betano-app-bonus.xyz',
    previousStatus: 'DESCONHECIDA',
    currentStatus: 'NAO_AUTORIZADA_DETECTADA',
    sourceDoc: 'Varredura Janela 2 (12:00 BRT) do Radar BetLegal',
    sourceUrl: 'https://betlegal.com.br/radar',
    summary: 'Novo domínio lookalike detectado com uso indevido de identidade visual sem registro no SIGAP.',
  },
  {
    id: 'chg-102',
    timestamp: '2026-09-22T06:00:00Z',
    date: '22/09/2026',
    time: '06:00 BRT',
    type: 'license_update',
    brandName: 'Superbet',
    host: 'magicjackpot.bet.br',
    previousStatus: 'REQUERIMENTO_EM_ANALISE',
    currentStatus: 'AUTORIZADA_NACIONAL',
    sourceDoc: 'Despacho Homologatório SPA/MF nº 88/2026',
    sourceUrl: 'https://www.gov.br/fazenda/pt-br/composicao/orgaos/secretaria-de-premios-e-apostas',
    summary: 'Averbação e integração do subdomínio magicjackpot.bet.br à autorização nacional da Superbet Brasil Tecnologia Ltda.',
  },
  {
    id: 'chg-103',
    timestamp: '2026-09-21T18:00:00Z',
    date: '21/09/2026',
    time: '18:00 BRT',
    type: 'block_anatel',
    brandName: 'Fortune Bet 777',
    host: 'fortunebet777.fun',
    previousStatus: 'NAO_AUTORIZADA_DETECTADA',
    currentStatus: 'BLOQUEADA_ANATEL',
    sourceDoc: 'Ofício de Execução Anatel nº 18.291/2026',
    sourceUrl: 'https://www.anatel.gov.br',
    summary: 'Confirmação de bloqueio no sistema DNS pelas operadoras Claro, Vivo, TIM e provedores regionais.',
  },
  {
    id: 'chg-104',
    timestamp: '2026-09-20T12:00:00Z',
    date: '20/09/2026',
    time: '12:00 BRT',
    type: 'status_change',
    brandName: 'AlfaBet',
    host: 'alfabet.net.br',
    previousStatus: 'REQUERIMENTO_EM_ANALISE',
    currentStatus: 'SUSPENSA_REVOGADA',
    sourceDoc: 'DOU Seção 1 nº 180 / Despacho SPA 412',
    sourceUrl: 'https://www.in.gov.br',
    summary: 'Indeferimento do pedido por falta de prestação de garantias financeiras obrigatórias.',
  },
  {
    id: 'chg-105',
    timestamp: '2026-09-18T18:00:00Z',
    date: '18/09/2026',
    time: '18:00 BRT',
    type: 'inclusion',
    brandName: 'Apostou.com',
    host: 'apostou.com.br',
    previousStatus: 'DESCONHECIDA',
    currentStatus: 'AUTORIZADA_ESTADUAL',
    sourceDoc: 'Termo Aditivo Lotepar 02/2026',
    sourceUrl: 'https://www.lotepar.pr.gov.br',
    summary: 'Renovação do certificado de conformidade da Lotepar com validação do geofencing paranaense.',
  },
];

export const INITIAL_TICKETS: ContestationTicket[] = [
  {
    id: 'TKT-2026-0891',
    type: 'denuncia_clone',
    brandOrDomain: 'betano-app-bonus.xyz',
    requesterName: 'Equipe de Brand Protection Kaizen',
    requesterEmail: 'compliance@kaizengaming.com',
    requesterRole: 'operador',
    justification: 'Site se passa pela marca Betano oferecendo bônus fraudulento e capturando dados via phishing.',
    evidenceLinks: 'https://whois.domaintools.com/betano-app-bonus.xyz',
    createdAt: '21/09/2026 19:14 BRT',
    status: 'em_analise',
  },
  {
    id: 'TKT-2026-0885',
    type: 'atualizacao_dados',
    brandOrDomain: 'Superbet',
    requesterName: 'Jurídico Superbet Brasil',
    requesterEmail: 'legal.br@superbet.com',
    requesterRole: 'operador',
    justification: 'Inclusão formal de novo subdomínio operacional publicado no Diário Oficial.',
    evidenceLinks: 'DOU nº 178 de 19/09/2026',
    createdAt: '20/09/2026 10:22 BRT',
    status: 'concluido',
  },
];

export interface AuthorizationTrendPoint {
  date: string;
  displayDate: string;
  authorized: number;
  unauthorized: number;
}

export const DETECTION_BREAKDOWN = {
  authorizedBySphere: { nacional: 183, estadual: 59, judicial: 6 },
  unauthorizedTotal: 1020,
  unauthorizedLiveness: { online: 898, offline: 92, offlineSinceAnnouncement: 44, unchecked: 30 },
  today: { newlyDetected: 1, backOnline: 19 },
};

export const AUTHORIZATION_TREND_ANNOTATION = {
  date: '2026-09-25',
  displayDate: '25/09',
  time: '18h',
  label: 'Proibição',
  description: '25/09 às 18h. Anúncio da proibição das bets regulamentadas.',
};

// Estoque diário desde 01/09/2026. Antes de 21/09/2026 não havia coleta de
// não autorizadas (zero = ausência de coleta, não ausência de sites).
export const AUTHORIZATION_TREND: AuthorizationTrendPoint[] = [
  { date: '2026-09-01', displayDate: '01/09', authorized: 150, unauthorized: 0 },
  { date: '2026-09-02', displayDate: '02/09', authorized: 150, unauthorized: 0 },
  { date: '2026-09-03', displayDate: '03/09', authorized: 152, unauthorized: 0 },
  { date: '2026-09-04', displayDate: '04/09', authorized: 152, unauthorized: 0 },
  { date: '2026-09-05', displayDate: '05/09', authorized: 154, unauthorized: 0 },
  { date: '2026-09-06', displayDate: '06/09', authorized: 154, unauthorized: 0 },
  { date: '2026-09-07', displayDate: '07/09', authorized: 155, unauthorized: 0 },
  { date: '2026-09-08', displayDate: '08/09', authorized: 156, unauthorized: 0 },
  { date: '2026-09-09', displayDate: '09/09', authorized: 158, unauthorized: 0 },
  { date: '2026-09-10', displayDate: '10/09', authorized: 160, unauthorized: 0 },
  { date: '2026-09-11', displayDate: '11/09', authorized: 162, unauthorized: 0 },
  { date: '2026-09-12', displayDate: '12/09', authorized: 164, unauthorized: 0 },
  { date: '2026-09-13', displayDate: '13/09', authorized: 166, unauthorized: 0 },
  { date: '2026-09-14', displayDate: '14/09', authorized: 168, unauthorized: 0 },
  { date: '2026-09-15', displayDate: '15/09', authorized: 170, unauthorized: 0 },
  { date: '2026-09-16', displayDate: '16/09', authorized: 172, unauthorized: 0 },
  { date: '2026-09-17', displayDate: '17/09', authorized: 175, unauthorized: 0 },
  { date: '2026-09-18', displayDate: '18/09', authorized: 178, unauthorized: 0 },
  { date: '2026-09-19', displayDate: '19/09', authorized: 182, unauthorized: 0 },
  { date: '2026-09-20', displayDate: '20/09', authorized: 186, unauthorized: 0 },
  { date: '2026-09-21', displayDate: '21/09', authorized: 190, unauthorized: 142 },
  { date: '2026-09-22', displayDate: '22/09', authorized: 214, unauthorized: 148 },
  { date: '2026-09-23', displayDate: '23/09', authorized: 216, unauthorized: 151 },
  { date: '2026-09-24', displayDate: '24/09', authorized: 218, unauthorized: 149 },
  { date: '2026-09-25', displayDate: '25/09', authorized: 220, unauthorized: 163 },
  { date: '2026-09-26', displayDate: '26/09', authorized: 224, unauthorized: 338 },
  { date: '2026-09-27', displayDate: '27/09', authorized: 228, unauthorized: 512 },
  { date: '2026-09-28', displayDate: '28/09', authorized: 232, unauthorized: 689 },
  { date: '2026-09-29', displayDate: '29/09', authorized: 236, unauthorized: 844 },
  { date: '2026-09-30', displayDate: '30/09', authorized: 240, unauthorized: 967 },
  { date: '2026-10-01', displayDate: '01/10', authorized: 244, unauthorized: 1071 },
  { date: '2026-10-02', displayDate: '02/10', authorized: 248, unauthorized: 1014 },
];

export const MARKET_SERIES_DATA = {
  totalAuthorizedNational: 114,
  totalAuthorizedEstadual: 28,
  totalUnderAnalysis: 42,
  totalBlockedAnatel: 2954,
  totalDetectedClones: 681,
  totalVerifiedDomains: 4890,
  monthlyBlockGrowth: [
    { month: 'Out/24', blocks: 2040, authorized: 89 },
    { month: 'Nov/24', blocks: 2210, authorized: 93 },
    { month: 'Dez/24', blocks: 2380, authorized: 98 },
    { month: 'Jan/25', blocks: 2540, authorized: 104 },
    { month: 'Fev/25', blocks: 2710, authorized: 108 },
    { month: 'Mar/25', blocks: 2954, authorized: 114 },
  ],
  stateBreakdown: [
    { state: 'Nacional (SPA/MF)', count: 114, pct: 80.2 },
    { state: 'Rio de Janeiro (Loterj)', count: 18, pct: 12.6 },
    { state: 'Paraná (Lotepar)', count: 6, pct: 4.2 },
    { state: 'Minas Gerais (Lemg)', count: 4, pct: 2.8 },
  ],
  crawlSchedule: [
    { window: 'Janela 1', time: '06:00 BRT', target: 'DOU, SIGAP e Diários Oficiais Estaduais', status: 'Concluído' },
    { window: 'Janela 2', time: '12:00 BRT', target: 'Portal da Fazenda, Anatel e WHOIS .bet.br', status: 'Concluído' },
    { window: 'Janela 3', time: '18:00 BRT', target: 'Radar de clones, DNS liveness e certificados SSL', status: 'Agendado' },
    { window: 'Janela 4', time: '00:00 BRT', target: 'Consolidação de séries, diff temporal e backups', status: 'Agendado' },
  ],
};

// ---------------------------------------------------------------------------
// Painel (super admin) e Área da Operadora — conteúdo adaptado do betlegal-prod
// real (apps/frontend/src/components/views/AdminPanelView.tsx e
// OperatorDeskView.tsx), sem backend: tudo abaixo é estático/mutado em memória.
// ---------------------------------------------------------------------------

export interface PipelineQueues {
  descoberta: number;
  verificacao: number;
  classificacao: number;
  confronto: number;
  publicacao: number;
  updatedAt: string;
}

export const PIPELINE_QUEUES: PipelineQueues = {
  descoberta: 212,
  verificacao: 64,
  classificacao: 38,
  confronto: 15,
  publicacao: 6,
  updatedAt: '02/10/2026 14:32 BRT',
};

export type HumanReviewGroup = 'baixa' | 'terceiro' | 'sonda' | 'betbr' | 'contestacao' | 'outra';

export interface HumanReviewTask {
  id: number;
  host: string;
  group: HumanReviewGroup;
  groupLabel: string;
  reason: string;
  createdAt: string;
  finalUrl: string | null;
  title: string | null;
  isBettingSite: boolean | null;
  targetsBrazil: boolean | null;
  confidence: number | null;
  confidenceTargetsBrazil: number | null;
  rationale: string | null;
  signals: { ptBr: boolean; pix: boolean; keywords: number; lookalike: string | null };
}

export const HUMAN_REVIEW_QUEUE: HumanReviewTask[] = [
  {
    id: 1,
    host: 'apostamaxbet.com',
    group: 'baixa',
    groupLabel: 'Confiança baixa',
    reason: 'Modelo de classificação ficou abaixo de 80% de confiança.',
    createdAt: '02/10/2026 09:14 BRT',
    finalUrl: 'https://apostamaxbet.com',
    title: 'ApostaMax Bet — Apostas esportivas e cassino ao vivo',
    isBettingSite: true,
    targetsBrazil: true,
    confidence: 0.62,
    confidenceTargetsBrazil: 0.88,
    rationale: 'Página em português com Pix, mas sem número de portaria nem CNPJ visível — confiança de classificação abaixo do limiar de publicação automática.',
    signals: { ptBr: true, pix: true, keywords: 14, lookalike: null },
  },
  {
    id: 2,
    host: 'comparabets.net',
    group: 'terceiro',
    groupLabel: 'Página de terceiro',
    reason: 'Pode ser comparador/indicador, não a casa de apostas em si.',
    createdAt: '02/10/2026 08:40 BRT',
    finalUrl: 'https://comparabets.net',
    title: 'ComparaBets — Compare odds e bônus',
    isBettingSite: false,
    targetsBrazil: true,
    confidence: 0.71,
    confidenceTargetsBrazil: 0.9,
    rationale: 'Página lista links de afiliado para outras casas; não processa apostas nem cadastro diretamente.',
    signals: { ptBr: true, pix: false, keywords: 9, lookalike: null },
  },
  {
    id: 3,
    host: 'betano-promocoes.com.br',
    group: 'sonda',
    groupLabel: 'Sonda do Brasil',
    reason: 'A sonda de fora do Brasil não respondeu; aguardando a sonda de São Paulo.',
    createdAt: '02/10/2026 07:55 BRT',
    finalUrl: null,
    title: null,
    isBettingSite: null,
    targetsBrazil: null,
    confidence: null,
    confidenceTargetsBrazil: null,
    rationale: 'Possível bloqueio geográfico direcionado a sondas fora do Brasil. Sem confirmação ainda se bloqueia ou apenas está fora do ar.',
    signals: { ptBr: false, pix: false, keywords: 0, lookalike: 'Betano' },
  },
  {
    id: 4,
    host: 'novasorte.bet.br',
    group: 'betbr',
    groupLabel: '.bet.br fora da lista',
    reason: 'Domínio .bet.br que ainda não consta na última lista publicada pela SPA/MF.',
    createdAt: '01/10/2026 22:10 BRT',
    finalUrl: 'https://novasorte.bet.br',
    title: 'Nova Sorte — Apostas de quota fixa',
    isBettingSite: true,
    targetsBrazil: true,
    confidence: 0.84,
    confidenceTargetsBrazil: 0.97,
    rationale: 'Domínio na zona restrita .bet.br, mas o CNPJ do WHOIS não aparece na lista mais recente da SPA/MF — pode ser outorga recém-concedida ainda não propagada.',
    signals: { ptBr: true, pix: true, keywords: 18, lookalike: null },
  },
  {
    id: 5,
    host: 'pixbet-oficial-vip.com',
    group: 'contestacao',
    groupLabel: 'Contestação',
    reason: 'Operador autorizado contestou a classificação deste domínio como clone.',
    createdAt: '01/10/2026 16:30 BRT',
    finalUrl: 'https://pixbet-oficial-vip.com',
    title: 'PixBet Oficial VIP',
    isBettingSite: true,
    targetsBrazil: true,
    confidence: 0.91,
    confidenceTargetsBrazil: 0.95,
    rationale: 'Pixbet contestou pedindo reclassificação para bloqueio prioritário por uso indevido de marca registrada.',
    signals: { ptBr: true, pix: true, keywords: 21, lookalike: 'Pixbet' },
  },
];

export type AdminUserRole = UserRole;

export interface AdminUserAccount {
  id: number;
  email: string;
  role: AdminUserRole;
}

export interface MockAccount extends UserSession {
  password: string;
}

/** As 3 contas de demonstração pedidas pelo usuário, para validar os painéis logados sem backend.
 * Os e-mails coincidem de propósito com ADMIN_USERS e com o hold de OPERATOR_DESK, abaixo. */
export const MOCK_ACCOUNTS: MockAccount[] = [
  { name: 'Diego Terrani', email: 'diego.terrani@betlegal.com.br', role: 'super_admin', password: 'demo123' },
  { name: 'Kaizen Gaming (Betano)', email: 'compliance@kaizengaming.com', role: 'operator', password: 'demo123' },
  { name: 'Leitor Público', email: 'leitor.publico@gmail.com', role: 'client', password: 'demo123' },
];

export const ADMIN_USERS: AdminUserAccount[] = [
  { id: 1, email: 'diego.terrani@betlegal.com.br', role: 'super_admin' },
  { id: 2, email: 'auditoria@betlegal.com.br', role: 'admin' },
  { id: 3, email: 'compliance@kaizengaming.com', role: 'operator' },
  { id: 4, email: 'leitor.publico@gmail.com', role: 'client' },
];

export interface AdminHoldAccount {
  id: number;
  legalName: string;
  cnpj: string;
  email: string;
  status: 'pending' | 'active';
}

export const ADMIN_HOLDS: AdminHoldAccount[] = [
  { id: 1, legalName: 'Kaizen Gaming Brasil Ltda.', cnpj: '41.693.684/0001-44', email: 'compliance@kaizengaming.com', status: 'active' },
  { id: 2, legalName: 'Superbet Brasil Tecnologia Ltda.', cnpj: '49.332.180/0001-80', email: 'juridico@superbet.com.br', status: 'active' },
  { id: 3, legalName: 'Hillside (Brazil Gaming) Ltda.', cnpj: '48.910.123/0001-15', email: 'cadastro.br@bet365group.com', status: 'pending' },
];

export interface AdminReviewModeration {
  id: number;
  brand: string;
  email: string;
  comment: string | null;
  hidden: boolean;
}

export const ADMIN_REVIEWS: AdminReviewModeration[] = [
  { id: 1, brand: 'Betano', email: 'usuario1@gmail.com', comment: 'Saque caiu em menos de um dia, sem complicação.', hidden: false },
  { id: 2, brand: 'Superbet', email: 'usuario2@gmail.com', comment: 'Suporte demorou a responder no chat.', hidden: false },
  { id: 3, brand: 'Pixbet', email: 'usuario3@gmail.com', comment: 'Mensagem com link suspeito, provavelmente de um clone e não da casa.', hidden: true },
];

export interface CloneLinkRef {
  cloneSlug: string;
  officialSlug: string;
  relation: 'redirect' | 'cnpj';
  relationLabel: string;
}

/** Vínculo direto medido entre o domínio não autorizado e a casa regulamentada que ele imita. */
export const CLONE_LINKS: CloneLinkRef[] = [
  { cloneSlug: 'betano-app-bonus-xyz', officialSlug: 'betano', relation: 'cnpj', relationLabel: 'Cita o CNPJ da operadora' },
  { cloneSlug: 'bet365-apostas-vip-online', officialSlug: 'bet365', relation: 'redirect', relationLabel: 'Redireciona para o domínio oficial' },
];

/** Avaliação de um usuário sobre uma marca, com nota em 5 eixos (igual ao RatingModal de prod) e resposta opcional da operadora. Fica num estado compartilhado (ver ReviewsContext) para que /avaliacoes (quem avalia) e /operadora (quem responde) leiam e escrevam no mesmo lugar. */
export interface BrandReview {
  id: number;
  brandSlug: string;
  brand: string;
  authorEmail: string;
  comment: string;
  reply: string | null;
  createdAt: string;
  starsSafety: number;
  starsPayout: number;
  starsSupport: number;
  starsSpeed: number;
  starsResponsible: number;
}

export const INITIAL_BRAND_REVIEWS: BrandReview[] = [
  {
    id: 1,
    brandSlug: 'betano',
    brand: 'Betano',
    authorEmail: 'leitor.publico@gmail.com',
    comment: 'Saque caiu em menos de um dia, sem complicação.',
    reply: null,
    createdAt: '28/09/2026',
    starsSafety: 5,
    starsPayout: 5,
    starsSupport: 4,
    starsSpeed: 5,
    starsResponsible: 4,
  },
  {
    id: 2,
    brandSlug: 'betano',
    brand: 'Betano',
    authorEmail: 'usuario2@gmail.com',
    comment: 'Recebi mensagem de um "SAC Betano" por WhatsApp pedindo dados — acho que era golpe de clone.',
    reply: 'Obrigado pelo alerta. A Betano não contata clientes por WhatsApp pedindo dados. Reportamos o número para o canal de denúncia.',
    createdAt: '25/09/2026',
    starsSafety: 3,
    starsPayout: 5,
    starsSupport: 5,
    starsSpeed: 4,
    starsResponsible: 5,
  },
  {
    id: 3,
    brandSlug: 'betano',
    brand: 'Betano',
    authorEmail: 'usuario3@gmail.com',
    comment: 'App trava bastante no celular mais antigo, mas no navegador funciona bem.',
    reply: null,
    createdAt: '20/09/2026',
    starsSafety: 5,
    starsPayout: 4,
    starsSupport: 3,
    starsSpeed: 3,
    starsResponsible: 4,
  },
  {
    id: 4,
    brandSlug: 'superbet',
    brand: 'Superbet',
    authorEmail: 'usuario4@gmail.com',
    comment: 'Suporte demorou a responder no chat, mas resolveram no mesmo dia.',
    reply: null,
    createdAt: '22/09/2026',
    starsSafety: 4,
    starsPayout: 4,
    starsSupport: 3,
    starsSpeed: 3,
    starsResponsible: 4,
  },
  {
    id: 5,
    brandSlug: 'bet365',
    brand: 'Bet365',
    authorEmail: 'usuario5@gmail.com',
    comment: 'Site estável, nunca tive problema para sacar.',
    reply: null,
    createdAt: '18/09/2026',
    starsSafety: 5,
    starsPayout: 5,
    starsSupport: 4,
    starsSpeed: 4,
    starsResponsible: 5,
  },
];

export interface OperatorDeskData {
  hold: { legalName: string; cnpj: string; domain: string; status: 'pending' | 'active'; linkedToSpa: boolean; spaCheckedAt: string | null };
  houseSlugs: string[];
  cloneSlugs: string[];
}

/** Sessão simulada de uma operadora logada (Kaizen Gaming / Betano), usada em /operadora. */
export const OPERATOR_DESK: OperatorDeskData = {
  hold: {
    legalName: 'Kaizen Gaming Brasil Ltda.',
    cnpj: '41.693.684/0001-44',
    domain: 'betano.bet.br',
    status: 'active',
    linkedToSpa: true,
    spaCheckedAt: '02/10/2026 12:00 BRT',
  },
  houseSlugs: ['betano'],
  cloneSlugs: ['betano-app-bonus-xyz'],
};
