import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import { Search, X } from 'lucide-react';
import { clients } from './data/clients.js';
import './clients-page.css';

const faNumber = (value) => new Intl.NumberFormat('fa-IR', { useGrouping: false }).format(value);
const normalizeSearch = (value = '') => String(value)
  .normalize('NFKC')
  .toLocaleLowerCase('fa-IR')
  .replace(/[يى]/g, 'ی')
  .replace(/ك/g, 'ک')
  .replace(/[\u064b-\u065f\u0670]/g, '')
  .replace(/[\u200c-\u200f]/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();

function ClientCard({ client }) {
  const [logoFailed, setLogoFailed] = useState(false);
  const hasLogo = Boolean(client.logo) && !logoFailed;
  const shortName = client.displayName || client.name;
  const showFullName = hasLogo || shortName !== client.name;

  return <li className={`clients-card ${hasLogo ? 'clients-card-has-logo' : 'clients-card-type'}`}>
    <div className="clients-card-identity">
      {hasLogo
        ? <img src={client.logo} alt="" loading="lazy" decoding="async" onError={() => setLogoFailed(true)} />
        : <h2 className="clients-card-name">{shortName}</h2>}
    </div>
    {showFullName && <p className="clients-card-full-name">{client.name}</p>}
    <span className="clients-card-rule" aria-hidden="true" />
  </li>;
}

export default function ClientsPage({ index }) {
  const [query, setQuery] = useState('');
  const searchId = useId();
  const galleryRef = useRef(null);
  const visibleClients = useMemo(() => {
    const terms = normalizeSearch(query).split(' ').filter(Boolean);
    return terms.length ? clients.filter((client) => {
      const name = normalizeSearch(`${client.name} ${client.displayName || ''}`);
      return terms.every((term) => name.includes(term));
    }) : clients;
  }, [query]);

  useEffect(() => {
    if (galleryRef.current) galleryRef.current.scrollTop = 0;
  }, [query]);

  const stopGalleryKeys = (event) => {
    if (['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', ' '].includes(event.key)) event.stopPropagation();
  };

  return <article className="paper clients-paper">
    <svg className="clients-background-art" viewBox="0 0 1000 680" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <radialGradient id="clients-light"><stop stopColor="#d8eb73" stopOpacity=".28" /><stop offset="1" stopColor="#d8eb73" stopOpacity="0" /></radialGradient>
        <linearGradient id="clients-thread" x1="0" y1="1" x2="1" y2="0"><stop stopColor="#00a651" stopOpacity="0"/><stop offset=".6" stopColor="#00a651" stopOpacity=".26"/><stop offset="1" stopColor="#c9de49" stopOpacity=".45"/></linearGradient>
      </defs>
      <circle cx="880" cy="30" r="340" fill="url(#clients-light)" />
      <g fill="none" stroke="url(#clients-thread)" strokeWidth="1">
        <circle cx="895" cy="-25" r="260"/><circle cx="895" cy="-25" r="330" strokeDasharray="2 10"/>
        <path d="M680 0v70l-50 50H520M1000 180H845l-35-35H710"/>
      </g>
      <g fill="#c5dd4d" opacity=".45"><circle cx="520" cy="120" r="3"/><circle cx="710" cy="145" r="3"/><circle cx="845" cy="180" r="3"/></g>
    </svg>

    <div className="clients-page-layout">
      <div className="clients-page-meta"><span>شبکهٔ اعتماد بهارتل</span><i aria-hidden="true"/><span className="clients-page-folio">{new Intl.NumberFormat('fa-IR', { minimumIntegerDigits: 2, useGrouping: false }).format(index + 1)}</span></div>

      <header className="clients-heading">
        <div className="clients-heading-copy">
          <span className="clients-eyebrow" dir="ltr">TRUSTED CONNECTIONS</span>
          <h1>کسانی که به بهارتل <em>اعتماد کردند</em></h1>
          <p>همراه سازمان‌ها و کسب‌وکارها، در مسیر تأمین و توسعهٔ زیرساخت.</p>
        </div>
        <div className="clients-heading-count" aria-label={`${faNumber(clients.length)} مجموعه`}>
          <strong>{faNumber(clients.length)}</strong><span>مجموعه</span>
        </div>
      </header>

      <div className="clients-toolbar">
        <div className="clients-search-box">
          <label className="clients-visually-hidden" htmlFor={searchId}>جست‌وجوی نام شرکت</label>
          <Search size={18} strokeWidth={1.6} aria-hidden="true"/>
          <input id={searchId} type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="نام شرکت را جست‌وجو کنید…" autoComplete="off" spellCheck={false}/>
          {query && <button type="button" className="clients-clear-search" onClick={() => setQuery('')} aria-label="پاک‌کردن جست‌وجو"><X size={16} aria-hidden="true"/></button>}
        </div>
        <p className="clients-search-count" role="status" aria-live="polite"><b>{faNumber(visibleClients.length)}</b> مجموعه{query && <span> از {faNumber(clients.length)}</span>}</p>
      </div>

      <section className="clients-gallery-scroll" ref={galleryRef} tabIndex={0} aria-label="فهرست مشتریان بهارتل" onWheel={(event) => event.stopPropagation()} onKeyDown={stopGalleryKeys}>
        {visibleClients.length
          ? <ul className="clients-grid">{visibleClients.map((client) => <ClientCard client={client} key={client.id}/>)}</ul>
          : <div className="clients-empty-state"><Search size={31} strokeWidth={1.2} aria-hidden="true"/><h2>نتیجه‌ای پیدا نشد</h2><p>بخشی از نام شرکت یا املای دیگری را جست‌وجو کنید.</p><button type="button" onClick={() => setQuery('')}>نمایش همهٔ مجموعه‌ها</button></div>}
      </section>
    </div>
  </article>;
}
