import React from 'react';

export function PortfolioOrbits({ activeId }) {
  const sectors = [
    ['compute', 'M300 300 123 123A250 250 0 0 1 477 123Z'],
    ['storage', 'M300 300 477 123A250 250 0 0 1 477 477Z'],
    ['network', 'M300 300 477 477A250 250 0 0 1 123 477Z'],
    ['ai', 'M300 300 123 477A250 250 0 0 1 123 123Z'],
  ];
  return <svg className="portfolio-orbit-art" viewBox="0 0 600 600" aria-hidden="true">
    <defs>
      <radialGradient id="portfolio-halo"><stop stopColor="#ecf8c8" stopOpacity=".15"/><stop offset=".7" stopColor="#00a651" stopOpacity=".1"/><stop offset="1" stopColor="#00a651" stopOpacity="0"/></radialGradient>
      <linearGradient id="portfolio-sector-light" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#00a651" stopOpacity=".08"/><stop offset="1" stopColor="#cbe33c" stopOpacity=".35"/></linearGradient>
      <linearGradient id="portfolio-rim" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#d2e735"/><stop offset=".5" stopColor="#02b66b"/><stop offset="1" stopColor="#087448"/></linearGradient>
      <pattern id="portfolio-microgrid" width="18" height="18" patternUnits="userSpaceOnUse"><path d="M18 0H0V18" fill="none" stroke="#008b58" strokeOpacity=".045" strokeWidth="1"/></pattern>
    </defs>
    <circle cx="300" cy="300" r="298" fill="url(#portfolio-halo)"/>
    <circle cx="300" cy="300" r="250" fill="url(#portfolio-microgrid)"/>
    {sectors.map(([id, d]) => <path key={id} d={d} className={`portfolio-sector ${activeId === id ? 'is-active' : ''}`} fill="url(#portfolio-sector-light)"/>)}
    <g fill="none">
      <circle cx="300" cy="300" r="284" stroke="url(#portfolio-rim)" strokeWidth="1.4" opacity=".6"/>
      <circle cx="300" cy="300" r="267" stroke="#008a52" strokeWidth="1" opacity=".18"/>
      <circle cx="300" cy="300" r="250" stroke="#0c9c62" strokeWidth="1.5" opacity=".24"/>
      <circle cx="300" cy="300" r="221" stroke="#7fb77a" strokeWidth="1" strokeDasharray="1 10" opacity=".3"/>
      <path d="M123 123 477 477M477 123 123 477" stroke="#f6ffe7" strokeWidth="1.8" opacity=".7"/>
      <path d="M300 34V566M34 300H566" stroke="#179465" strokeWidth=".6" strokeDasharray="2 8" opacity=".13"/>
    </g>
    <g className="portfolio-energy portfolio-energy-a" fill="none">
      <circle cx="300" cy="300" r="274" stroke="url(#portfolio-rim)" strokeWidth="4" strokeDasharray="3 24" strokeLinecap="round" opacity=".8"/>
      <circle cx="300" cy="26" r="5" fill="#d4e740" stroke="#faffed" strokeWidth="4"/>
    </g>
    <g className="portfolio-energy portfolio-energy-b" fill="none">
      <path d="M300 16A284 284 0 0 1 584 300" stroke="#d5e944" strokeWidth="3" strokeLinecap="round" opacity=".6"/>
      <circle cx="584" cy="300" r="4" fill="#00b36c"/>
    </g>
    <circle className="portfolio-orbit-pulse" cx="300" cy="26" r="12" fill="none" stroke="#c9e537" strokeWidth="1.5"/>
  </svg>;
}

export function PortfolioCore({ icon: Icon }) {
  return <div className="portfolio-digital-core" aria-hidden="true">
    <svg viewBox="0 0 240 240">
      <defs>
        <radialGradient id="portfolio-core-halo"><stop stopColor="#c9ea4d" stopOpacity=".6"/><stop offset=".4" stopColor="#17ba7c" stopOpacity=".2"/><stop offset="1" stopColor="#17ba7c" stopOpacity="0"/></radialGradient>
        <linearGradient id="portfolio-core-top" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#c8ea8b"/><stop offset=".5" stopColor="#82c795"/><stop offset="1" stopColor="#289c76"/></linearGradient>
        <linearGradient id="portfolio-core-left" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#147d60"/><stop offset="1" stopColor="#043e35"/></linearGradient>
        <linearGradient id="portfolio-core-right" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#1b9a73"/><stop offset="1" stopColor="#07523e"/></linearGradient>
      </defs>
      <circle cx="120" cy="123" r="118" fill="url(#portfolio-core-halo)"/>
      <ellipse cx="120" cy="210" rx="74" ry="13" fill="#0a7d55" opacity=".08"/>
      <g fill="none" stroke="#48ad7e" strokeWidth="1.2" opacity=".5">
        <path d="M17 88h24l17 18M223 88h-24l-17 18M13 160h24l16-17M227 160h-24l-16-17M120 12v25M120 215v17"/>
        <circle cx="17" cy="88" r="4" fill="#d3e94c"/><circle cx="223" cy="88" r="4" fill="#d3e94c"/>
        <circle cx="13" cy="160" r="3" fill="#66c897"/><circle cx="227" cy="160" r="3" fill="#66c897"/>
      </g>
      {[145, 111, 77].map((y, i) => <g key={y} strokeLinejoin="round">
        <path d={`M55 ${y} 120 ${y-35} 185 ${y} 120 ${y+35}Z`} fill="url(#portfolio-core-top)" stroke="#a4df9c" strokeWidth="1.2"/>
        <path d={`M55 ${y} 120 ${y+35}V${y+62}L55 ${y+27}Z`} fill="url(#portfolio-core-left)" stroke="#4cae81" strokeWidth="1"/>
        <path d={`M120 ${y+35} 185 ${y}V${y+27}L120 ${y+62}Z`} fill="url(#portfolio-core-right)" stroke="#71c68c" strokeWidth="1"/>
        <path d={`M69 ${y+15} 100 ${y+32}M69 ${y+21} 92 ${y+34}`} fill="none" stroke="#90d8a3" strokeWidth="2" opacity=".6"/>
        <path d={`M137 ${y+38} 168 ${y+21}`} fill="none" stroke="#c8e84c" strokeWidth="2.6" strokeLinecap="round"/>
        <circle cx="174" cy={y+16} r="2.5" fill="#d8ef57"/>
        <path d={`M83 ${y-5} 119 ${y-24} 156 ${y-5} 120 ${y+14}Z`} fill="none" stroke="#ddf5b8" strokeWidth="1" opacity={.3+i*.15}/>
      </g>)}
      <path className="portfolio-core-scan" d="M55 86 120 121 185 86" fill="none" stroke="#d6ef62" strokeWidth="2" opacity=".6"/>
    </svg>
    <span className="portfolio-core-emblem"><Icon size={18} strokeWidth={1.7}/></span>
  </div>;
}
