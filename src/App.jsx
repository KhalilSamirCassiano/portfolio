import { useState, useEffect, useRef } from "react";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=JetBrains+Mono:wght@400;500;700&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

  :root {
    --bg: #04050f;
    --surface: #0b0d1a;
    --surface2: #111425;
    --cyan: #00d4ff;
    --cyan-dim: rgba(0,212,255,0.12);
    --cyan-glow: rgba(0,212,255,0.35);
    --purple: #7c3aed;
    --green: #10b981;
    --amber: #f59e0b;
    --text: #e2e8f0;
    --muted: #64748b;
    --border: rgba(255,255,255,0.06);
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  html { scroll-behavior: smooth; }

  body, #root {
    background: var(--bg);
    color: var(--text);
    font-family: 'DM Sans', sans-serif;
    min-height: 100vh;
    overflow-x: hidden;
  }

  .syne { font-family: 'Syne', sans-serif; }
  .mono { font-family: 'JetBrains Mono', monospace; }

  ::-webkit-scrollbar { width: 3px; }
  ::-webkit-scrollbar-track { background: var(--bg); }
  ::-webkit-scrollbar-thumb { background: var(--cyan-glow); border-radius: 2px; }

  /* Grid background */
  .grid-bg {
    background-image:
      linear-gradient(rgba(0,212,255,0.025) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,212,255,0.025) 1px, transparent 1px);
    background-size: 48px 48px;
  }

  /* Noise overlay */
  .noise::after {
    content: '';
    position: fixed;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E");
    pointer-events: none;
    z-index: 0;
    opacity: 0.4;
  }

  /* NAV */
  .nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    background: rgba(4,5,15,0.85);
    backdrop-filter: blur(16px);
    border-bottom: 1px solid var(--border);
    padding: 0 32px;
    height: 60px;
    display: flex; align-items: center; justify-content: space-between;
  }

  .nav-logo {
    font-family: 'JetBrains Mono', monospace;
    font-size: 14px;
    color: var(--cyan);
    letter-spacing: 0.05em;
  }

  .nav-links { display: flex; gap: 32px; align-items: center; }

  .nav-link {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    color: var(--muted);
    text-decoration: none;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    cursor: pointer;
    transition: color 0.2s;
    background: none; border: none;
  }
  .nav-link:hover { color: var(--cyan); }

  .nav-cta {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    padding: 7px 18px;
    border: 1px solid var(--cyan);
    color: var(--cyan);
    background: transparent;
    cursor: pointer;
    transition: all 0.2s;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }
  .nav-cta:hover { background: var(--cyan); color: var(--bg); }

  /* HERO */
  .hero {
    min-height: 100vh;
    display: flex; align-items: center;
    padding: 100px 32px 60px;
    position: relative;
  }

  .hero-eyebrow {
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px;
    color: var(--cyan);
    letter-spacing: 0.2em;
    text-transform: uppercase;
    display: flex; align-items: center; gap: 12px;
    margin-bottom: 24px;
    opacity: 0;
    animation: fadeUp 0.6s ease 0.2s forwards;
  }

  .hero-eyebrow::before {
    content: '';
    width: 32px; height: 1px;
    background: var(--cyan);
  }

  .hero-name {
    font-family: 'Syne', sans-serif;
    font-size: clamp(48px, 8vw, 96px);
    font-weight: 800;
    line-height: 1;
    letter-spacing: -0.03em;
    color: var(--text);
    opacity: 0;
    animation: fadeUp 0.7s ease 0.35s forwards;
  }

  .hero-name .accent { color: var(--cyan); }

  .hero-title {
    font-family: 'JetBrains Mono', monospace;
    font-size: clamp(14px, 2vw, 20px);
    color: var(--muted);
    margin-top: 16px;
    min-height: 28px;
    opacity: 0;
    animation: fadeUp 0.7s ease 0.5s forwards;
  }

  .cursor {
    display: inline-block;
    width: 2px; height: 1.1em;
    background: var(--cyan);
    vertical-align: text-bottom;
    animation: blink 0.8s step-end infinite;
  }

  .hero-desc {
    margin-top: 28px;
    font-size: 16px;
    color: var(--muted);
    max-width: 540px;
    line-height: 1.8;
    font-weight: 300;
    opacity: 0;
    animation: fadeUp 0.7s ease 0.65s forwards;
  }

  .hero-actions {
    margin-top: 40px;
    display: flex; gap: 16px; flex-wrap: wrap;
    opacity: 0;
    animation: fadeUp 0.7s ease 0.8s forwards;
  }

  .btn-primary {
    padding: 12px 32px;
    background: var(--cyan);
    color: var(--bg);
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    border: none; cursor: pointer;
    font-weight: 700;
    transition: all 0.2s;
    clip-path: polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px));
  }
  .btn-primary:hover { background: #33ddff; transform: translateY(-2px); }

  .btn-outline {
    padding: 12px 32px;
    background: transparent;
    color: var(--text);
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    border: 1px solid var(--border);
    cursor: pointer;
    transition: all 0.2s;
  }
  .btn-outline:hover { border-color: var(--cyan); color: var(--cyan); }

  .hero-stats {
    margin-top: 64px;
    display: flex; gap: 48px; flex-wrap: wrap;
    opacity: 0;
    animation: fadeUp 0.7s ease 1s forwards;
  }

  .stat-item {}

  .stat-num {
    font-family: 'Syne', sans-serif;
    font-size: 36px;
    font-weight: 800;
    color: var(--cyan);
    line-height: 1;
  }

  .stat-label {
    font-size: 12px;
    color: var(--muted);
    margin-top: 4px;
    font-family: 'JetBrains Mono', monospace;
    letter-spacing: 0.05em;
  }

  /* SECTION */
  .section { padding: 100px 32px; max-width: 1200px; margin: 0 auto; }

  .section-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    color: var(--cyan);
    letter-spacing: 0.2em;
    text-transform: uppercase;
    display: flex; align-items: center; gap: 12px;
    margin-bottom: 16px;
  }
  .section-label::before { content: ''; width: 24px; height: 1px; background: var(--cyan); }

  .section-title {
    font-family: 'Syne', sans-serif;
    font-size: clamp(32px, 4vw, 52px);
    font-weight: 800;
    color: var(--text);
    letter-spacing: -0.02em;
    line-height: 1.1;
    margin-bottom: 16px;
  }

  .section-sub {
    font-size: 16px;
    color: var(--muted);
    font-weight: 300;
    max-width: 560px;
    line-height: 1.7;
    margin-bottom: 64px;
  }

  /* SERVICE CARDS */
  .services-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 1px;
    background: var(--border);
    border: 1px solid var(--border);
  }

  .service-card {
    background: var(--surface);
    padding: 36px;
    position: relative;
    overflow: hidden;
    transition: background 0.3s;
    cursor: default;
  }

  .service-card::after {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, var(--cyan), transparent);
    transform: scaleX(0);
    transition: transform 0.4s ease;
  }

  .service-card:hover { background: var(--surface2); }
  .service-card:hover::after { transform: scaleX(1); }

  .service-icon {
    font-size: 28px;
    margin-bottom: 20px;
    display: block;
  }

  .service-badge {
    position: absolute;
    top: 20px; right: 20px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 9px;
    padding: 3px 10px;
    background: rgba(0,212,255,0.1);
    border: 1px solid rgba(0,212,255,0.3);
    color: var(--cyan);
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  .service-title {
    font-family: 'Syne', sans-serif;
    font-size: 20px;
    font-weight: 700;
    color: var(--text);
    margin-bottom: 4px;
  }

  .service-subtitle {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    color: var(--cyan);
    margin-bottom: 16px;
    opacity: 0.7;
  }

  .service-desc {
    font-size: 14px;
    color: var(--muted);
    line-height: 1.7;
    font-weight: 300;
    margin-bottom: 24px;
  }

  .service-features {
    list-style: none;
    display: flex; flex-direction: column; gap: 8px;
  }

  .service-features li {
    font-size: 13px;
    color: #94a3b8;
    display: flex; align-items: center; gap: 10px;
  }

  .service-features li::before {
    content: '→';
    color: var(--cyan);
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px;
    flex-shrink: 0;
  }

  /* PROJECT CARDS */
  .projects-list { display: flex; flex-direction: column; gap: 2px; }

  .project-card {
    background: var(--surface);
    border: 1px solid var(--border);
    padding: 40px;
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 32px;
    align-items: start;
    transition: border-color 0.3s, background 0.3s;
    position: relative;
    overflow: hidden;
  }

  .project-card::before {
    content: '';
    position: absolute;
    left: 0; top: 0; bottom: 0;
    width: 3px;
    background: var(--accent-color, var(--cyan));
    transform: scaleY(0);
    transition: transform 0.3s ease;
    transform-origin: bottom;
  }

  .project-card:hover { background: var(--surface2); border-color: rgba(255,255,255,0.12); }
  .project-card:hover::before { transform: scaleY(1); }

  .project-title {
    font-family: 'Syne', sans-serif;
    font-size: 24px;
    font-weight: 700;
    color: var(--text);
    margin-bottom: 4px;
  }

  .project-sub {
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px;
    color: var(--muted);
    margin-bottom: 16px;
  }

  .project-desc {
    font-size: 14px;
    color: #94a3b8;
    line-height: 1.8;
    font-weight: 300;
    margin-bottom: 20px;
  }

  .project-tags { display: flex; flex-wrap: wrap; gap: 8px; }

  .tag {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    padding: 3px 10px;
    background: rgba(255,255,255,0.04);
    border: 1px solid var(--border);
    color: var(--muted);
    letter-spacing: 0.05em;
  }

  .project-impact {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    color: var(--green);
    padding: 10px 16px;
    border: 1px solid rgba(16,185,129,0.2);
    background: rgba(16,185,129,0.05);
    min-width: 260px;
    line-height: 1.6;
    align-self: start;
  }

  /* STACK */
  .stack-grid {
    display: flex; flex-wrap: wrap; gap: 8px;
  }

  .stack-tag {
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px;
    padding: 8px 16px;
    background: var(--surface);
    border: 1px solid var(--border);
    color: var(--muted);
    transition: all 0.2s;
    cursor: default;
    display: flex; align-items: center; gap: 8px;
  }

  .stack-tag:hover { border-color: var(--cyan); color: var(--cyan); background: var(--cyan-dim); }

  .stack-cat {
    font-size: 9px;
    padding: 1px 6px;
    background: rgba(0,212,255,0.08);
    color: var(--cyan);
    opacity: 0.6;
    border-radius: 2px;
  }

  /* TIMELINE */
  .timeline { position: relative; padding-left: 32px; }

  .timeline::before {
    content: '';
    position: absolute;
    left: 0; top: 0; bottom: 0;
    width: 1px;
    background: linear-gradient(to bottom, var(--cyan), rgba(0,212,255,0.1));
  }

  .tl-item {
    position: relative;
    padding: 28px 0 28px 32px;
    border-bottom: 1px solid var(--border);
  }

  .tl-item:last-child { border-bottom: none; }

  .tl-dot {
    position: absolute;
    left: -5px; top: 36px;
    width: 10px; height: 10px;
    background: var(--bg);
    border: 2px solid var(--cyan);
    border-radius: 50%;
  }

  .tl-dot.active { background: var(--cyan); box-shadow: 0 0 12px var(--cyan-glow); }

  .tl-period {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    color: var(--cyan);
    margin-bottom: 8px;
    letter-spacing: 0.05em;
  }

  .tl-role {
    font-family: 'Syne', sans-serif;
    font-size: 20px;
    font-weight: 700;
    color: var(--text);
    margin-bottom: 4px;
  }

  .tl-company {
    font-size: 13px;
    color: var(--muted);
    margin-bottom: 12px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px;
  }

  .tl-desc {
    font-size: 14px;
    color: #94a3b8;
    line-height: 1.7;
    font-weight: 300;
    max-width: 600px;
  }

  /* CERTS */
  .certs-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1px;
    background: var(--border);
    border: 1px solid var(--border);
  }

  .cert-card {
    background: var(--surface);
    padding: 24px 28px;
    transition: background 0.2s;
    position: relative;
  }

  .cert-card:hover { background: var(--surface2); }

  .cert-year {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    color: var(--cyan);
    margin-bottom: 8px;
    opacity: 0.7;
  }

  .cert-name {
    font-size: 14px;
    font-weight: 500;
    color: var(--text);
    margin-bottom: 4px;
    line-height: 1.4;
  }

  .cert-org {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    color: var(--muted);
  }

  /* CONTACT */
  .contact-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2px;
    background: var(--border);
    border: 1px solid var(--border);
  }

  @media (max-width: 640px) {
    .contact-grid { grid-template-columns: 1fr; }
    .project-card { grid-template-columns: 1fr; }
    .hero-stats { gap: 32px; }
    .nav-links { display: none; }
  }

  .contact-item {
    background: var(--surface);
    padding: 32px;
    transition: background 0.2s;
    display: flex; flex-direction: column; gap: 8px;
  }

  .contact-item:hover { background: var(--surface2); }

  .contact-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    color: var(--cyan);
    letter-spacing: 0.15em;
    text-transform: uppercase;
  }

  .contact-value {
    font-size: 15px;
    color: var(--text);
    font-weight: 400;
    text-decoration: none;
    transition: color 0.2s;
  }

  .contact-value:hover { color: var(--cyan); }

  /* FOOTER */
  .footer {
    border-top: 1px solid var(--border);
    padding: 32px;
    display: flex; justify-content: space-between; align-items: center;
    flex-wrap: wrap; gap: 16px;
  }

  .footer-text {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    color: var(--muted);
    letter-spacing: 0.05em;
  }

  /* ABOUT */
  .about-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 80px;
    align-items: start;
  }

  @media (max-width: 768px) {
    .about-grid { grid-template-columns: 1fr; gap: 40px; }
    .services-grid { grid-template-columns: 1fr; }
  }

  .about-text {
    font-size: 17px;
    color: #94a3b8;
    line-height: 1.9;
    font-weight: 300;
  }

  .about-highlight {
    color: var(--text);
    font-weight: 400;
  }

  .about-info { display: flex; flex-direction: column; gap: 24px; }

  .info-item {
    border-left: 1px solid var(--cyan);
    padding-left: 20px;
  }

  .info-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    color: var(--cyan);
    letter-spacing: 0.15em;
    text-transform: uppercase;
    margin-bottom: 4px;
    opacity: 0.7;
  }

  .info-value {
    font-size: 15px;
    color: var(--text);
    font-weight: 400;
  }

  /* ANIMATIONS */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
  }

  @keyframes floatOrb {
    0%, 100% { transform: translate(0, 0) scale(1); }
    33% { transform: translate(30px, -40px) scale(1.05); }
    66% { transform: translate(-20px, 20px) scale(0.96); }
  }

  /* ORB decorations */
  .orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
    pointer-events: none;
    animation: floatOrb 12s ease-in-out infinite;
  }

  .divider {
    border: none;
    border-top: 1px solid var(--border);
    margin: 0;
  }
