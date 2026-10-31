import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  ArrowDown, ArrowLeft, ArrowRight, ArrowUpLeft, ArrowUpRight, Boxes, Building2, Check,
  BatteryCharging, ChevronLeft, ChevronRight, CircleHelp, Cpu, Database, Globe2,
  Headphones, Layers3, Mail, MapPin, Maximize, Minimize, Network, PackageCheck, Phone,
  Radio, RadioTower, Server, ShieldCheck, Sparkles, X
} from 'lucide-react';
import { makeWebsiteQr } from './qr.js';
import './styles.css';
import './responsive.css';
import './color-boost.css';
import './presentation-type.css';
import './number-type.css';
import './history-readability.css';
import './keyfacts.css';
import './foundation-values.css';
import './painpoints.css';
import './principles-detail.css';
import './process-flow.css';
import './project-interaction.css';
import './portfolio-wheel.css';
import './cover-page.css';
import './story-profile.css';
import './history-redesign.css';
import './trust-reasons.css';
import './mobile-scroll.css';

const pages = [
  { id: 0, title: 'جلد', chapter: 'پروفایل شرکتی' },
  { id: 2, title: 'داستان بهار ارتباط گستر', chapter: 'از ۱۳۷۹ تا امروز' },
  { id: 3, title: 'آمار کلیدی در یک نگاه', chapter: 'شاخص‌های عملکرد' },
  { id: 4, title: 'دغدغه‌هایی که برطرف می‌کنیم', chapter: 'دغدغه‌هایی که برطرف می‌کنیم' },
  { id: 5, title: 'چهار اصل که ما را متمایز می‌کند:', chapter: 'چهار اصل که ما را متمایز می‌کند:' },
  { id: 7, title: 'مسیری که در تامین تجهیزات بهارتل با شما همراه می شود', chapter: 'از نیازسنجی تا تحویل' },
  { id: 8, title: 'پروژه‌های موفق', chapter: 'نمونه‌هایی از تأمین' },
  { id: 9, title: 'ماتریس سبد محصولات و خدمات', chapter: 'Solutions & Portfolio' },
  { id: 16, title: 'تماس', chapter: 'ارتباط با بهار' },
];

const values = [
  { number: '۰۱', title: 'تضمین اصالت', note: 'Original Equipment', icon: ShieldCheck },
  { number: '۰۲', title: 'چابکی در تأمین', icon: Radio },
  { number: '۰۳', title: 'شفافیت تجاری', icon: Layers3 },
  { number: '۰۴', title: 'مسئولیت‌پذیری در پشتیبانی', icon: Headphones },
];

const painQuestions = [
  { title: 'آیا تجهیزات تأمین‌شده واقعاً اورجینال است؟', icon: ShieldCheck },
  { title: 'و در صورت خرابی، آیا راه‌حل واقعی وجود دارد؟', icon: Headphones },
];

const principles = [
  { number: '۰۱', title: 'تضمین اصالت', desc: 'تجهیزات Original Equipment از منابع رسمی برندهای معتبر', icon: ShieldCheck },
  { number: '۰۲', title: 'چابکی در تأمین', desc: 'مدیریت کامل زنجیره تأمین از کارخانه تا انبار شما', icon: Radio },
  { number: '۰۳', title: 'شفافیت تجاری', desc: 'گزارش‌دهی روشن در هر مرحله از فرایند', icon: Layers3 },
  { number: '۰۴', title: 'مسئولیت‌پذیری در پشتیبانی', desc: 'تعهد به همراهی بعد از فروش،', icon: Headphones },
];

const keyMetrics = [
  { value: '۲۶', unit: 'سال', label: 'سابقه فعالیت مستمر', desc: 'در صنعت IT و زیرساخت دیتاسنتر (از ۱۳۷۹ تا امروز)', icon: Radio },
  { value: '۱۲', unit: 'پروژه', label: 'پروژه‌های بزرگ و ملی', desc: 'با اجرای موفق', icon: Network },
  { value: '۱۰۰', unit: 'میلیون دلار', label: 'ارزش تجهیزات تأمین‌شده', desc: 'برای مشتریان و پروژه‌ها', icon: Boxes },
  { value: '۵', unit: 'برند معتبر بین‌المللی', label: '(تامین بیش از 1173 سرور)', desc: 'همکاری با', icon: Globe2 },
  { value: '۳', unit: 'ماه', label: 'میانگین زمان تحویل کالا از خارج از کشور', desc: '(از تولید در کارخانه تا ترخیص و تحویل در انبار)', icon: PackageCheck },
];

const steps = [
  ['۱', 'مشاوره و نیازسنجی مشتریان', 'پیش از هر چیز، الزامات واقعی پروژه را می‌فهمیم — نه فقط مشخصات فنی، بلکه محدودیت‌های نرم‌افزاری، دیتابیسی و زیرساختی که سخت‌افزار باید با آن‌ها هماهنگ باشد.', Network],
  ['۲', 'تأمین دست‌اول', 'تجهیزات را مستقیم از منابع اصلی تهیه می‌کنیم. بدون واسطه‌های غیرضروری، بدون ریسک کالای دست‌دوم.', PackageCheck],
  ['۳', 'اعتبارسنجی کیفی', 'هر محصول پیش از ارسال از تست‌های اولیه اصالت و سلامت می‌گذرد. اطمینان از این‌که آنچه تحویل می‌شود، دقیقاً همان چیزی است که سفارش داده شده.', ShieldCheck],
  ['۴', 'تحویل ایمن با مستندات کامل', 'بسته‌بندی استاندارد، حمل مطمئن از مبدأ، به همراه مستندات سریال و گارانتی — تحویلی که قابل پیگیری و مستند است.', Boxes],
  ['۵', 'پشتیبانی و همراهی در توسعه', 'همکاری ما پس از تحویل پایان نمی‌گیرد. در دوره‌های ارتقا، نگهداری و گسترش زیرساخت کنار شما هستیم.', Headphones],
];

const portfolioCategories = [
  { id: 'compute', position: 'top', title: 'زیرساخت‌های پردازشی', english: 'Compute & Servers', brandHeading: 'سرور و پردازش (Compute)', body: ['سرورهای پردازشی'], icon: Server, brands: ['dell', 'hpe', 'lenovo', 'supermicro'] },
  { id: 'storage', position: 'right', title: 'ذخیره‌سازی و پشتیبان‌گیری', english: 'Storage & SAN', brandHeading: 'ذخیره‌سازی (Storage)', body: ['سامانه‌های ذخیره‌سازی همه‌منظوره.', 'انواع استوریج و تجهیزات پشتیبان‌گیری، درایوهای سازمانی (SAS, NVMe SSD).'], icon: Database, brands: ['dell', 'hpe', 'netapp', 'huawei'] },
  { id: 'network', position: 'bottom', title: 'تجهیزات شبکه', english: 'Networking & Interconnects', brandHeading: 'شبکه و سوئیچ (Networking)', body: ['سوییچ‌ها', 'Cisco و Juniper و Arista و Huawei در Gartner Magic Quadrant (۲۰۲۵).'], icon: Network, brands: ['cisco', 'juniper', 'arista', 'huawei', 'fortinet'] },
  { id: 'ai', position: 'left', title: 'زیر ساخت تجهیزات هوش مصنوعی', english: 'GPU Servers', brandHeading: 'هوش مصنوعی (GPU Servers)', body: [], icon: Cpu, brands: ['dell', 'supermicro', 'hpe', 'lenovo', 'nvidia'] },
];

const projects = [
  { id: '01', title: 'تأمین سرورهای سازمانی برای زیرساخت مرکز داده', category: 'بانک / اپراتور مخابراتی ملی', model: 'HP ProLiant G10', metric: { value: '۷۵۵', label: 'دستگاه سرور' }, amount: '— میلیون دلار', delivery: '— ماه', challenge: 'نیاز فنی خاص به کانفیگ سفارشی از کارخانه + محدودیت زمانی سخت برای راه‌اندازی زیرساخت', difference: ['تأمین مستقیم از تولیدکننده', 'اعتبارسنجی کیفی پیش از ترخیص', 'تحویل مستندشده به انبار مشتری'], en: 'DATA CENTER / SERVER', icon: Server },
  { id: '02', title: 'تأمین ۱۸۵ دستگاه سرور HP G10', category: 'سرور سازمانی', model: 'HP ProLiant G10', metric: { value: '۱۸۵', label: 'دستگاه سرور' }, en: 'ENTERPRISE SERVER', icon: Server },
  { id: '03', title: 'تأمین ۸ دستگاه سرور Supermicro ویژهٔ هوش مصنوعی', category: 'زیرساخت هوش مصنوعی', model: 'Supermicro', metric: { value: '۸', label: 'دستگاه سرور' }, en: 'AI COMPUTE', icon: Cpu },
  { id: '04', title: 'تأمین ۳۰۰ دستگاه سرور Fujitsu', category: 'سرور سازمانی', model: 'Fujitsu', metric: { value: '۳۰۰', label: 'دستگاه سرور' }, en: 'DATA CENTER', icon: Server },
  { id: '05', title: 'تأمین ۳۰ دستگاه سرور HP G10', category: 'سرور سازمانی', model: 'HP ProLiant G10', metric: { value: '۳۰', label: 'دستگاه سرور' }, en: 'ENTERPRISE SERVER', icon: Server },
  { id: '06', title: 'تجهیزات Cisco و Fortinet به ارزش ۱۸٫۵ میلیون دلار', category: 'شبکه و امنیت', model: 'Cisco & Fortinet', metric: { value: '۱۸٫۵', label: 'میلیون دلار' }, en: 'NETWORK & SECURITY', icon: Network },
  { id: '07', title: 'تأمین تجهیزات رادیویی و شبکهٔ بی‌سیم برای اپراتورهای مخابراتی', category: 'شبکهٔ مخابراتی', en: 'TELECOM NETWORK', icon: RadioTower },
  { id: '08', title: 'پروژهٔ ESS و تأمین باتری‌های لیتیومی برای مراکز داده و سایت‌های مخابراتی', category: 'ذخیره‌سازی انرژی', en: 'ENERGY STORAGE', icon: BatteryCharging },
];

