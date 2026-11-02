import React from 'react';
import './cloud-network.css';

// An illustrative cloud of names and services, not a corporate ownership tree.
const cloudNodes = [
  { id: 'mci', name: 'همراه اول', x: 50, y: 49 },
  { id: 'my-mci', name: 'همراه من', x: 24, y: 18 },
  { id: 'jiring', name: 'جیرینگ', x: 47, y: 14 },
  { id: 'bahartel', name: 'بهار ارتباط گستر', x: 78, y: 55 },
  { id: 'arman', name: 'آرمان سرمایه', x: 74, y: 14 },
  { id: 'owano', name: 'اوانو', x: 14, y: 45 },
  { id: 'anarestan', name: 'انارستان', x: 27, y: 74 },
  { id: 'mobin-one', name: 'مبین‌وان', x: 14, y: 87 },
  { id: 'setareh', name: 'ستاره اول', x: 49, y: 87 },
  { id: 'harekat', name: 'حرکت اول', x: 84, y: 87 },
  { id: 'academy', name: 'همراه آکادمی', x: 86, y: 32 },
];

function NameCloud({ node, order }) {
  const featured = node.id === 'bahartel';
  return <li className={`cloud-node cloud-node-${node.id} ${featured ? 'cloud-node-featured' : ''}`} style={{ '--cloud-x': `${node.x}%`, '--cloud-y': `${node.y}%`, '--cloud-delay': `${order * 65}ms` }}>
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
      <header className="cloud-network-heading"><span className="cloud-network-eyebrow" dir="ltr">HAMRAH-E AVAL</span><h1><em>همراه اول</em></h1></header>
      <section className="cloud-network-canvas" aria-label="نمای پراکنده نام‌ها و سرویس‌ها پیرامون همراه اول">
        <ul className="cloud-network-nodes">{cloudNodes.map((node, order) => <NameCloud node={node} order={order} key={node.id}/>)}</ul>
      </section>
    </div>
  </article>;
}