`;

const services = [
  {
    icon: "⚡",
    title: "Automação de Processos",
    subtitle: "N8N · Make · Zapier",
    desc: "Elimine tarefas manuais e repetitivas integrando seus sistemas. Fluxos inteligentes que trabalham 24/7 no lugar da sua equipe, com rastreabilidade e zero retrabalho.",
    features: ["Integração entre sistemas heterogêneos", "Fluxos de aprovação automatizados", "Notificações e alertas em tempo real", "Sincronização e reconciliação de dados"],
    badge: "Mais popular"
  },
  {
    icon: "🤖",
    title: "Agentes de IA",
    subtitle: "LLMs · RAG · Multi-agente",
    desc: "Assistentes autônomos que interpretam linguagem natural, tomam decisões e executam tarefas complexas end-to-end — sem intervenção humana.",
    features: ["Atendimento autônomo completo", "Tomada de decisão baseada em regras de negócio", "Memória e contexto persistente", "Orquestração de múltiplos agentes"],
    badge: "Alta demanda"
  },
  {
    icon: "🔌",
    title: "Integrações de API",
    subtitle: "REST · Webhooks · OAuth",
    desc: "Conectamos qualquer sistema ao seu ecossistema digital. Se tem API, conseguimos integrar — independente da complexidade ou legado do sistema.",
    features: ["Mapeamento e documentação de endpoints", "Autenticação segura (OAuth, JWT, API Key)", "Tratamento de erros, retry e fallback", "Monitoramento de disponibilidade"],
    badge: null
  },
  {
    icon: "💬",
    title: "Chatbots & Atendimento",
    subtitle: "WhatsApp · Telegram · Web",
    desc: "Bots inteligentes que atendem, qualificam e convertem clientes automaticamente, com escalação inteligente para humanos nos momentos certos.",
    features: ["Qualificação e triagem de leads", "Integração com CRM e sistemas de vendas", "Respostas com IA generativa contextual", "Escalação inteligente para atendimento humano"],
    badge: null
  },
  {
    icon: "📊",
    title: "Dashboards & BI",
    subtitle: "Power BI · Supabase · Excel",
    desc: "Transformamos dados brutos em painéis estratégicos. Visualize KPIs em tempo real e tome decisões embasadas — não baseadas em feeling.",
    features: ["KPIs e métricas em tempo real", "Relatórios automáticos agendados", "Alertas inteligentes por threshold", "Consolidação de múltiplas fontes de dados"],
    badge: null
  }
];

const projects = [
  {
    title: "ASTRIX",
    subtitle: "Ecossistema de IA para Crédito Consignado",
    desc: "Agente autônomo de atendimento via WhatsApp que gerencia a esteira completa de crédito consignado end-to-end. Da qualificação do cliente e simulação de valores, passando pela validação de regras bancárias, até a digitação automática da proposta nos sistemas dos bancos — sem nenhuma intervenção manual.",
    tags: ["N8N", "Gemini LLM", "Supabase", "Redis", "APIs Bancárias", "RAG", "WhatsApp"],
    impact: "Eliminou 100% da intervenção manual na digitação de propostas e zerou erros operacionais",
    accent: "#00d4ff"
  },
  {
    title: "BI Reaproveitamento",
    subtitle: "Business Intelligence para Recuperação de Receita",
    desc: "Estruturação de área de inteligência de dados focada em reverter 'dinheiro na mesa'. Implementação de dashboards estratégicos em Power BI para monitoramento de KPIs de perdas financeiras, identificação de gargalos no funil de vendas e criação de estratégias ativas de reaproveitamento.",
    tags: ["Power BI", "PostgreSQL", "Excel Avançado", "ETL", "KPIs"],
    impact: "Transformou capital perdido em receita recuperada via análise granular dos motivos de recusa",
    accent: "#10b981"
  },
  {
    title: "Portfólio N8N",
    subtitle: "Automações & Integrações em Produção",
    desc: "Diversas automações de processos de negócio rodando em produção — integrações entre sistemas, pipelines de dados, notificações automáticas, fluxos de aprovação e processos operacionais totalmente automatizados para diferentes contextos e clientes.",
    tags: ["N8N", "APIs REST", "Webhooks", "PostgreSQL", "WhatsApp", "E-mail"],
    impact: null,
    accent: "#7c3aed"
  }
];

const stack = [
  { name: "N8N", cat: "Automação" },
  { name: "Make", cat: "Automação" },
  { name: "Zapier", cat: "Automação" },
  { name: "PostgreSQL", cat: "Banco de Dados" },
  { name: "Supabase", cat: "Banco de Dados" },
  { name: "MySQL", cat: "Banco de Dados" },
  { name: "Power BI", cat: "BI" },
  { name: "Excel Avançado", cat: "BI" },
  { name: "REST APIs", cat: "Integração" },
  { name: "Webhooks", cat: "Integração" },
  { name: "LLMs / IA Gen.", cat: "IA" },
  { name: "RAG", cat: "IA" },
  { name: "Redis", cat: "Infra" },
  { name: "Python", cat: "Dev" },
  { name: "Git", cat: "Dev" },
];

const experience = [
  {
    role: "Product Growth Manager",
    company: "Finanbank Consultoria Financeira",
    period: "Mar/2025 – Atual",
    desc: "Responsável pela estratégia de crescimento de produtos financeiros, utilizando análise de dados para identificar oportunidades de inovação. Liderança na transformação digital da empresa, idealizando e gerenciando o desenvolvimento de soluções que automatizam o atendimento e aumentam a conversão de vendas.",
    active: true
  },
  {
    role: "Assistente Comercial",
    company: "Finanbank Consultoria Financeira",
    period: "Jul/2024 – Mar/2025",
    desc: "Suporte estratégico a parceiros B2B, resolução de casos críticos e interface com bancos parceiros. Garantindo retenção e fidelização da carteira de clientes.",
    active: false
  },
  {
    role: "Digitador Operacional / Operador de Call Center",
    company: "Finanbank Consultoria Financeira",
    period: "Jul/2022 – Jun/2024",
    desc: "Responsável pela entrada, validação de dados e digitação nos sistemas bancários com foco em precisão e compliance (LGPD). Desenvolvimento de resiliência e habilidade de negociação através do atendimento direto ao cliente.",
    active: false
  },
  {
    role: "Sócio Administrativo",
    company: "Lava&Leva Lavanderias",
    period: "2015 – 2017",
    desc: "Gestão integral da unidade, incluindo fluxo de caixa, controle de estoque e atendimento ao cliente, desenvolvendo visão de dono e responsabilidade financeira.",
    active: false
  }
];

const certs = [
  { name: "Fundamentos de Data Science e Inteligência Artificial", org: "Data Science Academy", year: "2026" },
  { name: "Bootcamp GenIA e Dados", org: "Bradesco / DIO", year: "2026" },
  { name: "Mercado Financeiro de A a Z", org: "ANBIMA", year: "2023" },
  { name: "Fundos de Investimento", org: "ANBIMA", year: "2023" },
  { name: "PLDFT Empréstimo Consignado", org: "FEBRABAN", year: "2022" },
  { name: "Correspondente Consignado LGPD", org: "FEBRABAN", year: "2022" },
];

export default function App() {
  const [typed, setTyped] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const fullTitle = "Analista de Automação & IA";

  useEffect(() => {
    let i = 0;
    const t = setInterval(() => {
      setTyped(fullTitle.slice(0, i + 1));
      i++;
      if (i >= fullTitle.length) clearInterval(t);
    }, 55);
    return () => clearInterval(t);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <style>{css}</style>

      {/* NAV */}
      <nav className="nav">
        <span className="nav-logo">KS.dev</span>
        <div className="nav-links">
          {["sobre", "servicos", "projetos", "contato"].map(s => (
            <button key={s} className="nav-link" onClick={() => scrollTo(s)}>
              {s === "servicos" ? "serviços" : s}
            </button>
          ))}
        </div>
        <button className="nav-cta" onClick={() => scrollTo("contato")}>
          Fale comigo
        </button>
      </nav>

      {/* HERO */}
      <section id="home" className="hero grid-bg" style={{ position: "relative" }}>
        {/* Orbs */}
        <div className="orb" style={{
          width: 500, height: 500,
          background: "radial-gradient(circle, rgba(0,212,255,0.08), transparent 70%)",
          top: "10%", right: "-10%", animationDuration: "14s"
        }} />
        <div className="orb" style={{
          width: 400, height: 400,
          background: "radial-gradient(circle, rgba(124,58,237,0.07), transparent 70%)",
          bottom: "5%", left: "-5%", animationDuration: "18s", animationDelay: "-6s"
        }} />

        <div style={{ position: "relative", zIndex: 1, maxWidth: 800 }}>
          <div className="hero-eyebrow">
            Fortaleza, CE · Disponível para projetos
          </div>

          <h1 className="hero-name">
            Khalil<br />
            <span className="accent">Cassiano</span>
          </h1>

          <p className="hero-title">
            {typed}<span className="cursor" />
          </p>

          <p className="hero-desc">
            Graduando em Ciência da Computação com trajetória no mercado financeiro.
            Especialista em orquestrar automações complexas, integrar IA generativa a
            processos de negócio e transformar operações manuais em fluxos inteligentes e escaláveis.
          </p>

          <div className="hero-actions">
            <button className="btn-primary" onClick={() => scrollTo("servicos")}>
              Ver serviços
            </button>
            <button className="btn-outline" onClick={() => scrollTo("projetos")}>
              Ver projetos
            </button>
          </div>

          <div className="hero-stats">
            <div className="stat-item">
              <div className="stat-num">1+</div>
              <div className="stat-label">anos em automação</div>
            </div>
            <div className="stat-item">
              <div className="stat-num">15+</div>
              <div className="stat-label">stacks dominadas</div>
            </div>
            <div className="stat-item">
              <div className="stat-num">E2E</div>
              <div className="stat-label">do negócio ao deploy</div>
            </div>
          </div>
        </div>
      </section>

      <hr className="divider" />

      {/* ABOUT */}
      <section id="sobre" style={{ padding: "100px 32px", maxWidth: 1200, margin: "0 auto" }}>
        <div className="section-label">Sobre</div>
        <div className="about-grid">
          <div>
            <h2 className="section-title">Na interseção entre<br /><span style={{ color: "var(--cyan)" }}>negócios e tecnologia</span></h2>
            <p className="about-text" style={{ marginTop: 24 }}>
              Comecei na <span className="about-highlight">operação de um mercado financeiro</span>, entendia profundamente as dores do processo antes de automatizá-lo.
              Essa visão de negócio combinada com expertise técnica é o que me diferencia — não crio automações genéricas,{" "}
              <span className="about-highlight">crio soluções que entendem o contexto do problema.</span>
            </p>
            <p className="about-text" style={{ marginTop: 20 }}>
              Hoje atuo como <span className="about-highlight">Product Growth Manager</span> na Finanbank, liderando a transformação digital da empresa
              enquanto desenvolvo soluções que automatizam atendimento e aumentam conversão —
              unindo estratégia comercial com arquitetura técnica escalável.
            </p>
          </div>
          <div className="about-info">
            {[
              { label: "Localização", value: "Fortaleza, CE — Brasil" },
              { label: "Formação", value: "Ciência da Computação · Estácio (2026)" },
              { label: "Cargo atual", value: "Product Growth Manager · Finanbank" },
              { label: "Foco", value: "Automação · IA Generativa · APIs" },
              { label: "Idiomas", value: "Português · Inglês (intermediário) · Espanhol (intermediário)" },
            ].map(item => (
              <div key={item.label} className="info-item">
                <div className="info-label">{item.label}</div>
                <div className="info-value">{item.value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <hr className="divider" />

      {/* SERVICES */}
      <section id="servicos" style={{ padding: "100px 32px", maxWidth: 1200, margin: "0 auto" }}>
        <div className="section-label">Serviços</div>
        <h2 className="section-title">O que posso<br />construir para você</h2>
        <p className="section-sub">
          Soluções de automação e IA sob medida para empresas que querem escalar operações
          sem aumentar proporcionalmente o time.
        </p>

        <div className="services-grid">
          {services.map((s) => (
            <div key={s.title} className="service-card">
              {s.badge && <div className="service-badge">{s.badge}</div>}
              <span className="service-icon">{s.icon}</span>
              <div className="service-title">{s.title}</div>
              <div className="service-subtitle">{s.subtitle}</div>
              <p className="service-desc">{s.desc}</p>
              <ul className="service-features">
                {s.features.map(f => <li key={f}>{f}</li>)}
              </ul>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{
          marginTop: 2,
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderTop: "none",
          padding: "40px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 24
        }}>
          <div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 20, fontWeight: 700, marginBottom: 6 }}>
              Precisa de uma solução personalizada?
            </div>
            <div style={{ fontSize: 14, color: "var(--muted)", fontWeight: 300 }}>
              Cada projeto tem suas particularidades. Vamos conversar sobre o seu.
            </div>
          </div>
          <button className="btn-primary" onClick={() => scrollTo("contato")}>
            Solicitar orçamento
          </button>
        </div>
      </section>

      <hr className="divider" />

      {/* PROJECTS */}
      <section id="projetos" style={{ padding: "100px 32px", maxWidth: 1200, margin: "0 auto" }}>
        <div className="section-label">Projetos</div>
        <h2 className="section-title">Soluções que<br />já estão em produção</h2>
        <p className="section-sub">
          Projetos reais com impacto mensurável — construídos para resolver problemas
          de negócio complexos com tecnologia.
        </p>

        <div className="projects-list">
          {projects.map((p) => (
            <div key={p.title} className="project-card" style={{ "--accent-color": p.accent }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
                  <h3 className="project-title">{p.title}</h3>
                  <div style={{
                    width: 8, height: 8, borderRadius: "50%",
                    background: p.accent,
                    boxShadow: `0 0 8px ${p.accent}`
                  }} />
                </div>
                <div className="project-sub">{p.subtitle}</div>
                <p className="project-desc">{p.desc}</p>
                <div className="project-tags">
                  {p.tags.map(t => <span key={t} className="tag">{t}</span>)}
                </div>
              </div>
              {p.impact && (
              <div className="project-impact">
                <div style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 9,
                  color: "var(--green)",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  marginBottom: 8,
                  opacity: 0.7
                }}>Impacto</div>
                {p.impact}
              </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <hr className="divider" />

      {/* STACK */}
      <section style={{ padding: "80px 32px", maxWidth: 1200, margin: "0 auto" }}>
        <div className="section-label">Stack técnica</div>
        <h2 className="section-title" style={{ marginBottom: 40 }}>Ferramentas & tecnologias</h2>
        <div className="stack-grid">
          {stack.map(s => (
            <div key={s.name} className="stack-tag">
              {s.name}
              <span className="stack-cat">{s.cat}</span>
            </div>
          ))}
        </div>
      </section>


      {/* CERTS */}
      <section style={{ padding: "80px 32px", maxWidth: 1200, margin: "0 auto" }}>
        <div className="section-label">Formação complementar</div>
        <h2 className="section-title" style={{ marginBottom: 48 }}>Certificações</h2>
        <div className="certs-grid">
          {certs.map(c => (
            <div key={c.name} className="cert-card">
              <div className="cert-year">{c.year}</div>
              <div className="cert-name">{c.name}</div>
              <div className="cert-org">{c.org}</div>
            </div>
          ))}
        </div>
      </section>

      <hr className="divider" />

      {/* CONTACT */}
      <section id="contato" style={{ padding: "100px 32px", maxWidth: 1200, margin: "0 auto" }}>
        <div className="section-label">Contato</div>
        <h2 className="section-title">Vamos construir<br /><span style={{ color: "var(--cyan)" }}>algo juntos?</span></h2>
        <p className="section-sub">
          Seja para um projeto pontual ou uma parceria contínua,
          estou disponível para conversar sobre sua necessidade.
        </p>

        <div className="contact-grid">
          {[
            { label: "E-mail", value: "cassianokhalil@gmail.com", href: "mailto:cassianokhalil@gmail.com" },
            { label: "WhatsApp", value: "(85) 99787-0363", href: "https://wa.me/5585997870363" },
            { label: "LinkedIn", value: "khalil-samir", href: "https://www.linkedin.com/in/khalil-samir-6b34b9230" },
            { label: "Localização", value: "Fortaleza, CE — Brasil", href: null },
          ].map(c => (
            <div key={c.label} className="contact-item">
              <div className="contact-label">{c.label}</div>
              {c.href
                ? <a href={c.href} className="contact-value" target="_blank" rel="noreferrer">{c.value}</a>
                : <div className="contact-value">{c.value}</div>
              }
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer" style={{ maxWidth: 1200, margin: "0 auto" }}>
        <span className="footer-text">© 2025 Khalil Cassiano · Fortaleza, CE</span>
        <span className="footer-text" style={{ color: "var(--cyan)", opacity: 0.6 }}>
          Automação · IA · APIs
        </span>
      </footer>
    </>
  );
}