const choiceReasons = [
  { id: 'authenticity', title: 'تضمین ۱۰۰٪ اصالت کالا', desc: 'بهارتل حساسیت ویژه ای بر روی تامین کالا اصلی دارد و فرایند قابل قبولی برای صحت سنجی اصالت کالا', icon: ShieldCheck },
  { id: 'supply', title: 'زنجیره تأمین بین‌المللی قوی و منعطف نسبت نیاز', desc: 'بهارتل توانایی سورسینگ سریع حتی برای کانفیگ‌های خاص و تحریم‌شده دارد.', icon: Globe2 },
  { id: 'advisory', title: 'تیم فنی مشاوره (Pre-Sales Technical Advisory)', desc: 'مشاوره در انتخاب دقیق کانفیگ سرور در نسبت با خرید و تامین تجهیزات.', icon: Cpu },
  { id: 'operator', title: 'تأمین تجهیزات برای بزرگ‌ترین اپراتور کشور', desc: 'تأمین تجهیزات برای اپراتورها، که نسبت به کیفیت و اصالت تجهیزات حساسیت بالایی دارند، نقطه قوت و مایه اعتماد است.', icon: RadioTower },
];

const brands = ['HP', 'Supermicro', 'Fujitsu', 'Cisco', 'Fortinet'];
const portfolioBrands = [
  { id: 'dell', name: 'Dell', src: '/assets/brand-logos/dell.svg' },
  { id: 'hpe', name: 'HPE', src: '/assets/brand-logos/hpe.svg' },
  { id: 'lenovo', name: 'Lenovo', wordmark: 'Lenovo' },
  { id: 'supermicro', name: 'Supermicro', src: '/assets/brand-logos/supermicro.svg' },
  { id: 'netapp', name: 'NetApp', wordmark: 'netapp' },
  { id: 'huawei', name: 'Huawei', wordmark: 'HUAWEI' },
  { id: 'cisco', name: 'Cisco', src: '/assets/brand-logos/cisco.svg' },
  { id: 'juniper', name: 'Juniper (HPE)', wordmark: 'Juniper' },
  { id: 'arista', name: 'Arista', src: '/assets/brand-logos/arista.svg' },
  { id: 'fortinet', name: 'Fortinet', src: '/assets/brand-logos/fortinet.svg' },
  { id: 'nvidia', name: 'NVIDIA', wordmark: 'NVIDIA' },
];
const pageNumber = (value) => new Intl.NumberFormat('fa-IR', { minimumIntegerDigits: 2, useGrouping: false }).format(value);
const persianInteger = (value) => new Intl.NumberFormat('fa-IR', { useGrouping: false }).format(value);

function CountUpNumber({ value, duration = 1850 }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      setCount(value);
      return undefined;
    }
    let startedAt = null;
    let frameId;
    const step = (timestamp) => {
      if (startedAt === null) startedAt = timestamp;
      const progress = Math.min((timestamp - startedAt) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(value * eased));
      if (progress < 1) frameId = requestAnimationFrame(step);
    };
    frameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameId);
  }, [value, duration]);
  return <span className="story-count" aria-label={persianInteger(value)}>{persianInteger(count)}</span>;
}

const historyMilestones = [
  { year: '۱۳۷۹', x: 6, row: 0, events: ['اخذ مجوز VOIP'] },
  { year: '۱۳۸۳', x: 23, row: 0, events: ['سالارتل', 'قرارداد تأمین تجهیزات زیرساخت شبکه', 'طراحی و اجرای پلتفرم مدیریت ارسال پیامک انبوه', 'قرارداد تأمین تجهیزات ۷۵۵ سرور', 'عمده‌فروشی شارژ و بسته و پیامک همراه اول', 'PLUS APP · MYNA APP · SUNBIRD APP'] },
  { year: '۱۳۹۲', x: 40, row: 0, events: ['سرویس ۵۰', 'همکاری با اپراتور همراه اول'] },
  { year: '۱۳۹۳', x: 57, row: 0, events: ['تجاری‌سازی ساینا'] },
  { year: '۱۳۹۴', x: 74, row: 0, events: ['ارائه اپلیکیشن سیم‌سوت', 'تجاری‌سازی سرویس USSD 555', 'پروانه رسانه‌ای در خط کاربرمحور', 'پروانه نشر دیجیتال برخط'] },
  { year: '۱۳۹۵', x: 91, row: 0, events: ['آغاز فروش پیامک انبوه با همکاری اپراتور همراه اول', 'راه‌اندازی USSD 500'] },
  { year: '۱۳۹۶', x: 91, row: 1, events: ['خرید ۳۰ سهم تالیا', 'همکاری با اپراتور رایتل', 'اخذ مجوز SERVCO'] },
  { year: '۱۳۹۷', x: 75, row: 1, events: ['تأسیس شرکت پارس‌نام'] },
  { year: '۱۳۹۸', x: 56, row: 1, events: ['فروش شارژ و بسته در پیام‌رسان بله', 'فروش انحصاری هاتل و تالیا', 'انحصار در عمده‌فروشی شارژ و بسته و پیامک همراه', 'همکاری با اپراتور شاتل موبایل'] },
  { year: '۱۳۹۹', x: 37, row: 1, events: ['تأمین تجهیزات ۱۰۰ سرور همراه اول', 'تغییر برند اپلیکیشن سیم‌سوت به «ستاره پونصد»'] },
  { year: '۱۴۰۰', x: 17, row: 1, events: ['در تصویر ارسالی، رویدادی برای این سال درج نشده است.'] },
  { year: '۱۴۰۱', x: 17, row: 2, events: ['تأسیس شرکت ای‌بسته', 'خرید ۷٪ سهام شرکت تالیا', 'خرید ۶۶٪ سهام شرکت داریاسامان', 'راه‌اندازی و تجدید ابزار بازرگانی', 'تحویل بخشی از سرورها و تجهیزات شبکه به همراه اول'] },
  { year: '۱۴۰۲', x: 41, row: 2, events: ['پایان فروش پیامک انبوه', 'توسعه بازرگانی خارجی', 'اصلاح ساختار سازمانی شرکت', 'تحویل بخشی دیگر از سرورها و تجهیزات شبکه'] },
  { year: '۱۴۰۳', x: 65, row: 2, events: ['توسعه مشارکت در پروژه‌های بزرگ بازرگانی همراه اول', 'توسعه بازاریابی و فروش تجهیزات ICT به اپراتورهای خارج از همراه اول', 'ارتقای سرویس تأمین مالی شرکت', 'توسعه فعالیت‌های زیرساختی در حوزه برنامه‌ریزی و منابع انسانی'] },
  { year: '۱۴۰۴', x: 88, row: 2, events: ['توسعه راهکارهای هوشمندسازی و تکمیل پروژه‌های کلان'] },
  { year: '۱۴۰۵', x: 96, row: 2, events: ['حرکت در مسیر توسعه بهار'] },
];

function Logo({ light = false }) {
  return <div className={`catalog-logo ${light ? 'logo-light' : ''}`}>
    <img src="/assets/image39.png" alt="نشان بهار ارتباط گستر" />
    <span><b>بهار ارتباط گستر</b><small>BAHAR ERTEBAT GOSTAR</small></span>
  </div>;
}

function WebsiteQr({ value }) {
  const matrix = makeWebsiteQr(value);
  return <svg className="website-qr" viewBox="-4 -4 33 33" role="img" aria-label="کد QR اسکن‌پذیر برای وب‌سایت بهارتل" shapeRendering="crispEdges">
    <rect x="-4" y="-4" width="33" height="33" fill="#fff" />
    {matrix.flatMap((row, y) => row.map((dark, x) => dark ? <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill="#092f2b" /> : null))}
  </svg>;
}

function PageMeta({ index, label }) {
  return <div className="page-meta"><span>{label}</span><span className="meta-rule" /><span className="folio">{pageNumber(index + 1)}</span></div>;
}

function FoundationValueCard({ value }) {
  const Icon = value.icon;
  return <article className="foundation-value-card">
    <div className="foundation-value-icon"><Icon size={23} strokeWidth={1.65} /></div>
    <div className="foundation-value-copy"><span>{value.number}</span><h2>{value.title}</h2>{value.note && <small dir="ltr">{value.note}</small>}</div>
    <i className="foundation-value-glint" />
  </article>;
}

