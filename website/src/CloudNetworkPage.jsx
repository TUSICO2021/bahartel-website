import React from 'react';
import './cloud-network.css';

// An illustrative cloud of names and services, not a corporate ownership tree.
const cloudNodes = [
  { id: 'mci', name: 'همراه اول', x: 50, y: 49 },
  { id: 'my-mci', name: 'همراه من', x: 12, y: 12 },
  { id: 'jiring', name: 'جیرینگ', x: 37, y: 8 },
  { id: 'arman', name: 'آرمان سرمایه', x: 63, y: 8 },
  { id: 'academy', name: 'همراه آکادمی', x: 87, y: 12 },
  { id: 'owano', name: 'اوانو', x: 12, y: 36 },
  { id: 'behsa', name: 'بهسا', x: 34, y: 29 },
  { id: 'ebcom', name: 'ایبکام', x: 66, y: 29 },
  { id: 'noor-dena', name: 'توسعه نور دنا', x: 88, y: 36 },
  { id: 'mobinnet', name: 'مبین‌نت', x: 12, y: 62 },
  { id: 'bahartel', name: 'بهار ارتباط گستر', x: 81, y: 61 },
  { id: 'anarestan', name: 'انارستان', x: 35, y: 73 },
  { id: 'harekat', name: 'حرکت اول', x: 63, y: 76 },
  { id: 'mobin-one', name: 'مبین‌وان', x: 12, y: 92 },
  { id: 'setareh', name: 'ستاره اول', x: 37, y: 95 },
  { id: 'naqsh', name: 'نقش اول کیفیت', x: 63, y: 96 },
  { id: 'refah', name: 'رفاه اول', x: 88, y: 92 },
];

function NameCloud({ node, order }) {
  const featured = node.id === 'bahartel';
  return <li className={`cloud-node cloud-node-${node.id} ${featured ? 'cloud-node-featured' : ''}`} style={{ '--cloud-x': `${node.x}%`, '--cloud-y': `${node.y}%`, '--cloud-delay': `${order === 0 ? 0 : 200 + order * 140}ms` }}>
    <div className="cloud-node-surface">
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
    <div className="cloud-network-ambient" aria-hidden="true"/>
    <div className="cloud-network-layout">
      <div className="cloud-network-meta"><span>مجموعه‌ها و خدمات</span><i aria-hidden="true"/><span>{new Intl.NumberFormat('fa-IR', { minimumIntegerDigits: 2, useGrouping: false }).format(index + 1)}</span></div>
      <header className="cloud-network-heading"><span className="cloud-network-eyebrow" dir="ltr">MCI ECOSYSTEM</span><h1>اکوسیستم <em>همراه اول</em></h1></header>
      <section className="cloud-network-canvas" aria-label="نمای پراکنده نام‌ها و سرویس‌ها پیرامون همراه اول">
        <ul className="cloud-network-nodes">{cloudNodes.map((node, order) => <NameCloud node={node} order={order} key={node.id}/>)}</ul>
      </section>
    </div>
  </article>;
}
