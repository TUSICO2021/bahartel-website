import React from 'react';
import './cloud-network.css';

// An illustrative cloud of names and services, not a corporate ownership tree.
const cloudNodes = [
  { id: 'mci', name: 'همراه اول', x: 44, y: 48 },
  { id: 'my-mci', name: 'همراه من', x: 24, y: 18 },
  { id: 'jiring', name: 'جیرینگ', x: 47, y: 14 },
  { id: 'bahartel', name: 'بهار ارتباط گستر', x: 72, y: 56 },
  { id: 'arman', name: 'آرمان سرمایه', x: 74, y: 14 },
  { id: 'owano', name: 'اوانو', x: 10, y: 45 },
  { id: 'anarestan', name: 'انارستان', x: 27, y: 74 },
  { id: 'mobin-one', name: 'مبین‌وان', x: 9, y: 87 },
  { id: 'setareh', name: 'ستاره اول', x: 49, y: 87 },
  { id: 'harekat', name: 'حرکت اول', x: 88, y: 87 },
  { id: 'academy', name: 'همراه آکادمی', x: 92, y: 32 },
];

const desktopPaths = [
  'M440 240C545 162 626 238 720 280',
  'M440 240C432 140 474 106 470 70',
  'M440 240C348 235 316 121 240 90',
  'M440 240C314 300 239 188 100 225',
  'M440 240C417 319 358 392 270 370',
  'M270 370C194 355 164 465 90 435',
  'M440 240C566 311 432 395 490 435',
  'M720 280C757 359 816 417 880 435',
  'M720 280C831 241 847 174 920 160',
  'M720 280C809 218 707 139 740 70',
  'M240 90C318 13 387 114 470 70',
  'M100 225C59 325 220 311 270 370',
  'M920 160C907 68 812 29 740 70',
  'M490 435C560 472 644 322 720 280',
  'M90 435C208 497 366 462 490 435',
];
const mobilePaths = [
  'M180 55C144 105 243 124 272 176',
  'M180 55C219 104 118 128 88 176',
  'M272 176C311 247 250 280 180 313',
  'M88 176C42 244 111 282 180 313',
  'M180 313C123 374 227 395 272 450',
  'M180 313C229 372 123 404 88 450',
  'M272 450C322 486 229 518 272 562',
  'M88 450C38 489 118 514 88 562',
  'M272 562C230 617 328 627 272 674',
  'M88 562C149 620 33 631 88 674',
  'M272 674C233 733 136 724 180 786',
  'M88 674C111 735 204 729 180 786',
  'M88 450C162 499 210 518 272 562',
];

function ConnectionArt({ mobile = false }) {
  const paths = mobile ? mobilePaths : desktopPaths;
  const prefix = mobile ? 'mobile' : 'desktop';
  return <svg className={`cloud-connections cloud-connections-${prefix}`} viewBox={mobile ? '0 0 360 832' : '0 0 1000 500'} preserveAspectRatio="none" aria-hidden="true">
    <defs>
      <linearGradient id={`cloud-connection-${prefix}`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#67bda0" stopOpacity=".12"/><stop offset=".5" stopColor="#35ab7a" stopOpacity=".42"/><stop offset="1" stopColor="#bed85a" stopOpacity=".35"/></linearGradient>
      <linearGradient id={`cloud-energy-${prefix}`} x1="0" y1="0" x2="1" y2="0"><stop stopColor="#7dc67d" stopOpacity="0"/><stop offset=".52" stopColor="#badb37" stopOpacity=".95"/><stop offset="1" stopColor="#26af7d" stopOpacity="0"/></linearGradient>
    </defs>
    <g className="cloud-connection-base" fill="none" stroke={`url(#cloud-connection-${prefix})`} strokeWidth="1.25">
      {paths.map((d) => <path d={d} key={d}/>)}
    </g>
    <g className="cloud-connection-energy" fill="none" stroke={`url(#cloud-energy-${prefix})`} strokeWidth="2.2" strokeLinecap="round" strokeDasharray="14 145">
      {paths.filter((_, i) => i % 3 === 0).map((d, i) => <path d={d} key={d} style={{ animationDelay: `${-i * 1.6}s` }}/>) }
    </g>
  </svg>;
}

function NameCloud({ node, order }) {
  const featured = node.id === 'bahartel';
  return <li className={`cloud-node cloud-node-${node.id} ${featured ? 'cloud-node-featured' : ''}`} style={{ '--cloud-x': `${node.x}%`, '--cloud-y': `${node.y}%`, '--cloud-delay': `${order * 65}ms` }}>
    <div className="cloud-node-surface">
      <span className="cloud-node-haze" aria-hidden="true"/>
      <svg className="cloud-node-shape" viewBox="0 0 240 120" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id={`cloud-fill-${node.id}`} x1="0" y1="0" x2="1" y2="1">
            <stop stopColor={featured ? '#0e975f' : node.id === 'mci' ? '#fff' : '#ffffff'}/>
            <stop offset="1" stopColor={featured ? '#065b41' : node.id === 'mci' ? '#e8f6f3' : '#f0f7ec'}/>
          </linearGradient>
          <linearGradient id={`cloud-edge-${node.id}`} x1="0" y1="0" x2="1" y2="1"><stop stopColor={featured ? '#e1ed69' : '#d6e8d8'}/><stop offset="1" stopColor={featured ? '#6ec185' : '#bed9cd'}/></linearGradient>
        </defs>
        <path d="M51 111C23 112 9 98 9 79C9 63 18 50 35 47C34 23 55 9 78 14C91 1 119 0 135 16C160 1 191 19 191 44C213 43 231 57 231 77C231 98 215 111 194 111Z" fill={`url(#cloud-fill-${node.id})`} stroke={`url(#cloud-edge-${node.id})`} strokeWidth={featured ? '2.1' : '1.2'}/>
      </svg>
      <div className="cloud-node-content">
        {node.id === 'mci' && <span className="cloud-mci-logo"><img src="/assets/clients/mci.svg" alt=""/></span>}
        {featured && <span className="cloud-bahar-logo"><img src="/assets/image39.png" alt=""/></span>}
        <div className="cloud-node-copy"><h2>{node.name}</h2>{featured && <span dir="ltr">BAHAR ERTEBAT GOSTAR</span>}</div>
      </div>
    </div>
  </li>;
}

export default function CloudNetworkPage({ index = 10 }) {
  return <article className="paper cloud-network-paper">
    <div className="cloud-network-ambient" aria-hidden="true"><i/><i/><i/></div>
    <div className="cloud-network-layout">
      <div className="cloud-network-meta"><span>ارتباطات و خدمات</span><i aria-hidden="true"/><span>{new Intl.NumberFormat('fa-IR', { minimumIntegerDigits: 2, useGrouping: false }).format(index + 1)}</span></div>
      <header className="cloud-network-heading"><span className="cloud-network-eyebrow" dir="ltr">CONNECTED POSSIBILITIES</span><h1>ابر ارتباطی <em>همراه اول</em></h1><p>نام‌ها، خدمات و مسیرهای همکاری؛ در یک فضای متصل.</p></header>
      <section className="cloud-network-canvas" aria-label="ابر نام‌ها و سرویس‌های مرتبط با همراه اول">
        <ConnectionArt/>
        <ConnectionArt mobile/>
        <ul className="cloud-network-nodes">{cloudNodes.map((node, order) => <NameCloud node={node} order={order} key={node.id}/>)}</ul>
      </section>
    </div>
  </article>;
}