function FoundationArtwork() {
  return <div className="foundation-artwork" aria-label="تصویرسازی دیجیتال زیرساخت فناوری اطلاعات">
    <svg viewBox="0 0 420 420" role="img" aria-label="رک سرور و مسیرهای شبکه با جلوهٔ دیجیتال">
      <defs>
        <linearGradient id="foundation-bg" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#062c20"/><stop offset=".55" stopColor="#064b31"/><stop offset="1" stopColor="#092a23"/></linearGradient>
        <linearGradient id="foundation-metal" x1="0" y1="0" x2="1" y2="0"><stop stopColor="#143d2b"/><stop offset=".48" stopColor="#2b6540"/><stop offset="1" stopColor="#0b2b22"/></linearGradient>
        <linearGradient id="foundation-panel" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#173f2b"/><stop offset="1" stopColor="#071b17"/></linearGradient>
        <radialGradient id="foundation-halo"><stop stopColor="#c7e832" stopOpacity=".62"/><stop offset=".36" stopColor="#00b365" stopOpacity=".25"/><stop offset="1" stopColor="#00b365" stopOpacity="0"/></radialGradient>
        <pattern id="foundation-grid" width="22" height="22" patternUnits="userSpaceOnUse"><path d="M22 0H0V22" fill="none" stroke="#b6df79" strokeOpacity=".08" strokeWidth=".7"/></pattern>
        <filter id="foundation-glow" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="6" /></filter>
      </defs>
      <rect width="420" height="420" rx="28" fill="url(#foundation-bg)" />
      <rect width="420" height="420" rx="28" fill="url(#foundation-grid)" />
      <circle cx="214" cy="205" r="174" fill="url(#foundation-halo)" />
      <circle cx="210" cy="207" r="162" fill="none" stroke="#a9d956" strokeOpacity=".2" strokeDasharray="2 8" />
      <circle cx="210" cy="207" r="139" fill="none" stroke="#8fd27e" strokeOpacity=".16" />
      <g fill="none" stroke="#9ddd4e" strokeOpacity=".58" strokeWidth="1.4">
        <path d="M32 118h54l22 22h34M388 118h-49l-23 23h-25M32 292h49l22-22h36M388 292h-50l-23-22h-24" />
        <path d="M210 27v36M210 356v36M54 205h47M319 205h47" strokeOpacity=".3" />
        <circle cx="32" cy="118" r="4" fill="#cde939"/><circle cx="388" cy="118" r="4" fill="#cde939"/>
        <circle cx="32" cy="292" r="4" fill="#cde939"/><circle cx="388" cy="292" r="4" fill="#cde939"/>
        <circle cx="210" cy="27" r="3" fill="#9dde69"/><circle cx="210" cy="392" r="3" fill="#9dde69"/>
      </g>
      <g opacity=".72" fill="#cfe94b" filter="url(#foundation-glow)"><circle cx="210" cy="90" r="18"/><circle cx="210" cy="330" r="16"/></g>
      <path d="M139 85 288 72l16 16v245l-16 12H139l-15-13V101z" fill="#051a15" stroke="#85c75b" strokeOpacity=".7" strokeWidth="2" />
      <path d="m288 72 16 16v245l-16 12z" fill="#0c3022" stroke="#8dc96b" strokeOpacity=".35" />
      <rect x="137" y="91" width="151" height="243" rx="6" fill="url(#foundation-metal)" stroke="#b7dd77" strokeOpacity=".82" />
      <path d="M148 101h129v225H148z" fill="#071c17" stroke="#4c8d54" strokeOpacity=".7" />
      <g fill="url(#foundation-panel)" stroke="#5c9e5f" strokeOpacity=".65">
        <rect x="156" y="111" width="113" height="42" rx="4"/><rect x="156" y="160" width="113" height="42" rx="4"/>
        <rect x="156" y="209" width="113" height="42" rx="4"/><rect x="156" y="258" width="113" height="55" rx="4"/>
      </g>
      <g fill="none" stroke="#8ccc61" strokeOpacity=".45" strokeWidth="1.4">
        <path d="M166 124h46m-46 8h34m-34 8h41M166 173h46m-46 8h34m-34 8h41M166 222h46m-46 8h34m-34 8h41M166 272h46m-46 8h34m-34 8h41m-41 8h32" />
      </g>
      <g fill="#c9e83b"><circle cx="253" cy="124" r="2.5"/><circle cx="261" cy="124" r="2.5"/><circle cx="253" cy="173" r="2.5"/><circle cx="261" cy="173" r="2.5"/><circle cx="253" cy="222" r="2.5"/><circle cx="261" cy="222" r="2.5"/><circle cx="253" cy="272" r="2.5"/><circle cx="261" cy="272" r="2.5"/></g>
      <path d="M137 101h-8m8 225h-8m159-225h9m-9 225h9" stroke="#d9ed65" strokeWidth="2" strokeLinecap="round" />
      <path d="M114 347h191" stroke="#9dd556" strokeOpacity=".35" />
      <ellipse cx="210" cy="352" rx="109" ry="14" fill="#00aa5b" opacity=".18" />
      <path d="M88 355h38l12 12h54m52 0h45l14-12h28" fill="none" stroke="#91d24c" strokeOpacity=".65" strokeWidth="1.4" />
      <circle cx="210" cy="367" r="4" fill="#d0eb42" />
    </svg>
    <span className="foundation-art-halo" />
  </div>;
}

function PainPointsArtwork({ activeQuestion }) {
  return <div className="painpoints-artwork">
    <svg viewBox="0 0 460 460" role="img" aria-label="تصویرسازی متحرک سپر، سرور و اتصال‌های شبکه">
      <defs>
        <linearGradient id="pain-bg" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#073626"/><stop offset=".52" stopColor="#05261f"/><stop offset="1" stopColor="#061812"/></linearGradient>
        <linearGradient id="pain-shield" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#36c46b" stopOpacity=".38"/><stop offset=".5" stopColor="#0b7446" stopOpacity=".3"/><stop offset="1" stopColor="#071f19" stopOpacity=".75"/></linearGradient>
        <linearGradient id="pain-rack" x1="0" y1="0" x2="1" y2="0"><stop stopColor="#376d49"/><stop offset=".24" stopColor="#143e2b"/><stop offset=".8" stopColor="#0a2d22"/><stop offset="1" stopColor="#4b8550"/></linearGradient>
        <linearGradient id="pain-face" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#173e2a"/><stop offset="1" stopColor="#071a15"/></linearGradient>
        <radialGradient id="pain-light"><stop stopColor="#cde943" stopOpacity=".65"/><stop offset=".38" stopColor="#00a85d" stopOpacity=".23"/><stop offset="1" stopColor="#00a85d" stopOpacity="0"/></radialGradient>
        <pattern id="pain-grid" width="24" height="24" patternUnits="userSpaceOnUse"><path d="M24 0H0V24" fill="none" stroke="#b5df73" strokeOpacity=".07" strokeWidth=".8"/></pattern>
        <filter id="pain-bloom" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="7"/></filter>
      </defs>
      <rect width="460" height="460" rx="28" fill="url(#pain-bg)" />
      <rect width="460" height="460" rx="28" fill="url(#pain-grid)" />
      <circle cx="230" cy="225" r="195" fill="url(#pain-light)" />
      <ellipse className="painpoints-orbit" cx="230" cy="220" rx="174" ry="92" fill="none" stroke="#b7dd69" strokeOpacity=".32" strokeDasharray="3 9" transform="rotate(-34 230 220)" />
      <ellipse cx="230" cy="220" rx="144" ry="166" fill="none" stroke="#87d58a" strokeOpacity=".16" />
      <g fill="none" stroke="#a6db61" strokeWidth="1.5" strokeLinecap="round">
        <path className={`painpoints-trace ${activeQuestion === 0 ? 'is-lit' : ''}`} d="M60 112h77l30 30h34" />
        <path className={`painpoints-trace ${activeQuestion === 1 ? 'is-lit' : ''}`} d="M400 221h-72l-28 0h-23" />
        <path className={`painpoints-trace ${activeQuestion === 2 ? 'is-lit' : ''}`} d="M68 337h74l28-29h35" />
      </g>
      <path d="M230 77c43 25 80 31 116 38v94c0 79-43 132-116 178-73-46-116-99-116-178v-94c36-7 73-13 116-38Z" fill="url(#pain-shield)" stroke="#c8e53d" strokeOpacity=".85" strokeWidth="2.5" />
      <path d="M230 95c37 21 68 26 98 32v80c0 67-35 112-98 153-63-41-98-86-98-153v-80c30-6 61-11 98-32Z" fill="none" stroke="#72d07a" strokeOpacity=".55" strokeWidth="1.2" />
      <circle className="painpoints-core-glow" cx="230" cy="220" r="95" fill="#99df43" opacity=".18" filter="url(#pain-bloom)" />
      <path d="m179 136 51-9 51 9v173l-11 11h-80l-11-11z" fill="#061a15" stroke="#b3df74" strokeOpacity=".8" strokeWidth="2" />
      <path d="m266 133 15 3v173l-11 11h-4z" fill="#19462d" stroke="#a9d773" strokeOpacity=".48" />
      <rect x="187" y="147" width="72" height="159" rx="5" fill="url(#pain-rack)" stroke="#5a9b61" strokeOpacity=".8" />
      <g fill="url(#pain-face)" stroke="#80b66b" strokeOpacity=".65">
        <rect x="194" y="155" width="58" height="38" rx="3"/><rect x="194" y="200" width="58" height="38" rx="3"/><rect x="194" y="245" width="58" height="51" rx="3"/>
      </g>
      <g fill="none" stroke="#96d178" strokeOpacity=".55" strokeWidth="1.2">
        <path d="M201 165h28m-28 7h21m-21 7h31M201 210h28m-28 7h21m-21 7h31M201 255h28m-28 7h21m-21 7h31m-31 7h24m-24 7h18" />
      </g>
      <g fill="#d5ea43"><circle cx="244" cy="166" r="2.1"/><circle cx="244" cy="211" r="2.1"/><circle cx="244" cy="256" r="2.1"/></g>
      <path className="painpoints-scan" d="M187 201h72" stroke="#d8ed50" strokeOpacity=".8" strokeWidth="2" />
      <g className={`painpoints-node ${activeQuestion === 0 ? 'is-active' : ''}`} fill="#cfe846" stroke="#09281e" strokeWidth="5"><circle cx="60" cy="112" r="8"/></g>
      <g className={`painpoints-node ${activeQuestion === 1 ? 'is-active' : ''}`} fill="#cfe846" stroke="#09281e" strokeWidth="5"><circle cx="400" cy="221" r="8"/></g>
      <g className={`painpoints-node ${activeQuestion === 2 ? 'is-active' : ''}`} fill="#cfe846" stroke="#09281e" strokeWidth="5"><circle cx="68" cy="337" r="8"/></g>
      <g fill="#e5f39e" opacity=".8"><circle className="painpoints-particle particle-1" cx="115" cy="65" r="2.5"/><circle className="painpoints-particle particle-2" cx="355" cy="93" r="2"/><circle className="painpoints-particle particle-3" cx="355" cy="353" r="2.5"/><circle className="painpoints-particle particle-4" cx="115" cy="388" r="1.7"/></g>
      <path d="M102 371h62l15 14h102l16-14h61" fill="none" stroke="#9bd75a" strokeOpacity=".65" strokeWidth="1.5" />
      <circle cx="230" cy="385" r="4" fill="#d7ed43" />
    </svg>
  </div>;
}

