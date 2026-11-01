import React from 'react';

export default function CoverPage() {
  return <article className="paper cover-paper">
    <svg className="cover-ambient" viewBox="0 0 1250 703" preserveAspectRatio="none" aria-hidden="true">
      <defs><linearGradient id="cover-flow" x1="0" y1="1" x2="1" y2="0"><stop stopColor="#00a651" stopOpacity="0"/><stop offset=".45" stopColor="#19aa71" stopOpacity=".25"/><stop offset="1" stopColor="#c9df38" stopOpacity=".18"/></linearGradient></defs>
      <path d="M-70 558C114 420 180 650 410 508S707 388 860 484 1102 603 1300 452"/>
      <path d="M-70 578C114 440 180 670 410 528S707 408 860 504 1102 623 1300 472"/>
      <path className="cover-flow-line" d="M-70 598C114 460 180 690 410 548S707 428 860 524 1102 643 1300 492"/>
      <path d="M-80 175C150 55 365 122 442 301S782 511 998 306 1180 189 1290 211"/>
    </svg>
    <div className="cover-visual" aria-hidden="true">
      <div className="cover-visual-halo"/>
      <svg className="cover-contours" viewBox="0 0 600 620">
        <path d="M288 26C438 10 566 102 570 279S487 565 315 590 24 461 27 291 124 44 288 26Z"/>
        <path d="M291 51C429 38 539 123 542 282S469 540 313 562 54 447 56 292 141 67 291 51Z"/>
        <path className="cover-contour-signal" d="M291 51C429 38 539 123 542 282S469 540 313 562 54 447 56 292 141 67 291 51Z"/>
      </svg>
      <div className="cover-photo"><img src="/assets/image1.png" alt=""/></div>
      <span className="cover-signal cover-signal-one"/><span className="cover-signal cover-signal-two"/>
      <div className="cover-photo-caption" dir="ltr"><i/>ICT INFRASTRUCTURE<span>CONNECTED WITH CONFIDENCE</span></div>
    </div>
    <div className="cover-logo"><img src="/assets/image39.png" alt="نشان بهار ارتباط گستر"/><span dir="ltr">BAHAR ERTEBAT GOSTAR</span></div>
    <div className="cover-intro">
      <span className="cover-eyebrow">معرفی شرکت</span>
      <h1 className="cover-headline">بهار <span>ارتباط گستر</span></h1>
      <p className="cover-description">همراه زیرساخت شما،<br/>از انتخاب راهکار تا تأمین تجهیزات.</p>
      <div className="cover-expertise"><span>سرور</span><i/><span>ذخیره‌سازی</span><i/><span>شبکه</span><i/><span>هوش مصنوعی</span></div>
    </div>
    <footer className="cover-signature"><span>پروفایل شرکتی</span><i/><span dir="ltr">BAHARTEL</span><b>۱۴۰۵</b></footer>
  </article>;
}
