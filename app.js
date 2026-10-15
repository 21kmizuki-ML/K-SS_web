(function () {
  'use strict';

  const config = window.KATANO_CONFIG;
  const content = document.getElementById('content');
  const menuButton = document.getElementById('menu-button');
  const mobileMenu = document.getElementById('mobile-menu');

  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, character => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[character]);
  }

  function setMenu(open) {
    mobileMenu.hidden = !open;
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'メニューを閉じる' : 'メニューを開く');
  }

  function pageTitle(english, japanese, description = '') {
    return `<section class="page-title"><div class="shell"><span class="eyebrow">${english}</span><h1>${japanese}</h1>${description ? `<p>${description}</p>` : ''}</div></section>`;
  }

  function storePhoto(loading = 'eager') {
    return `<img class="store-photo" src="gaikan.jpg" alt="ENEOS 交野SSの店舗外観" loading="${loading}">`;
  }

  function paymentMethods() {
    return `<ul class="payment-list">${config.paymentMethods.map(method => `<li>${escapeHtml(method)}</li>`).join('')}</ul>`;
  }

  function mapUrl() {
    return 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(config.address);
  }

  function mapEmbedUrl() {
    const { latitude, longitude } = config.map;
    const bounds = [
      longitude - 0.003, latitude - 0.002,
      longitude + 0.003, latitude + 0.002
    ].join(',');
    return 'https://www.openstreetmap.org/export/embed.html?bbox=' +
      encodeURIComponent(bounds) + '&layer=mapnik&marker=' +
      encodeURIComponent(latitude + ',' + longitude);
  }

  function renderHome() {
    return `<section class="hero shell">
      <div class="hero-copy">
        <span class="eyebrow">ENEOS 交野SS</span>
        <h1>まちの毎日に、<br>安心の一番近く。</h1>
        <p class="operating-type">${escapeHtml(config.operatingType)}のガソリンスタンド</p>
        <p class="hero-description">セルフサービスでの給油に加え、ドライブスルー洗車・オイル交換・軽油、灯油の配達（法人・工場 等）を行っております</p>
        <a class="text-link" href="#services">サービスを見る <span aria-hidden="true">→</span></a>
      </div>
      <div class="hero-media">${storePhoto()}<span>ENEOS 交野SS ｜ 店舗外観</span></div>
    </section>
    <section class="hours-band"><div class="shell hours-inner">
      <div><span class="eyebrow light">OPEN HOURS</span><h2>営業時間</h2></div>
      <div class="hours-times">
        <div><span>平日・土</span><strong>${escapeHtml(config.hours.weekday)}</strong></div>
        <div><span>日・祝</span><strong>${escapeHtml(config.hours.holiday)}</strong></div>
      </div>
      <p>※ ${escapeHtml(config.hours.closed)}</p>
    </div></section>
    <section class="section soft"><div class="shell">
      <div class="section-heading"><div><span class="eyebrow">SERVICES</span><h2>サービス</h2></div><a class="text-link" href="#services">詳しく見る →</a></div>
      <div class="service-grid">${config.services.map((service, index) => `<a class="service-tile${service.noteStrong ? ' delivery-tile' : ''}" href="#services"><span class="service-number">0${index + 1}</span><strong>${escapeHtml(service.name)}</strong>${service.noteStrong ? `<span class="service-warning">${escapeHtml(service.noteStrong)}</span>` : ''}<span class="tile-arrow" aria-hidden="true">↗</span></a>`).join('')}</div>
    </div></section>
    <section class="section shell access-home" id="location">
      <div class="access-home-copy"><span class="eyebrow">LOCATION</span><h2>店舗へのアクセス</h2>
        <p class="address-name">${escapeHtml(config.storeName)}</p>
        <p>〒${escapeHtml(config.postalCode)}<br>${escapeHtml(config.address)}</p>
        <div class="button-row"><a class="button primary" href="${mapUrl()}" target="_blank" rel="noopener noreferrer">Googleマップで経路を見る ↗</a></div>
      </div>
      <div class="real-map">
        <iframe title="ENEOS 交野SS周辺の地図" src="${escapeHtml(mapEmbedUrl())}" loading="lazy"></iframe>
        <p class="map-credit"><a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer"></p>
      </div>
    </section>`;
  }

  function renderServices() {
    return pageTitle('GUIDE', '交野SSのご案内', '営業時間・お支払い方法と、お取り扱いサービスをご案内します。') +
      `<div class="shell page-body services-page">
        <section class="service-info" aria-labelledby="usage-heading">
          <div class="section-heading"><div><span class="eyebrow">INFORMATION</span><h2 id="usage-heading">ご利用案内</h2></div></div>
          <div class="info-grid">
            <div class="info-card"><span class="info-label">OPEN HOURS</span><h3>営業時間</h3>
              <dl class="service-hours">
                <div><dt>平日・土</dt><dd>${escapeHtml(config.hours.weekday)}</dd></div>
                <div><dt>日・祝</dt><dd>${escapeHtml(config.hours.holiday)}</dd></div>
              </dl>
              <p class="hours-note">※ ${escapeHtml(config.hours.closed)}</p>
            </div>
            <div class="info-card"><span class="info-label">PAYMENT</span><h3>お支払い方法</h3>${paymentMethods()}</div>
          </div>
        </section>
        <section class="service-details" aria-labelledby="services-heading">
          <div class="section-heading"><div><span class="eyebrow">SERVICES</span><h2 id="services-heading">サービス</h2></div></div>
          <div class="service-detail-grid">${config.services.map((service, index) => `
            <article class="detail-card" id="service-${escapeHtml(service.id)}">
              <span class="service-number">0${index + 1} / SERVICE</span>
              <h3>${escapeHtml(service.name)}</h3>
              <p class="service-description">${escapeHtml(service.description)}</p>
              ${service.note || service.noteStrong ? `<p class="service-note">${service.noteStrong ? `<strong>${escapeHtml(service.noteStrong)}</strong><br>` : ''}${escapeHtml(service.note)}</p>` : ''}
            </article>`).join('')}</div>
          <div class="service-contact">
            <p>サービスについてのご相談や、オイル交換のご予約はこちらから。</p>
            <a class="button primary" href="#company">お問い合わせはこちら →</a>
          </div>
        </section>
      </div>`;
  }

  function renderCompany() {
    const company = config.company;
    const phone = escapeHtml(config.storePhone);
    const dial = config.storePhone.replace(/[^\d+]/g, '');
    return pageTitle('COMPANY', '会社概要・お問い合わせ') +
      `<div class="shell page-body">
        <dl class="company-list">
          <div><dt>会社名</dt><dd>${escapeHtml(company.name)}</dd></div>
          <div><dt>事業内容</dt><dd>${escapeHtml(company.business)}</dd></div>
          <div><dt>運営店舗</dt><dd>${escapeHtml(config.storeName)}</dd></div>
        </dl>
        <section class="contact-box" aria-labelledby="contact-title">
          <span class="eyebrow">CONTACT</span>
          <h2 id="contact-title">お問い合わせ</h2>
          <p>交野SSへのお問い合わせ・オイル交換のご予約はこちら</p>
          <a class="contact-phone" href="tel:${dial}">${phone}</a>
        </section>
      </div>`;
  }

  function render(scroll = true) {
    const route = location.hash.slice(1).split('/')[0] || 'home';
    const pages = {
      home: { html: renderHome, title: 'ホーム' },
      services: { html: renderServices, title: 'サービス' },
      company: { html: renderCompany, title: '会社概要・お問い合わせ' }
    };
    const page = pages[route] || pages.home;
    content.innerHTML = page.html();
    document.title = `${page.title}｜${config.storeName}`;
    setMenu(false);
    if (scroll) window.scrollTo(0, 0);
  }

  menuButton.addEventListener('click', () => setMenu(mobileMenu.hidden));
  mobileMenu.addEventListener('click', event => {
    if (event.target.closest('a')) setMenu(false);
  });
  document.querySelector('.skip-link').addEventListener('click', event => {
    event.preventDefault();
    content.focus();
  });
  window.addEventListener('hashchange', () => render());
  render(false);
})();