function PainPointsPage({ index }) {
  const [activeQuestion, setActiveQuestion] = useState(0);
  return <article className="paper painpoints-paper">
    <PageMeta index={index} label="دغدغه‌هایی که برطرف می‌کنیم" />
    <div className="painpoints-layout">
      <header className="painpoints-heading"><h1>دغدغه‌هایی که <em>برطرف می‌کنیم</em></h1><span className="painpoints-heading-signal"><i/><i/><i/><i/><i/></span></header>
      <div className="painpoints-main">
        <section className="painpoints-copy">
          <p className="painpoints-intro">تیم‌های فنی و زیرساختی سازمان‌ها با چند چالش مشترک روبه‌رو هستند:</p>
          <div className="painpoints-questions">
            {painQuestions.map(({ title, icon: Icon }, i) => <button type="button" className={`painpoint-question ${activeQuestion === i ? 'is-active' : ''}`} key={title} onMouseEnter={() => setActiveQuestion(i)} onFocus={() => setActiveQuestion(i)} onClick={() => setActiveQuestion(i)} aria-pressed={activeQuestion === i}><span className="painpoint-question-icon"><Icon size={20} strokeWidth={1.65}/></span><b>{title}</b></button>)}
          </div>
          <footer className="painpoints-answer"><b>بهار ارتباط گستر متمرکز برا پاسخ اینچنین سوال هاست.</b><p>ما تجهیزات اورجینال را مستقیم از کانال‌های رسمی تأمین می‌کنیم، فرایند واردات را با شفافیت کامل پیش می‌بریم و پس از تحویل نیز همراه شما هستیم.</p></footer>
        </section>
        <PainPointsArtwork activeQuestion={activeQuestion} />
      </div>
    </div>
  </article>;
}

function PrinciplesArtwork({ activePrinciple }) {
  const nodes = [[83, 90], [377, 90], [77, 373], [383, 373]];
  return <div className="principles-artwork">
    <svg viewBox="0 0 460 470" role="img" aria-label="تصویرسازی دیجیتال زنجیرهٔ تأمین و زیرساخت سرور">
      <defs>
        <linearGradient id="principle-bg" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#092f22"/><stop offset=".55" stopColor="#061e18"/><stop offset="1" stopColor="#0a3d29"/></linearGradient>
        <linearGradient id="principle-cube-top" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#cfe83b"/><stop offset=".5" stopColor="#53c66e"/><stop offset="1" stopColor="#168651"/></linearGradient>
        <linearGradient id="principle-cube-left" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#238852"/><stop offset="1" stopColor="#0b3b2a"/></linearGradient>
        <linearGradient id="principle-cube-right" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#1fa65c"/><stop offset="1" stopColor="#062d21"/></linearGradient>
        <radialGradient id="principle-glow"><stop stopColor="#cfeb42" stopOpacity=".62"/><stop offset=".4" stopColor="#00a651" stopOpacity=".25"/><stop offset="1" stopColor="#00a651" stopOpacity="0"/></radialGradient>
        <pattern id="principle-grid" width="23" height="23" patternUnits="userSpaceOnUse"><path d="M23 0H0V23" fill="none" stroke="#c6e987" strokeOpacity=".07" strokeWidth=".8"/></pattern>
        <filter id="principle-blur" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="8"/></filter>
      </defs>
      <rect width="460" height="470" rx="27" fill="url(#principle-bg)" />
      <rect width="460" height="470" rx="27" fill="url(#principle-grid)" />
      <circle cx="230" cy="232" r="196" fill="url(#principle-glow)" />
      <ellipse className="principles-art-orbit" cx="230" cy="231" rx="183" ry="103" fill="none" stroke="#bddb6e" strokeOpacity=".28" strokeDasharray="3 9" transform="rotate(-28 230 231)" />
      <ellipse cx="230" cy="231" rx="146" ry="174" fill="none" stroke="#9bd58a" strokeOpacity=".17" />
      <g fill="none" stroke="#b4dc70" strokeWidth="1.4" strokeLinecap="round">
        <path className={`principles-art-route ${activePrinciple === 0 ? 'is-active' : ''}`} d="M83 90h55l31 32 35 19" />
        <path className={`principles-art-route ${activePrinciple === 1 ? 'is-active' : ''}`} d="M377 90h-55l-31 32-35 19" />
        <path className={`principles-art-route ${activePrinciple === 2 ? 'is-active' : ''}`} d="M77 373h59l37-40 36-20" />
        <path className={`principles-art-route ${activePrinciple === 3 ? 'is-active' : ''}`} d="M383 373h-59l-37-40-36-20" />
      </g>
      <ellipse cx="230" cy="357" rx="143" ry="32" fill="#00a651" opacity=".17" filter="url(#principle-blur)" />
      <path className="principles-art-cube" d="m230 101 125 73-125 74-125-74z" fill="url(#principle-cube-top)" stroke="#ddf47a" strokeOpacity=".85" strokeWidth="2" />
      <path d="M105 174 230 248v143l-125-75z" fill="url(#principle-cube-left)" stroke="#84d183" strokeOpacity=".73" strokeWidth="1.6" />
      <path d="m355 174-125 74v143l125-75z" fill="url(#principle-cube-right)" stroke="#a5e56b" strokeOpacity=".75" strokeWidth="1.6" />
      <path d="m230 101 0 147m-125-74 125 74 125-74m-125 74v143" fill="none" stroke="#d9f17c" strokeOpacity=".48" strokeWidth="1.3" />
      <path d="m185 166 45-27 45 27-45 27z" fill="#0b3825" fillOpacity=".82" stroke="#e2f477" strokeOpacity=".72" />
      <rect x="211" y="155" width="38" height="24" rx="4" fill="#08281d" stroke="#d7ed52" strokeWidth="1.4" />
      <path d="M220 163h20m-20 6h14" stroke="#9cda68" strokeWidth="1.5" strokeLinecap="round" />
      <g fill="#dcf048"><circle cx="217" cy="161" r="1.7"/><circle cx="243" cy="173" r="1.7"/></g>
      <path d="m130 218 82 49v7l-82-49zm0 23 82 49v7l-82-49zm0 23 82 49v7l-82-49z" fill="#09291f" fillOpacity=".75" stroke="#91cf76" strokeOpacity=".56" />
      <path d="m248 278 80-47v10l-80 47zm0 26 80-47v10l-80 47zm0 26 80-47v10l-80 47z" fill="#08271d" fillOpacity=".7" stroke="#9ad870" strokeOpacity=".56" />
      <g fill="#d9ee49"><circle cx="190" cy="284" r="2.5"/><circle cx="190" cy="307" r="2.5"/><circle cx="190" cy="330" r="2.5"/><circle cx="299" cy="260" r="2.5"/><circle cx="299" cy="286" r="2.5"/><circle cx="299" cy="312" r="2.5"/></g>
      <path d="M120 391h220m-187 13h154" stroke="#a0d858" strokeOpacity=".43" strokeLinecap="round" />
      {nodes.map(([cx, cy], i) => <g key={i} className={`principles-art-node ${activePrinciple === i ? 'is-active' : ''}`}><circle cx={cx} cy={cy} r="19"/><circle cx={cx} cy={cy} r="5"/></g>)}
      <g fill="#e6f39b"><circle className="principles-art-particle point-a" cx="168" cy="64" r="2.4"/><circle className="principles-art-particle point-b" cx="318" cy="74" r="1.9"/><circle className="principles-art-particle point-c" cx="115" cy="315" r="2.1"/><circle className="principles-art-particle point-d" cx="350" cy="333" r="2.2"/></g>
    </svg>
  </div>;
}

function PrinciplesDetailPage({ index }) {
  const [activePrinciple, setActivePrinciple] = useState(0);
  return <article className="paper principles-detail-paper">
    <PageMeta index={index} label="چهار اصل که ما را متمایز می‌کند:" />
    <div className="principles-detail-layout">
      <header className="principles-detail-heading"><h1>چهار اصل که ما را <em>متمایز می‌کند:</em></h1><span className="principles-detail-bars"><i/><i/><i/><i/></span></header>
      <div className="principles-detail-main">
        <section className="principles-detail-list" aria-label="چهار اصل که ما را متمایز می‌کند">
          {principles.map(({ number, title, desc, note, icon: Icon }, i) => <button type="button" key={number} className={`principle-detail-card ${activePrinciple === i ? 'is-active' : ''}`} onMouseEnter={() => setActivePrinciple(i)} onFocus={() => setActivePrinciple(i)} onClick={() => setActivePrinciple(i)} aria-pressed={activePrinciple === i}>
            <span className="principle-detail-number">{number}</span><span className="principle-detail-icon"><Icon size={22} strokeWidth={1.6}/></span><span className="principle-detail-copy"><b>{title}</b>{desc && <span>{desc}</span>}{note && <small>{note}</small>}</span>
          </button>)}
        </section>
        <PrinciplesArtwork activePrinciple={activePrinciple} />
      </div>
    </div>
  </article>;
}

