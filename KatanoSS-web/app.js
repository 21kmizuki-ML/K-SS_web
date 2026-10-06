(function () {
  'use strict';

  const config = window.KATANO_CONFIG;
  const content = document.getElementById('content');
  const menuButton = document.getElementById('menu-button');
  const mobileMenu = document.getElementById('mobile-menu');
  const storageKey = 'katano-ss-local-notices-v1';
  const categories = ['営業案内', 'キャンペーン', 'サービス', 'その他'];
  let adminUnlocked = false;
  let adminFlash = '';
  let notices = loadNotices();
  let renderedDate = todayJapan();

  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
  }

  function safeImage(value) {
    return typeof value === 'string' && /^data:image\/(jpeg|png|webp);base64,[a-z0-9+/=]+$/i.test(value) ? value : '';
  }

  function loadNotices() {
    try {
      const stored = JSON.parse(localStorage.getItem(storageKey) || '[]');
      return Array.isArray(stored) ? stored.filter(item => item && typeof item.id === 'string') : [];
    } catch (_) { return []; }
  }

  function saveNotices(next) {
    try {
      localStorage.setItem(storageKey, JSON.stringify(next));
      notices = next;
      return true;
    } catch (_) { return false; }
  }

  function todayJapan() {
    const parts = new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Tokyo', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date());
    const values = Object.fromEntries(parts.map(part => [part.type, part.value]));
    return `${values.year}-${values.month}-${values.day}`;
  }

  function isLive(item) {
    const today = todayJapan();
    return item.published === true && item.startDate <= today && (!item.endDate || item.endDate >= today);
  }

  function liveNotices() {
    return notices.filter(isLive).sort((a, b) => Number(b.important) - Number(a.important) || b.startDate.localeCompare(a.startDate) || b.createdAt.localeCompare(a.createdAt));
  }

  function routeInfo() {
    let route = location.hash.slice(1) || 'home';
    try { route = decodeURIComponent(route); } catch (_) { route = 'home'; }
    const [path, query = ''] = route.split('?');
    return { parts: path.split('/').filter(Boolean), query: new URLSearchParams(query) };
  }

  function setMenu(open) {
    mobileMenu.hidden = !open;
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'メニューを閉じる' : 'メニューを開く');
  }

  menuButton.addEventListener('click', () => setMenu(mobileMenu.hidden));
  mobileMenu.addEventListener('click', event => { if (event.target.closest('a')) setMenu(false); });
  document.getElementById('skip-link').addEventListener('click', () => content.focus());

  function storePhoto(loading = 'eager') {
    return `<img class="store-photo" src="gaikan.jpg" alt="ENEOS 交野SSの店舗外観" loading="${loading}">`;
  }

  function pageTitle(english, japanese, description = '') {
    return `<section class="page-title"><div class="shell"><span class="eyebrow">${english}</span><h1>${japanese}</h1>${description ? `<p>${description}</p>` : ''}</div></section>`;
  }

  function noticeRow(item) {
    return `<a class="notice-row" href="#news/${encodeURIComponent(item.id)}"><span class="notice-meta"><time datetime="${escapeHtml(item.startDate)}">${escapeHtml(item.startDate.replaceAll('-', '.'))}</time><span class="category">${escapeHtml(item.category)}</span>${item.important ? '<span class="priority-tag">重要</span>' : ''}</span><strong>${escapeHtml(item.title)}</strong><span class="notice-arrow" aria-hidden="true">→</span></a>`;
  }

  function renderHome() {
    const live = liveNotices();
    const important = live.find(item => item.important);
    const recent = live.filter(item => item.id !== important?.id).slice(0, 3);
    const campaign = live.find(item => item.category === 'キャンペーン');
    const mapUrl = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(config.address);
    return `<section class="hero shell"><div class="hero-copy"><span class="eyebrow">ENEOS 交野SS</span><h1>まちの毎日に、<br>安心の一番近く。</h1><p class="operating-type">${escapeHtml(config.operatingType)}のガソリンスタンド</p><p>セルフサービスでの給油に加え、ドライブスルー洗車・オイル交換・配達灯油をご案内しています。</p><a class="text-link" href="#access">店舗へのアクセス ↗</a></div>${storePhoto()}</section>
      <section class="hours-band"><div class="shell hours-inner"><div><span class="eyebrow light">OPEN HOURS</span><h2>営業時間</h2></div><div class="hours-times"><div><span>平日・土</span><strong>${escapeHtml(config.hours.weekday)}</strong></div><div><span>日・祝</span><strong>${escapeHtml(config.hours.holiday)}</strong></div></div><p>※ 臨時休業・営業時間変更はお知らせをご確認ください。</p></div></section>
      <section class="section shell"><div class="section-heading"><div><span class="eyebrow">NEWS</span><h2>お知らせ</h2></div><a class="text-link" href="#news">一覧を見る →</a></div>${important ? `<div class="important-card"><span class="important-icon" aria-hidden="true">!</span><div><strong>重要なお知らせ</strong><a href="#news/${encodeURIComponent(important.id)}">${escapeHtml(important.title)} →</a></div></div>` : ''}${recent.length ? `<div class="notice-list">${recent.map(noticeRow).join('')}</div>` : !important ? '<div class="empty-state">現在、公開中のお知らせはありません。</div>' : ''}</section>
      <section class="section soft"><div class="shell"><div class="section-heading"><div><span class="eyebrow">SERVICES</span><h2>サービス</h2></div><a class="text-link" href="#services">詳しく見る →</a></div><div class="service-grid">${config.services.map(service => `<a class="service-tile" href="#services"><span class="service-icon" aria-hidden="true">${escapeHtml(service.icon)}</span><strong>${escapeHtml(service.name)}</strong><span class="arrow" aria-hidden="true">↗</span></a>`).join('')}</div></div></section>
      ${campaign ? `<section class="section shell"><div class="section-heading"><div><span class="eyebrow">CAMPAIGN</span><h2>キャンペーン</h2></div></div><a class="campaign-card" href="#news/${encodeURIComponent(campaign.id)}"><div><span class="category">キャンペーン</span><h3>${escapeHtml(campaign.title)}</h3><span class="text-link">詳しく見る →</span></div>${safeImage(campaign.image) ? `<img src="${campaign.image}" alt="">` : ''}</a></section>` : ''}
      <section class="section shell access-home"><div><span class="eyebrow">ACCESS</span><h2>交野SSへお越しください</h2><p>〒${escapeHtml(config.postalCode)}<br>${escapeHtml(config.address)}</p><div class="button-row"><a class="button primary" href="${mapUrl}" target="_blank" rel="noopener noreferrer">Googleマップで見る ↗</a><a class="button secondary" href="#access">店舗情報を見る →</a></div></div><div class="map-art" aria-hidden="true"><span>⌖</span><strong>交野SS</strong></div></section>`;
  }

  function renderNews() {
    const live = liveNotices();
    return pageTitle('NEWS', 'お知らせ', '営業案内やサービス、キャンペーンの情報をお届けします。') + `<div class="shell page-body">${live.length ? `<div class="notice-list">${live.map(noticeRow).join('')}</div>` : '<div class="empty-state">現在、公開中のお知らせはありません。</div>'}</div>`;
  }

  function renderNewsDetail(id) {
    const item = notices.find(notice => notice.id === id && isLive(notice));
    if (!item) return pageTitle('NEWS', 'お知らせが見つかりません') + '<div class="shell page-body"><p>公開期間が終了したか、非公開になっています。</p><a class="back-link" href="#news">← お知らせ一覧へ戻る</a></div>';
    return pageTitle('NEWS', escapeHtml(item.title)) + `<article class="shell page-body"><div class="notice-meta"><time datetime="${escapeHtml(item.startDate)}">${escapeHtml(item.startDate.replaceAll('-', '.'))}</time><span class="category">${escapeHtml(item.category)}</span>${item.important ? '<span class="priority-tag">重要</span>' : ''}</div>${safeImage(item.image) ? `<img class="article-image" src="${item.image}" alt="${escapeHtml(item.title)}">` : ''}<div class="article-body">${escapeHtml(item.body)}</div><a class="back-link" href="#news">← お知らせ一覧へ戻る</a></article>`;
  }

  function renderServices() {
    return pageTitle('SERVICES', 'サービス', '交野SSでご利用いただけるサービスをご案内します。') + `<div class="shell page-body"><div class="detail-grid">${config.services.map(service => `<section class="detail-card" id="service-${escapeHtml(service.id)}"><span class="service-icon" aria-hidden="true">${escapeHtml(service.icon)}</span><h2>${escapeHtml(service.name)}</h2><p>${escapeHtml(service.description)}</p></section>`).join('')}</div></div>`;
  }

  function renderAccess() {
    const mapUrl = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(config.address);
    return pageTitle('ACCESS', '店舗・アクセス') + `<div class="shell page-body"><h2>${escapeHtml(config.storeName)}</h2><p>${escapeHtml(config.operator)}<br>営業形態：${escapeHtml(config.operatingType)}<br>〒${escapeHtml(config.postalCode)}<br>${escapeHtml(config.address)}</p><div class="access-photo">${storePhoto('lazy')}</div><div class="detail-grid"><section class="detail-card"><h2>営業時間</h2><p>平日・土　${escapeHtml(config.hours.weekday)}<br>日・祝　${escapeHtml(config.hours.holiday)}</p><p class="small-note">※ 臨時休業・営業時間変更はお知らせをご確認ください。</p></section><section class="detail-card"><h2>地図・経路</h2><p>Googleマップで所在地と経路をご確認いただけます。</p><div class="button-row"><a class="button primary" href="${mapUrl}" target="_blank" rel="noopener noreferrer">Googleマップで経路を見る ↗</a></div><p class="small-note">※ 地図の表示にはインターネット接続が必要です。</p></section></div></div>`;
  }

  function renderCompany() {
    const company = config.company;
    return pageTitle('COMPANY', '会社概要') + `<div class="shell page-body"><dl class="company-list"><div><dt>会社名</dt><dd>${escapeHtml(company.name)}</dd></div><div><dt>本社所在地</dt><dd>${company.headOfficeAddress ? escapeHtml(company.headOfficeAddress) : '<span class="small-note">確認後に掲載します</span>'}</dd></div><div><dt>事業内容</dt><dd>${escapeHtml(company.business)}</dd></div><div><dt>運営店舗</dt><dd>${escapeHtml(config.storeName)}</dd></div><div><dt>電話番号</dt><dd>${company.phone ? escapeHtml(company.phone) : '<span class="small-note">確認後に掲載します</span>'}</dd></div></dl></div>`;
  }

  function adminShell(inner) {
    return `<div class="admin-surface"><div class="shell admin-wrap">${inner}</div></div>`;
  }

  function renderAdminLogin(message = '') {
    return adminShell(`<div class="admin-top"><h1>交野SS 管理</h1><a class="text-link" href="#home">サイトを見る →</a></div><div class="admin-login"><h2>確認用ログイン</h2><p>このPCのブラウザー内でお知らせ画面を試せます。</p>${message ? `<div class="message error" role="alert">${escapeHtml(message)}</div>` : ''}<form id="admin-login-form"><div class="field"><label for="admin-pin">確認用PIN</label><input id="admin-pin" name="pin" type="password" inputmode="numeric" autocomplete="off" required></div><button class="submit-button" type="submit">管理画面を開く</button></form><p class="admin-note">PINは 2468 です。これは画面確認用で、安全な従業員認証ではありません。データはこのブラウザー内にのみ保存されます。</p></div>`);
  }

  function adminTabs(active) {
    return `<nav class="admin-tabs" aria-label="管理メニュー"><a href="#admin/new" class="${active === 'new' ? 'active' : ''}">＋ 新規投稿</a><a href="#admin" class="${active === 'live' ? 'active' : ''}">公開中</a><a href="#admin?tab=past" class="${active === 'past' ? 'active' : ''}">過去のお知らせ</a></nav>`;
  }

  function statusText(item) {
    if (!item.published) return '非公開';
    if (item.startDate > todayJapan()) return '公開開始前';
    if (item.endDate && item.endDate < todayJapan()) return '公開終了';
    return '公開中';
  }

  function renderAdminList(tab, message = '') {
    const shown = notices.filter(item => tab === 'live' ? isLive(item) : !isLive(item)).sort((a, b) => b.startDate.localeCompare(a.startDate) || b.createdAt.localeCompare(a.createdAt));
    return adminShell(`<div class="admin-top"><h1>交野SS 管理</h1><button type="button" class="text-link" data-action="logout">終了</button></div><p class="admin-note">ローカルの確認用画面です。ここで投稿した内容は、このブラウザーのこのファイルでだけ表示されます。</p>${adminTabs(tab)}${message ? `<div class="message success" role="status">${escapeHtml(message)}</div>` : ''}${shown.length ? shown.map(item => `<article class="admin-card"><div class="notice-meta"><time datetime="${escapeHtml(item.startDate)}">${escapeHtml(item.startDate)}</time><span class="category">${escapeHtml(item.category)}</span>${item.important ? '<span class="priority-tag">重要</span>' : ''}</div><h2>${escapeHtml(item.title)}</h2><p>${statusText(item)}${item.endDate ? ` · 終了 ${escapeHtml(item.endDate)}` : ''}</p><div class="admin-actions"><a href="#admin/edit/${encodeURIComponent(item.id)}">編集</a>${item.published ? `<button type="button" data-action="unpublish" data-id="${escapeHtml(item.id)}">非公開</button>` : ''}<button type="button" class="danger" data-action="delete" data-id="${escapeHtml(item.id)}">削除</button></div></article>`).join('') : `<div class="admin-empty">${tab === 'live' ? '公開中のお知らせはありません。' : '過去・非公開のお知らせはありません。'}</div>`}`);
  }

  function renderAdminForm(item, message = '') {
    const editing = Boolean(item);
    return adminShell(`<div class="admin-top"><h1>${editing ? 'お知らせを編集' : '新規投稿'}</h1><a class="text-link" href="#admin">← 管理トップ</a></div><p class="admin-note">写真は1枚登録できます。保存先はこのブラウザー内のみです。</p>${adminTabs('new')}<form id="notice-form" class="admin-form" data-id="${editing ? escapeHtml(item.id) : ''}">${message ? `<div class="message error" role="alert">${escapeHtml(message)}</div>` : ''}<div class="field"><label for="notice-title">タイトル</label><input id="notice-title" name="title" maxlength="150" required value="${editing ? escapeHtml(item.title) : ''}" placeholder="例：営業時間変更のお知らせ"></div><div class="field"><label for="notice-category">カテゴリー</label><select id="notice-category" name="category">${categories.map(category => `<option value="${category}" ${editing && item.category === category ? 'selected' : ''}>${category}</option>`).join('')}</select></div><div class="field"><label for="notice-body">本文</label><textarea id="notice-body" name="body" maxlength="10000" required placeholder="お知らせの内容を入力してください">${editing ? escapeHtml(item.body) : ''}</textarea></div><div class="field"><label for="notice-photo">写真${editing ? '（変更する場合のみ）' : ''}</label>${editing && safeImage(item.image) ? `<img class="admin-preview" src="${item.image}" alt="現在の写真">` : ''}<input id="notice-photo" name="photo" type="file" accept="image/jpeg,image/png,image/webp" ${editing ? '' : 'required'}><span class="field-help">JPEG・PNG・WebP、8MB以下。保存時に縮小します。</span></div><div class="form-row"><div class="field"><label for="notice-start">公開開始日</label><input id="notice-start" name="startDate" type="date" required value="${editing ? escapeHtml(item.startDate) : todayJapan()}"></div><div class="field"><label for="notice-end">公開終了日（任意）</label><input id="notice-end" name="endDate" type="date" value="${editing ? escapeHtml(item.endDate || '') : ''}"></div></div><label class="check-field"><input type="checkbox" name="important" ${editing && item.important ? 'checked' : ''}>重要なお知らせとして表示</label><label class="check-field"><input type="checkbox" name="published" ${!editing || item.published ? 'checked' : ''}>公開する</label><button class="submit-button" type="submit">${editing ? '変更を保存' : '投稿を保存'}</button></form>`);
  }

  function renderAdmin(route) {
    if (!adminUnlocked) return renderAdminLogin();
    if (route.parts[1] === 'new') return renderAdminForm(null);
    if (route.parts[1] === 'edit') {
      const item = notices.find(notice => notice.id === route.parts[2]);
      return item ? renderAdminForm(item) : adminShell('<div class="page-error"><h1>記事が見つかりません</h1><a class="back-link" href="#admin">← 管理トップへ</a></div>');
    }
    const message = adminFlash;
    adminFlash = '';
    return renderAdminList(route.query.get('tab') === 'past' ? 'past' : 'live', message);
  }

  function render(scroll = true) {
    const route = routeInfo();
    const name = route.parts[0] || 'home';
    document.body.classList.toggle('admin-view', name === 'admin');
    setMenu(false);
    let title = 'ENEOS 交野SS';
    if (name === 'news') { content.innerHTML = route.parts[1] ? renderNewsDetail(route.parts[1]) : renderNews(); title = 'お知らせ'; }
    else if (name === 'services') { content.innerHTML = renderServices(); title = 'サービス'; }
    else if (name === 'access') { content.innerHTML = renderAccess(); title = '店舗・アクセス'; }
    else if (name === 'company') { content.innerHTML = renderCompany(); title = '会社概要'; }
    else if (name === 'admin') { content.innerHTML = renderAdmin(route); title = '交野SS 管理'; }
    else { content.innerHTML = renderHome(); title = '交野SS'; }
    document.title = `${title}｜北村石油株式会社`;
    if (scroll) window.scrollTo({ top: 0, behavior: 'auto' });
  }

  function showFormError(message) {
    const form = document.getElementById('notice-form');
    if (!form) return;
    let box = form.querySelector('.message.error');
    if (!box) { box = document.createElement('div'); box.className = 'message error'; box.setAttribute('role', 'alert'); form.prepend(box); }
    box.textContent = message;
    box.scrollIntoView({ block: 'center' });
  }

  function readAndShrink(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error('写真を読み込めませんでした。'));
      reader.onload = () => {
        const image = new Image();
        image.onerror = () => reject(new Error('画像ファイルを開けませんでした。'));
        image.onload = () => {
          const scale = Math.min(1, 1200 / Math.max(image.width, image.height));
          const canvas = document.createElement('canvas');
          canvas.width = Math.max(1, Math.round(image.width * scale));
          canvas.height = Math.max(1, Math.round(image.height * scale));
          canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL('image/jpeg', 0.74));
        };
        image.src = reader.result;
      };
      reader.readAsDataURL(file);
    });
  }

  content.addEventListener('submit', async event => {
    if (event.target.id === 'admin-login-form') {
      event.preventDefault();
      if (event.target.elements.pin.value === config.demoAdminPin) { adminUnlocked = true; render(false); }
      else content.innerHTML = renderAdminLogin('PINが一致しません。');
      return;
    }
    if (event.target.id !== 'notice-form') return;
    event.preventDefault();
    const form = event.target;
    const data = new FormData(form);
    const id = form.dataset.id;
    const existing = notices.find(item => item.id === id);
    const title = String(data.get('title') || '').trim();
    const body = String(data.get('body') || '').trim();
    const category = String(data.get('category') || '');
    const startDate = String(data.get('startDate') || '');
    const endDate = String(data.get('endDate') || '');
    if (!title || !body || !categories.includes(category) || !/^\d{4}-\d{2}-\d{2}$/.test(startDate) || (endDate && endDate < startDate)) { showFormError('入力内容と公開期間を確認してください。'); return; }
    const photo = data.get('photo');
    let image = existing?.image || '';
    if (photo instanceof File && photo.size) {
      if (photo.size > 8 * 1024 * 1024 || !['image/jpeg', 'image/png', 'image/webp'].includes(photo.type)) { showFormError('写真は8MB以下のJPEG・PNG・WebP形式で選んでください。'); return; }
      try { image = await readAndShrink(photo); } catch (error) { showFormError(error.message); return; }
    }
    if (!image) { showFormError('写真を1枚追加してください。'); return; }
    const item = {
      id: existing?.id || (crypto.randomUUID ? crypto.randomUUID() : `local-${Date.now()}-${Math.random().toString(36).slice(2)}`),
      title, category, body, image, startDate, endDate: endDate || '',
      important: data.get('important') === 'on', published: data.get('published') === 'on',
      createdAt: existing?.createdAt || new Date().toISOString()
    };
    const next = existing ? notices.map(notice => notice.id === existing.id ? item : notice) : [item, ...notices];
    if (!saveNotices(next)) { showFormError('保存できませんでした。ブラウザーの保存容量や設定をご確認ください。'); return; }
    adminFlash = 'お知らせを保存しました。';
    location.hash = '#admin';
  });

  content.addEventListener('click', event => {
    const control = event.target.closest('[data-action]');
    if (!control) return;
    const action = control.dataset.action;
    if (action === 'logout') { adminUnlocked = false; render(false); return; }
    const id = control.dataset.id;
    const item = notices.find(notice => notice.id === id);
    if (!item) return;
    if (action === 'unpublish') {
      if (!saveNotices(notices.map(notice => notice.id === id ? { ...notice, published: false } : notice))) { alert('保存できませんでした。'); return; }
      render(false);
    }
    if (action === 'delete' && confirm('この記事を削除しますか？ この操作は取り消せません。')) {
      if (!saveNotices(notices.filter(notice => notice.id !== id))) { alert('削除できませんでした。'); return; }
      render(false);
    }
  });

  window.addEventListener('hashchange', () => render());
  window.addEventListener('storage', event => {
    if (event.key === storageKey) { notices = loadNotices(); render(false); }
  });
  setInterval(() => {
    const currentDate = todayJapan();
    if (currentDate !== renderedDate) {
      renderedDate = currentDate;
      if (routeInfo().parts[0] !== 'admin') render(false);
    }
  }, 60000);
  render(false);
})();