function ProcessDigitalArtwork({ activeStep }) {
  const points = [[405, 218], [325, 113], [230, 78], [135, 113], [55, 218]];
  const ActiveIcon = steps[activeStep][3];
  return <div className="process-digital-artwork">
    <svg viewBox="0 0 460 420" role="img" aria-label={`تصویرسازی دیجیتال فرایند تأمین، مرحلهٔ ${pageNumber(activeStep + 1)}`}>
      <defs>
        <linearGradient id="flow-art-bg" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#092e22"/><stop offset=".55" stopColor="#061e18"/><stop offset="1" stopColor="#093e2a"/></linearGradient>
        <linearGradient id="flow-cube-top" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#d8ed51"/><stop offset=".5" stopColor="#50bf68"/><stop offset="1" stopColor="#16834d"/></linearGradient>
        <linearGradient id="flow-cube-left" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#278950"/><stop offset="1" stopColor="#0b3929"/></linearGradient>
        <linearGradient id="flow-cube-right" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#1ba35d"/><stop offset="1" stopColor="#06281d"/></linearGradient>
        <radialGradient id="flow-halo"><stop stopColor="#d5ee44" stopOpacity=".65"/><stop offset=".42" stopColor="#00a651" stopOpacity=".25"/><stop offset="1" stopColor="#00a651" stopOpacity="0"/></radialGradient>
        <pattern id="flow-grid" width="22" height="22" patternUnits="userSpaceOnUse"><path d="M22 0H0V22" fill="none" stroke="#bde27e" strokeOpacity=".07" strokeWidth=".8"/></pattern>
        <filter id="flow-blur" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="8"/></filter>
      </defs>
      <rect width="460" height="420" rx="25" fill="url(#flow-art-bg)" />
      <rect width="460" height="420" rx="25" fill="url(#flow-grid)" />
      <circle cx="230" cy="214" r="194" fill="url(#flow-halo)" />
      <ellipse className="process-art-orbit" cx="230" cy="203" rx="177" ry="91" fill="none" stroke="#c2df72" strokeOpacity=".3" strokeDasharray="3 9" transform="rotate(-29 230 203)" />
      <ellipse cx="230" cy="211" rx="141" ry="164" fill="none" stroke="#8dd181" strokeOpacity=".16" />
      <path className="process-art-path" d="M405 218 C377 174 356 139 325 113 S268 78 230 78 172 88 135 113 83 174 55 218" fill="none" stroke="#b7dd67" strokeWidth="1.7" strokeLinecap="round" />
      <ellipse cx="230" cy="345" rx="135" ry="24" fill="#00a651" opacity=".2" filter="url(#flow-blur)" />
      <path d="m230 142 104 59-104 61-104-61z" fill="url(#flow-cube-top)" stroke="#e4f486" strokeOpacity=".88" strokeWidth="2" />
      <path d="m126 201 104 61v103l-104-61z" fill="url(#flow-cube-left)" stroke="#8bce79" strokeOpacity=".72" strokeWidth="1.5" />
      <path d="m334 201-104 61v103l104-61z" fill="url(#flow-cube-right)" stroke="#a7dc70" strokeOpacity=".75" strokeWidth="1.5" />
      <path d="m230 142 0 120m-104-61 104 61 104-61m-104 61v103" fill="none" stroke="#e2f27a" strokeOpacity=".47" strokeWidth="1.3" />
      <path d="m193 196 37-22 37 22-37 22z" fill="#082b1e" stroke="#e4f47a" strokeOpacity=".86" strokeWidth="1.5" />
      <circle cx="230" cy="196" r="18" fill="#0a3623" stroke="#d4ec49" strokeWidth="1.3" />
      <path d="m142 229 69 41v7l-69-41zm0 21 69 41v7l-69-41zm0 21 69 41v7l-69-41z" fill="#092a1e" fillOpacity=".72" stroke="#8fca73" strokeOpacity=".54" />
      <path d="m249 270 66-39v9l-66 39zm0 22 66-39v9l-66 39zm0 22 66-39v9l-66 39z" fill="#08291e" fillOpacity=".7" stroke="#9bd671" strokeOpacity=".55" />
      <g fill="#d9ec48"><circle cx="198" cy="277" r="2.5"/><circle cx="198" cy="300" r="2.5"/><circle cx="198" cy="323" r="2.5"/><circle cx="293" cy="257" r="2.5"/><circle cx="293" cy="279" r="2.5"/><circle cx="293" cy="301" r="2.5"/></g>
      {points.map(([cx, cy], i) => <g key={i} className={`process-art-node ${activeStep === i ? 'is-active' : ''}`}><circle className="process-node-halo" cx={cx} cy={cy} r="18"/><circle className="process-node-ring" cx={cx} cy={cy} r="8"/><circle className="process-node-core" cx={cx} cy={cy} r="3"/></g>)}
      <g fill="#e7f3a4"><circle className="process-art-particle pulse-a" cx="104" cy="73" r="2.2"/><circle className="process-art-particle pulse-b" cx="356" cy="73" r="2"/><circle className="process-art-particle pulse-c" cx="76" cy="326" r="2.1"/><circle className="process-art-particle pulse-d" cx="385" cy="326" r="2.3"/></g>
      <path d="M137 365h186m-154 12h122" fill="none" stroke="#a5d95e" strokeOpacity=".43" strokeLinecap="round" />
    </svg>
    <span className="process-art-active-icon"><ActiveIcon size={29} strokeWidth={1.7}/></span>
    <span className="process-art-corner process-art-corner-a"/><span className="process-art-corner process-art-corner-b"/>
  </div>;
}

function ProcessFlowPage({ index }) {
  const [activeStep, setActiveStep] = useState(0);
  const step = steps[activeStep];
  const ActiveIcon = step[3];
  const moveStep = (event) => {
    if (event.key === 'ArrowLeft') { event.preventDefault(); event.stopPropagation(); setActiveStep((current) => Math.min(steps.length - 1, current + 1)); }
    if (event.key === 'ArrowRight') { event.preventDefault(); event.stopPropagation(); setActiveStep((current) => Math.max(0, current - 1)); }
    if (event.key === 'Home') { event.preventDefault(); event.stopPropagation(); setActiveStep(0); }
    if (event.key === 'End') { event.preventDefault(); event.stopPropagation(); setActiveStep(steps.length - 1); }
  };
  return <article className="paper process-flow-paper">
    <PageMeta index={index} label="مسیری که در تامین تجهیزات بهارتل با شما همراه می شود" />
    <div className="process-flow-layout" onKeyDown={moveStep}>
      <header className="process-flow-heading"><h1>مسیری که در <em>تامین تجهیزات بهارتل</em> با شما همراه می شود</h1><span className="process-flow-signal"><i/><i/><i/><i/><i/><i/></span></header>
      <nav className="process-flow-stepper" aria-label="مراحل فرایند تأمین" dir="rtl">
        <span className="process-flow-track"/><span className="process-flow-progress" style={{ width: `${activeStep * 20}%` }} />
        {steps.map(([number, title, , Icon], i) => <button type="button" key={number} className={`process-flow-step ${i === activeStep ? 'is-active' : ''} ${i < activeStep ? 'is-complete' : ''}`} onClick={() => setActiveStep(i)} aria-pressed={i === activeStep} aria-label={`مرحلهٔ ${number}: ${title}`}>
          <span className="process-flow-step-node"><Icon size={19} strokeWidth={1.7}/><b>{pageNumber(i + 1)}</b></span><span className="process-flow-step-title">{title}</span>
        </button>)}
      </nav>
      <div className="process-flow-main">
        <section className="process-flow-detail" key={activeStep} aria-live="polite">
          <div className="process-flow-detail-meta"><span>مرحلهٔ {pageNumber(activeStep + 1)} از {pageNumber(steps.length)}</span><span className="process-flow-detail-icon"><ActiveIcon size={20}/></span></div>
          <h2>{step[1]}</h2>
          <p>{step[2]}</p>
          <div className="process-flow-controls"><button type="button" onClick={() => setActiveStep((current) => Math.max(0, current - 1))} disabled={activeStep === 0}>مرحلهٔ قبل <ChevronRight size={16}/></button><span>{steps.map((_, i) => <i key={i} className={i === activeStep ? 'is-active' : i < activeStep ? 'is-complete' : ''}/>)}</span><button type="button" onClick={() => setActiveStep((current) => Math.min(steps.length - 1, current + 1))} disabled={activeStep === steps.length - 1}><ChevronLeft size={16}/> مرحلهٔ بعد</button></div>
        </section>
        <ProcessDigitalArtwork activeStep={activeStep} />
      </div>
    </div>
  </article>;
}

function ProjectShowcasePage({ index }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const project = projects[selectedIndex];
  const ProjectIcon = project.icon;
  return <article className="paper project-interaction-paper">
    <PageMeta index={index} label="پروژه‌های موفق" />
    <div className="project-interaction-layout">
      <header className="project-interaction-heading"><h1>پروژه‌های <em>موفق</em></h1></header>
      <div className="project-interaction-grid">
        <article className="project-interaction-feature" key={project.id} aria-live="polite">
          <div className="project-interaction-top"><span>پروژهٔ {project.id} از {pageNumber(projects.length)}</span><span>{project.category}</span></div>
          <div className="project-interaction-main">
            <div className="project-interaction-copy"><small>{project.client || project.category}</small><h2>{project.title}</h2>{project.model && <div className="project-interaction-model"><ProjectIcon size={19}/><b>{project.model}</b></div>}</div>
            <div className="project-interaction-visual" aria-hidden="true"><i className="project-visual-orbit project-visual-orbit-a"/><i className="project-visual-orbit project-visual-orbit-b"/><span><ProjectIcon size={37} strokeWidth={1.45}/></span>{project.metric && <div><b>{project.metric.value}</b><small>{project.metric.label}</small></div>}</div>
          </div>
          <div className="project-interaction-facts">
            {project.model && <div><small>برند و مدل</small><b>{project.model}</b></div>}
            {project.amount && <div><small>ارزش تقریبی</small><b>{project.amount}</b></div>}
            {project.delivery && <div><small>بازهٔ تحویل</small><b>{project.delivery}</b></div>}
          </div>
          {project.challenge && <section className="project-interaction-challenge"><b>چالش اصلی</b><p>{project.challenge}</p></section>}
          {project.difference && <section className="project-interaction-difference"><b>آنچه تفاوت ایجاد کرد</b><div>{project.difference.map((item) => <span key={item}>{item}</span>)}</div></section>}
        </article>
        <section className="project-interaction-roster" aria-label="پروژه‌ها">
          <div className="project-interaction-cards">{projects.map((item) => {
            const Icon = item.icon;
            return <button type="button" className={`project-interaction-card ${selectedIndex === projects.indexOf(item) ? 'is-active' : ''}`} key={item.id} onClick={() => setSelectedIndex(projects.indexOf(item))} aria-label={`نمایش پروژه: ${item.title}`} aria-pressed={selectedIndex === projects.indexOf(item)}>
              <span className="project-interaction-card-icon"><Icon size={19} strokeWidth={1.6}/><i>{item.id}</i></span>
              <span className="project-interaction-card-copy"><b>{item.title}</b></span>
              <ChevronLeft className="project-interaction-card-arrow" size={16}/>
            </button>;
          })}</div>
        </section>
      </div>
    </div>
  </article>;
}

function HistoryTimeline() {
  const [selectedYear, setSelectedYear] = useState('۱۳۷۹');
  const [hoveredYear, setHoveredYear] = useState(null);
  const activeYear = historyMilestones.find(({ year }) => year === (hoveredYear || selectedYear)) || historyMilestones.at(-1);
  const activeIndex = historyMilestones.indexOf(activeYear);
  const renderYears = (milestones, rowClass) => <div className={`history-rail-row ${rowClass}`} dir={rowClass === 'history-rail-row-second' ? 'ltr' : 'rtl'}>{milestones.map(({ year }) => <button key={year} className={`history-year ${activeYear.year === year ? 'is-active' : ''}`} onMouseEnter={() => setHoveredYear(year)} onMouseLeave={() => setHoveredYear(null)} onFocus={() => setHoveredYear(year)} onBlur={() => setHoveredYear(null)} onClick={() => setSelectedYear(year)} aria-pressed={selectedYear === year} aria-label={`سال ${year}؛ نمایش رویدادها`}><b>{year}</b></button>)}</div>;
  return <div className="history-layout">
    <header className="history-intro"><h1>داستان بهار ارتباط گستر</h1><div><b className="history-motto">پشت هر سرویس پایدار، زیرساختی حساب‌شده قرار دارد.</b></div></header>
    <section className="history-timeline" aria-label="رودمپ تعاملی تاریخچه بهار ارتباط گستر"><div className="history-rail-scroll" aria-label="سال‌های مهم فعالیت بهار"><div className="history-rail">{renderYears(historyMilestones.slice(0, 8), 'history-rail-row-first')}{renderYears(historyMilestones.slice(8), 'history-rail-row-second')}</div></div><div className="history-scroll-hint"><span>۱۳۷۹ <i /> ۱۴۰۵</span></div></section>
    <section className={`history-detail events-${Math.min(activeYear.events.length, 4)}`} aria-live="polite"><div className="history-detail-head"><small>نقطهٔ عطف {pageNumber(activeIndex + 1)} از {pageNumber(historyMilestones.length)}</small><b>{activeYear.year}</b><div className="history-progress"><i style={{ width: `${((activeIndex + 1) / historyMilestones.length) * 100}%` }} /></div><span>مسیر توسعهٔ بهار</span></div><ul>{activeYear.events.map((event, index) => <li key={`${activeYear.year}-${index}`}><span>{pageNumber(index + 1)}</span><p>{event}</p></li>)}</ul></section>
  </div>;
}

function WhyChoosePage() {
  const [activeId, setActiveId] = useState(choiceReasons[0].id);
  const activeReason = choiceReasons.find(({ id }) => id === activeId) || choiceReasons[0];
  const ActiveIcon = activeReason.icon;
  return <article className="paper trust-reasons-paper">
    <div className="trust-reasons-layout">
      <header className="trust-reasons-heading">
        <h1>چرا مشتریان بهار ارتباط گستر را انتخاب کرده اند.</h1>
      </header>
      <div className="trust-reasons-content">
        <div className="trust-artwork" aria-hidden="true">
          <svg className="trust-art-svg" viewBox="0 0 520 520" fill="none">
            <defs>
              <linearGradient id="trust-art-bg" x1="58" y1="42" x2="475" y2="486" gradientUnits="userSpaceOnUse"><stop stopColor="#164D35"/><stop offset="1" stopColor="#062B20"/></linearGradient>
              <linearGradient id="trust-art-line" x1="91" y1="113" x2="429" y2="420" gradientUnits="userSpaceOnUse"><stop stopColor="#D2E63A"/><stop offset=".48" stopColor="#1AD178"/><stop offset="1" stopColor="#79E5B1"/></linearGradient>
              <radialGradient id="trust-art-glow" cx="0" cy="0" r="1" gradientTransform="matrix(0 234 -234 0 261 257)" gradientUnits="userSpaceOnUse"><stop stopColor="#0DBE69" stopOpacity=".25"/><stop offset="1" stopColor="#0DBE69" stopOpacity="0"/></radialGradient>
              <pattern id="trust-art-grid" width="28" height="28" patternUnits="userSpaceOnUse"><path d="M28 0H0v28" stroke="#B9E4C7" strokeOpacity=".08"/></pattern>
              <filter id="trust-art-shadow" x="139" y="126" width="244" height="274" colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse"><feGaussianBlur stdDeviation="12"/></filter>
            </defs>
            <rect x="1" y="1" width="518" height="518" rx="24" fill="url(#trust-art-bg)"/>
            <rect x="1" y="1" width="518" height="518" rx="24" fill="url(#trust-art-grid)"/>
            <circle cx="260" cy="260" r="238" fill="url(#trust-art-glow)"/>
            <path className={`trust-art-route trust-route-one ${activeId === 'authenticity' ? 'is-active' : ''}`} d="M260 257 116 116h-25"/>
            <path className={`trust-art-route trust-route-two ${activeId === 'supply' ? 'is-active' : ''}`} d="M260 257 404 116h25"/>
            <path className={`trust-art-route trust-route-three ${activeId === 'advisory' ? 'is-active' : ''}`} d="M260 257 116 398h-25"/>
            <path className={`trust-art-route trust-route-four ${activeId === 'operator' ? 'is-active' : ''}`} d="M260 257 404 398h25"/>
            <path className="trust-art-route-base" d="M260 257 116 116h-25m169 141 144-141h25m-169 141L116 398h-25m169-141 144 141h25"/>
            <circle className="trust-art-orbit trust-orbit-outer" cx="260" cy="257" r="187"/>
            <circle className="trust-art-orbit trust-orbit-inner" cx="260" cy="257" r="148"/>
            <circle className="trust-art-orbit trust-orbit-dashes" cx="260" cy="257" r="218"/>
            <circle className="trust-art-signal" cx="260" cy="257" r="5"/>
            <path className="trust-art-shield-shadow" d="M260 142 347 174v72c0 68-37 111-87 139-50-28-87-71-87-139v-72l87-32Z"/>
            <path className="trust-art-shield" d="M260 142 347 174v72c0 68-37 111-87 139-50-28-87-71-87-139v-72l87-32Z"/>
            <path className="trust-art-shield-inner" d="M260 161 329 187v59c0 53-27 88-69 113-42-25-69-60-69-113v-59l69-26Z"/>
            <path className="trust-art-check" d="m227 258 23 23 47-51"/>
            <g className={`trust-art-node trust-node-authenticity ${activeId === 'authenticity' ? 'is-active' : ''}`}><circle className="trust-node-halo" cx="91" cy="116" r="25"/><circle className="trust-node-core" cx="91" cy="116" r="12"/><path d="m86 116 4 4 7-8"/></g>
            <g className={`trust-art-node trust-node-supply ${activeId === 'supply' ? 'is-active' : ''}`}><circle className="trust-node-halo" cx="429" cy="116" r="25"/><circle className="trust-node-core" cx="429" cy="116" r="12"/><path d="M429 108v16m-8-8h16m-13-5 10 10m0-10-10 10"/></g>
            <g className={`trust-art-node trust-node-advisory ${activeId === 'advisory' ? 'is-active' : ''}`}><circle className="trust-node-halo" cx="91" cy="398" r="25"/><circle className="trust-node-core" cx="91" cy="398" r="12"/><path d="M86 395h10m-10 5h10m-10-10h10"/></g>
            <g className={`trust-art-node trust-node-operator ${activeId === 'operator' ? 'is-active' : ''}`}><circle className="trust-node-halo" cx="429" cy="398" r="25"/><circle className="trust-node-core" cx="429" cy="398" r="12"/><path d="M429 389v18m-6-12a9 9 0 0 0 0 6m12-6a9 9 0 0 1 0 6m-17-11a15 15 0 0 0 0 16m22-16a15 15 0 0 1 0 16"/></g>
          </svg>
          <span className="trust-art-icon"><ActiveIcon size={33} strokeWidth={1.55}/></span>
        </div>
        <section className="trust-reason-grid" aria-label="دلایل انتخاب">
          {choiceReasons.map(({ id, title, desc, icon: Icon }) => <button type="button" className={`trust-reason-card ${id === activeId ? 'is-active' : ''}`} key={id} onClick={() => setActiveId(id)} aria-pressed={id === activeId}>
            <span className="trust-reason-icon"><Icon size={23} strokeWidth={1.65}/></span>
            <span className="trust-reason-copy"><b>{title}</b><span>{desc}</span></span>
            <i className="trust-reason-line" aria-hidden="true"/>
          </button>)}
        </section>
      </div>
    </div>
  </article>;
}

function PartnerNetworkPage({ index }) {
  const clientSectors = [
    ['۰۱', 'بانک‌ها و مؤسسات مالی', 'FINANCE'],
    ['۰۲', 'اپراتورها و ISPها', 'TELECOM'],
    ['۰۳', 'هلدینگ‌های صنعتی', 'INDUSTRY'],
    ['۰۴', 'سازمان‌های دولتی', 'PUBLIC SECTOR'],
  ];
  return <article className="paper partner-network-paper">
    <PageMeta index={index} label="شبکهٔ همکاران و مشتریان" />
    <div className="partner-network-layout">
      <header className="partner-network-heading"><div><span className="section-tag">شبکهٔ تأمین و اعتماد</span><h1>همکاران و مشتریان <em>بهار</em></h1></div><p>دو لایهٔ همکاری در زنجیرهٔ تأمین، در کنار مشتریان شاخص و تجربه‌های قابل معرفی.</p></header>
      <section className="partner-layers" aria-label="دو لایهٔ شبکهٔ تأمین">
        <div className="partner-layer equipment-layer"><div className="partner-layer-heading"><span>لایهٔ اول</span><b>برندهای تجهیزات اکتیو</b><small>ACTIVE EQUIPMENT BRANDS</small></div><div className="equipment-brand-list">{brands.map((brand, i) => <span key={brand}><i>{pageNumber(i + 1)}</i><b>{brand}</b></span>)}</div></div>
        <div className="partner-link-bridge" aria-hidden="true"><i/><ArrowLeft size={18}/><i/></div>
        <div className="partner-layer distributor-layer"><div className="partner-layer-heading"><span>لایهٔ دوم</span><b>توزیع‌کنندگان اصلی</b><small>MAIN DISTRIBUTORS</small></div><div className="distributor-placeholder"><div><Network size={22}/><i/><i/><i/></div><p>نام و اطلاعات توزیع‌کنندگان اصلی</p><small>برای تکمیل پس از تأیید اطلاعات</small></div></div>
      </section>
      <section className="client-stories">
        <header className="client-stories-heading"><div><span className="section-tag">تجارب و مشتریان</span><h2>Success Stories <i>&</i> Clients</h2></div><p>لوگوهای قابل انتشار را در حوزهٔ مرتبط قرار دهید.</p></header>
        <div className="client-sector-grid">{clientSectors.map(([id, title, en]) => <article className="client-sector-card" key={id}><div className="client-sector-title"><span>{id}</span><div><b>{title}</b><small>{en}</small></div></div><div className="client-logo-space"><Building2 size={18} strokeWidth={1.4}/><span>جایگاه لوگوهای مشتریان شاخص</span></div></article>)}</div>
      </section>
      <footer className="partner-network-note"><ShieldCheck size={13}/><span>نام توزیع‌کنندگان و لوگوهای مشتریان پس از تأیید تکمیل می‌شود؛ ذکر برندها به‌تنهایی به معنی نمایندگی رسمی نیست.</span><b>بخش قابل‌تکمیل</b></footer>
    </div>
  </article>;
}

function ProductPortfolioPage() {
  const [activeId, setActiveId] = useState('compute');
  return <article className="paper portfolio-matrix-paper">
    <div className="portfolio-matrix-layout">
      <header className="portfolio-matrix-heading"><h1>ماتریس سبد محصولات و خدمات <span dir="ltr">Solutions &amp; Portfolio</span></h1></header>
      <section className="portfolio-stage" aria-label="دسته‌بندی‌های سبد محصولات و برندهای مرتبط">
        <div className="portfolio-diagram">
          <svg className="portfolio-orbit-art" viewBox="0 0 600 600" aria-hidden="true">
            <defs>
              <linearGradient id="portfolio-orbit-line" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#d5ed32"/><stop offset=".5" stopColor="#00a651"/><stop offset="1" stopColor="#d5ed32"/></linearGradient>
            </defs>
            <circle cx="300" cy="300" r="291" fill="none" stroke="url(#portfolio-orbit-line)" strokeWidth="2"/>
            <circle className="portfolio-orbit-dashes" cx="300" cy="300" r="281" fill="none" stroke="#d5ed32" strokeOpacity=".65" strokeWidth="2" strokeDasharray="2 13"/>
            <circle className="portfolio-orbit-route" cx="300" cy="300" r="289" fill="none" stroke="#e8f77a" strokeWidth="4" strokeLinecap="round" strokeDasharray="16 160"/>
          </svg>
          <div className="portfolio-quadrants">
            {portfolioCategories.map(({ id, title, english, icon: Icon, brands: brandIds }) => <section className={`portfolio-quadrant portfolio-quadrant-${id} ${activeId === id ? 'is-active' : ''}`} key={id} aria-label={title}>
              <div className="portfolio-quadrant-content">
                <button type="button" className="portfolio-category-choice" onClick={() => setActiveId(id)} aria-pressed={activeId === id} aria-label={title}>
                  <Icon size={22} strokeWidth={1.8}/><b>{id === 'ai' ? 'تجهیزات هوش مصنوعی' : title}</b><small dir="ltr">{english}</small>
                </button>
                <div className="portfolio-quadrant-brands" aria-label={`برندهای ${title}`}>
                  {brandIds.map((brandId) => {
                    const brand = portfolioBrands.find(({ id }) => id === brandId);
                    return <figure className={`portfolio-brand-mark portfolio-brand-${brand.id}`} key={brand.id} title={brand.name}>
                      {brand.src ? <img src={brand.src} alt={brand.name}/> : <span className={`portfolio-brand-wordmark portfolio-wordmark-${brand.id}`}>{brand.wordmark}</span>}
                    </figure>;
                  })}
                </div>
              </div>
            </section>)}
          </div>
          <div className="portfolio-center" aria-hidden="true"><img src="/assets/image39.png" alt=""/></div>
        </div>
      </section>
    </div>
  </article>;
}

function Spread({ index }) {
  switch (pages[index].id) {
    case 0: return <article className="paper cover-paper">
      <div className="cover-image"><img src="/assets/image1.png" alt="سرورهای دیتاسنتر" /></div>
      <div className="cover-shade" />
      <div className="cover-brand"><img src="/assets/image39.png" alt="" /></div>
      <div className="cover-copy"><h1><span>معرفی شرکت</span><em>بهار ارتباط گستر</em></h1></div>
    </article>;
    case 2: return <article className="paper history-paper">
      <PageMeta index={index} label="از ۱۳۷۹ تا امروز" />
      <HistoryTimeline />
    </article>;
    case 3: return <article className="paper keyfacts-paper">
      <PageMeta index={index} label="آمار کلیدی" />
      <div className="keyfacts-layout">
        <header className="keyfacts-heading"><div className="keyfacts-heading-copy"><h1>آمار کلیدی <em>در یک نگاه</em></h1><p className="keyfacts-company-intro">بهار ارتباط گستر، فعال در حوزه فناوری اطلاعات و ارتباطات، با تمرکز بر تأمین تجهیزات زیرساختی دیتاسنتر و سرور، در مسیر پاسخ‌گویی به نیازهای سازمان‌ها و کسب‌وکارهای وابسته به زیرساخت دیجیتال فعالیت می‌کند.</p></div></header>
        <div className="keyfacts-grid">{keyMetrics.map(({ value, unit, label, desc, icon: Icon }, i) => <article className={`keyfacts-card keyfacts-card-${i + 1}`} key={label}><div className="keyfacts-card-top"><Icon size={22} strokeWidth={1.6}/></div><div className="keyfacts-measure"><b>{value}</b><span>{unit}</span></div><h2>{label}</h2>{i === 3 ? <><p>{desc}</p><div className="keyfacts-brands" aria-label="HP، Supermicro، Fujitsu، Cisco و Fortinet">{['HP','Supermicro','Fujitsu','Cisco','Fortinet'].map((brand) => <span key={brand}>{brand}</span>)}</div></> : <p>{desc}</p>}</article>)}</div>
        <footer className="keyfacts-outcome"><Sparkles size={21} strokeWidth={1.6}/><p><strong>این مسیر با حمایت برندهای معتبر بین‌المللی شکل گرفته است.</strong> با وجود پیچیدگی‌های واردات و حساسیت این تجهیزات، ماموریت ما به خوبی به نتیجه رسیده و آمار بالا گواه این موضوع است.</p></footer>
      </div>
    </article>;
    case 4: return <PainPointsPage index={index} />;
    case 5: return <PrinciplesDetailPage index={index} />;
    case 7: return <ProcessFlowPage index={index} />;
    case 8: return <ProjectShowcasePage index={index} />;
    case 9: return <ProductPortfolioPage index={index} />;
    default: return <article className="paper contact-paper">
      <PageMeta index={index} label="گفت‌وگو دربارهٔ پروژهٔ بعدی شما" />
      <div className="contact-orbit" />
      <div className="contact-final-layout">
        <header className="contact-final-heading"><span className="section-tag">تماس و شبکه‌های ارتباطی</span><h1>برای گام بعدی، <em>با بهار</em> در ارتباط باشید</h1><p>برای گفت‌وگو دربارهٔ نیاز زیرساختی یا استعلام تجهیزات با ما در تماس باشید.</p></header>
        <section className="contact-channels" aria-label="راه‌های تماس با بهار ارتباط گستر">
          <div className="contact-channel contact-address"><span><MapPin size={18}/></span><div><small>نشانی دفتر مرکزی</small><b>تهران، بلوار نلسون ماندلا، خیابان عاطفی غربی، شمارهٔ ۱۲۱</b><em>کد پستی <strong dir="ltr">۱۹۶۷۹۴۵۱۷۱</strong></em></div><i>ADDRESS</i></div>
          <a className="contact-channel contact-channel-link" href="https://bahartel.ir" target="_blank" rel="noreferrer"><span><Globe2 size={18}/></span><div><small>وب‌سایت</small><b dir="ltr">bahartel.ir</b></div><ArrowUpRight size={16}/></a>
          <a className="contact-channel contact-channel-link" href="tel:+982141742000"><span><Phone size={18}/></span><div><small>تلفن تماس</small><b dir="ltr">۰۲۱ ۴۱۷۴ ۲۰۰۰</b></div><ArrowUpLeft size={16}/></a>
          <a className="contact-channel contact-channel-link" href="mailto:info@bahartel.com"><span><Mail size={18}/></span><div><small>ایمیل</small><b dir="ltr">info@bahartel.com</b></div><ArrowUpLeft size={16}/></a>
        </section>
        <aside className="contact-qr-card"><div className="contact-qr-copy"><small>SCAN TO VISIT</small><h2>با اسکن کد،<br/>به وب‌سایت بهارتل بروید</h2><p>کد QR مستقیماً به وب‌سایت رسمی بهارتل پیوند دارد.</p><a href="https://bahartel.ir" target="_blank" rel="noreferrer">bahartel.ir <ArrowUpRight size={14}/></a></div><div className="contact-qr-frame"><WebsiteQr value="https://bahartel.ir"/><span>اسکن برای بازدید</span></div><i className="contact-qr-corner"/></aside>
        <footer className="contact-final-footer"><Logo light/><span>نشانی دفتر مرکزی و راه‌های ارتباطی بهار ارتباط گستر</span><b>از ۱۳۷۹ تا امروز</b></footer>
      </div>
    </article>;
  }
}

function IctMotif({ index }) {
  return <div className={`ict-motif motif-${index === 0 ? 'cover' : 'page'}`} aria-hidden="true">
    <svg className="ict-wave" viewBox="0 0 1120 630" preserveAspectRatio="none">
      <defs><linearGradient id="signal-gradient" x1="0" y1="0" x2="1" y2="0"><stop stopColor="#00a651" stopOpacity="0"/><stop offset=".32" stopColor="#00a651" stopOpacity=".7"/><stop offset=".72" stopColor="#cbdf27" stopOpacity=".58"/><stop offset="1" stopColor="#cbdf27" stopOpacity="0"/></linearGradient></defs>
      <path className="wave-path wave-back" d="M-30 470 C100 390 155 540 275 475 S430 397 540 468 S720 535 825 455 S1010 396 1150 474" />
      <path className="wave-path wave-front" d="M-30 497 C90 435 155 565 285 500 S430 420 550 496 S715 558 830 480 S1010 435 1150 500" />
      <path className="wave-path wave-signal" d="M-20 518 H130 l22 -32 18 60 25 -91 24 64 23 -35 h90 q40 0 60 -30 t45 -28 t42 30 t46 30 h120 q39 0 55 -20 t40 -20 t43 20 t39 20 h230" />
      <circle className="wave-node node-a" cx="286" cy="500" r="5"/><circle className="wave-node node-b" cx="650" cy="494" r="5"/><circle className="wave-node node-c" cx="966" cy="470" r="5"/>
    </svg>
  </div>;
}

function App() {
  const [page, setPage] = useState(0);
  const [toc, setToc] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [direction, setDirection] = useState('next');
  const touchStart = useRef(null);
  const leafRef = useRef(null);
  const lastWheelTurn = useRef(0);

  const turn = (next) => {
    setDirection(next > page ? 'next' : 'prev');
    setPage(Math.max(0, Math.min(pages.length - 1, next)));
  };

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === 'Escape') { setToc(false); if (document.fullscreenElement) document.exitFullscreen?.(); }
      if (toc) return;
      if (event.target instanceof HTMLElement && event.target.closest('input, textarea, select, [contenteditable="true"]')) return;
      if (event.target instanceof HTMLElement && event.target.closest('button, a') && [' ', 'Enter'].includes(event.key)) return;
      if (event.target instanceof HTMLElement && event.target.closest('.history-rail-scroll, .process-flow-stepper, .process-roadmap') && ['ArrowLeft', 'ArrowRight', 'Home', 'End', ' '].includes(event.key)) return;
      const leaf = leafRef.current;
      if (leaf && (getComputedStyle(leaf).overflowY === 'auto' || leaf.scrollHeight > leaf.clientHeight + 1) && ['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', ' ', 'Home', 'End'].includes(event.key)) {
        event.preventDefault();
        if (event.key === 'Home') leaf.scrollTo({ top: 0 });
        else if (event.key === 'End') leaf.scrollTo({ top: leaf.scrollHeight });
        else {
          const forward = ['ArrowDown', 'PageDown', ' '].includes(event.key) && !(event.key === ' ' && event.shiftKey);
          const distance = ['ArrowDown', 'ArrowUp'].includes(event.key) ? 48 : leaf.clientHeight * .8;
          leaf.scrollBy({ top: (forward ? 1 : -1) * distance });
        }
        return;
      }
      if (['ArrowLeft', 'ArrowDown', 'PageDown', ' '].includes(event.key)) { event.preventDefault(); turn(page + 1); }
      if (['ArrowRight', 'ArrowUp', 'PageUp'].includes(event.key)) { event.preventDefault(); turn(page - 1); }
      if (event.key === 'Home') turn(0);
      if (event.key === 'End') turn(pages.length - 1);
    };
    const onFullscreen = () => setFullscreen(Boolean(document.fullscreenElement));
    window.addEventListener('keydown', onKey);
    document.addEventListener('fullscreenchange', onFullscreen);
    return () => { window.removeEventListener('keydown', onKey); document.removeEventListener('fullscreenchange', onFullscreen); };
  }, [page, toc]);

  const toggleFullscreen = async () => {
    if (document.fullscreenElement) await document.exitFullscreen?.();
    else await document.documentElement.requestFullscreen?.();
  };

  const handleTouchStart = (event) => {
    touchStart.current = null;
    if (toc || event.touches.length !== 1) return;
    if (event.target instanceof Element && event.target.closest('.history-rail-scroll, .process-flow-stepper, .process-roadmap, button, a, input, select, textarea')) return;
    const touch = event.changedTouches[0];
    touchStart.current = { x: touch.clientX, y: touch.clientY };
  };
  const handleTouchEnd = (event) => {
    const start = touchStart.current;
    touchStart.current = null;
    if (!start || toc) return;
    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - start.x;
    const deltaY = touch.clientY - start.y;
    if (Math.abs(deltaX) > 48 && Math.abs(deltaX) > Math.abs(deltaY) * 1.25) turn(page + (deltaX < 0 ? 1 : -1));
  };
  const handleWheel = (event) => {
    if (event.target instanceof Element && event.target.closest('.history-rail-scroll, .process-flow-stepper, .process-roadmap')) return;
    // A scrollable page keeps vertical wheel input, including at its boundaries.
    // Turning the catalogue remains available through arrows and horizontal swipes.
    const leaf = leafRef.current;
    if (leaf && (getComputedStyle(leaf).overflowY === 'auto' || leaf.scrollHeight > leaf.clientHeight + 1)) return;
    if (Math.abs(event.deltaY) < 28) return;
    const now = Date.now();
    if (now - lastWheelTurn.current < 620) return;
    lastWheelTurn.current = now;
    turn(page + (event.deltaY > 0 ? 1 : -1));
  };

  return <main className="catalog-app" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd} onTouchCancel={() => { touchStart.current = null; }}>
    <div className="catalog-topbar">
      <button className="catalog-home" onClick={() => turn(0)} aria-label="رفتن به جلد کاتالوگ"><Logo /><span className="catalog-home-title"><b>کاتالوگ تعاملی</b><small>BAHARTEL · COMPANY PROFILE</small></span></button>
      <div className="catalog-tools"><span className="catalog-edition"><b>{pages[page].chapter}</b><i /> ۱۴۰۵</span><button className="toc-button" onClick={() => setToc(true)}><span className="toc-glyph">☷</span><span>فهرست صفحات</span></button><button className="fullscreen-button" onClick={toggleFullscreen} aria-label={fullscreen ? 'خروج از تمام‌صفحه' : 'نمای تمام‌صفحه'} title={fullscreen ? 'خروج از تمام‌صفحه' : 'نمای تمام‌صفحه'}>{fullscreen ? <Minimize size={16} /> : <Maximize size={16} />}<span>{fullscreen ? 'خروج' : 'ارائه'}</span></button></div>
    </div>
    <div className="catalog-stage" onWheel={handleWheel}>
      <button className="turn-button turn-prev" onClick={() => turn(page - 1)} disabled={page === 0} aria-label="صفحهٔ قبلی" title="صفحهٔ قبلی"><ChevronRight size={21} /><span>قبلی</span></button>
      <div className={`catalog-leaf turn-${direction}`} key={page} ref={leafRef}><Spread index={page} />{pages[page].id !== 9 && <IctMotif index={pages[page].id} />}</div>
      <button className="turn-button turn-next" onClick={() => turn(page + 1)} disabled={page === pages.length - 1} aria-label="صفحهٔ بعدی" title="صفحهٔ بعدی"><span>بعدی</span><ChevronLeft size={21} /></button>
    </div>
    <div className="catalog-bottom">
      <div className="catalog-page-context"><small>{pages[page].chapter}</small><b>{pages[page].title}</b></div>
      <div className="catalog-progress-track"><span style={{ width: `${((page + 1) / pages.length) * 100}%` }} /><input type="range" min="0" max={pages.length - 1} step="1" value={page} onChange={(event) => turn(Number(event.target.value))} aria-label="رفتن به صفحه‌ای از کاتالوگ" aria-valuetext={`${pageNumber(page + 1)}، ${pages[page].title}`} /></div>
      <div className="page-controls"><button onClick={() => turn(page - 1)} disabled={page === 0} aria-label="صفحهٔ قبلی"><ArrowRight size={15} /></button><span><b>{pageNumber(page + 1)}</b><i>/</i><small>{pageNumber(pages.length)}</small></span><button onClick={() => turn(page + 1)} disabled={page === pages.length - 1} aria-label="صفحهٔ بعدی"><ArrowLeft size={15} /></button></div>
      <div className="keyboard-hint"><kbd>←</kbd><kbd>→</kbd><span>ورق‌زدن</span></div>
    </div>
    {toc && <div className="toc-backdrop" onClick={() => setToc(false)}><aside className="toc-panel" dir="rtl" onClick={(event) => event.stopPropagation()}><div className="toc-head"><div><span className="section-tag">راهنمای کاتالوگ · {pageNumber(pages.length)} صفحه</span><h2>فهرست صفحات</h2><p>صفحهٔ {pageNumber(page + 1)} از {pageNumber(pages.length)}</p></div><button className="toc-close" onClick={() => setToc(false)} aria-label="بستن فهرست"><X size={19} /></button></div><div className="toc-list">{pages.map((item, i) => <button className={i === page ? 'toc-active' : ''} key={item.id} onClick={() => { turn(i); setToc(false); }} aria-current={i === page ? 'page' : undefined}><span>{pageNumber(i + 1)}</span><div><b>{item.title}</b><small>{item.chapter}</small></div><ChevronLeft size={16} /></button>)}</div><div className="toc-footer"><Logo /><span>بهار ارتباط گستر · آبان ۱۴۰۵</span></div></aside></div>}
  </main>;
}

createRoot(document.getElementById('root')).render(<App />);
