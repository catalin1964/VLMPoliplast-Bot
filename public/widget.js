/**
 * VLM Poliplast ChatBot — Widget Embeddabil
 * Adaugă pe orice site cu un singur tag <script>:
 *   <script src="https://web-production-5caa.up.railway.app/widget.js" defer></script>
 */
(function () {
  if (window.__vlmBotLoaded) return;
  window.__vlmBotLoaded = true;

  /* ── Config ── */
  const API_URL  = 'https://web-production-5caa.up.railway.app/chat';
  const LOGO_URL = 'https://vlmpoliplast.ro/wp-content/uploads/2024/06/cropped-vlm-poliplast-rounded-1-270x270.png';
  const BLUE     = '#185FA5';

  /* ══════════════════════════════════════
     1. STILURI — prefix vlmb- pentru izolare
  ══════════════════════════════════════ */
  const css = `
    #vlmb-fab {
      position: fixed; bottom: 28px; right: 28px;
      width: 60px; height: 60px; border-radius: 50%;
      background: ${BLUE}; border: none; cursor: pointer;
      box-shadow: 0 4px 20px rgba(24,95,165,.45);
      display: flex; align-items: center; justify-content: center;
      z-index: 2147483640;
      transition: transform .2s, box-shadow .2s;
      padding: 0;
    }
    #vlmb-fab:hover { transform: scale(1.08); box-shadow: 0 6px 28px rgba(24,95,165,.55); }
    #vlmb-fab img   { width: 40px; height: 40px; border-radius: 50%; display: block; }

    #vlmb-badge {
      position: absolute; top: -3px; right: -3px;
      background: #e53935; color: #fff;
      font-size: 11px; font-weight: 700; font-family: Arial, sans-serif;
      width: 20px; height: 20px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      border: 2px solid #fff;
      transition: opacity .3s, transform .3s;
    }
    #vlmb-badge.vlmb-hidden { opacity: 0; transform: scale(0); pointer-events: none; }

    #vlmb-panel {
      position: fixed; bottom: 100px; right: 28px;
      width: 360px; height: 520px;
      background: #fff; border-radius: 18px;
      box-shadow: 0 8px 48px rgba(0,0,0,.18);
      display: flex; flex-direction: column;
      z-index: 2147483639; overflow: hidden;
      opacity: 0; transform: translateY(20px) scale(.96);
      pointer-events: none;
      transition: opacity .28s ease, transform .28s ease;
      font-family: 'Segoe UI', Arial, sans-serif;
    }
    #vlmb-panel.vlmb-open { opacity: 1; transform: translateY(0) scale(1); pointer-events: all; }

    /* Header */
    #vlmb-header {
      background: linear-gradient(135deg, ${BLUE} 0%, #1a6fc4 100%);
      padding: 14px 16px;
      display: flex; align-items: center; gap: 10px;
      flex-shrink: 0;
    }
    #vlmb-hdr-avatar {
      width: 38px; height: 38px; border-radius: 50%;
      background: rgba(255,255,255,.15);
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0; overflow: hidden;
    }
    #vlmb-hdr-avatar img { width: 38px; height: 38px; border-radius: 50%; object-fit: cover; }
    #vlmb-hdr-info { flex: 1; }
    #vlmb-hdr-name  { color: #fff; font-weight: 700; font-size: 14.5px; }
    #vlmb-hdr-status {
      display: flex; align-items: center; gap: 5px;
      color: rgba(255,255,255,.8); font-size: 11.5px; margin-top: 2px;
    }
    .vlmb-dot {
      width: 7px; height: 7px; background: #4cdf80; border-radius: 50%;
      animation: vlmb-pulse 2s infinite;
    }
    @keyframes vlmb-pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
    #vlmb-close {
      background: none; border: none; cursor: pointer;
      color: rgba(255,255,255,.7); padding: 4px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      transition: background .2s, color .2s;
    }
    #vlmb-close:hover { background: rgba(255,255,255,.15); color: #fff; }
    #vlmb-close svg   { width: 18px; height: 18px; fill: currentColor; }

    /* Quick buttons */
    #vlmb-quick {
      padding: 10px 12px 6px;
      display: flex; flex-wrap: wrap; gap: 6px;
      flex-shrink: 0; border-bottom: 1px solid #f0f4f9;
    }
    .vlmb-qbtn {
      background: #f0f4f9; border: 1px solid #d8e6f5;
      border-radius: 16px; padding: 5px 11px;
      font-size: 12px; color: ${BLUE}; font-weight: 600;
      cursor: pointer; white-space: nowrap;
      transition: background .18s, border-color .18s;
      font-family: inherit;
    }
    .vlmb-qbtn:hover { background: #d8e6f5; border-color: ${BLUE}; }

    /* Messages */
    #vlmb-msgs {
      flex: 1; overflow-y: auto;
      padding: 14px 14px 8px;
      display: flex; flex-direction: column; gap: 10px;
      scroll-behavior: smooth;
    }
    #vlmb-msgs::-webkit-scrollbar { width: 4px; }
    #vlmb-msgs::-webkit-scrollbar-thumb { background: #c8d8ea; border-radius: 4px; }

    .vlmb-msg {
      display: flex; gap: 7px; align-items: flex-end;
      animation: vlmb-in .22s ease;
    }
    @keyframes vlmb-in { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
    .vlmb-msg.vlmb-user { flex-direction: row-reverse; }

    .vlmb-avatar {
      width: 28px; height: 28px; border-radius: 50%;
      flex-shrink: 0; overflow: hidden;
      display: flex; align-items: center; justify-content: center;
      font-size: 11px; font-weight: 700;
    }
    .vlmb-msg.vlmb-bot  .vlmb-avatar { background: transparent; }
    .vlmb-msg.vlmb-user .vlmb-avatar { background: #e0eaf5; color: ${BLUE}; }
    .vlmb-avatar img { width: 28px; height: 28px; border-radius: 50%; object-fit: cover; }

    .vlmb-bubble {
      max-width: 78%; padding: 9px 13px; border-radius: 14px;
      font-size: 13.5px; line-height: 1.55;
    }
    .vlmb-msg.vlmb-bot  .vlmb-bubble {
      background: #f4f8fd; color: #1a2a3a;
      border-bottom-left-radius: 4px; border: 1px solid #e0eaf5;
    }
    .vlmb-msg.vlmb-user .vlmb-bubble {
      background: ${BLUE}; color: #fff;
      border-bottom-right-radius: 4px;
    }

    /* Typing dots */
    .vlmb-dots { display: flex; gap: 4px; padding: 4px 2px; }
    .vlmb-dots span {
      width: 7px; height: 7px; border-radius: 50%; background: ${BLUE};
      animation: vlmb-bounce 1.2s infinite;
    }
    .vlmb-dots span:nth-child(2) { animation-delay: .2s; }
    .vlmb-dots span:nth-child(3) { animation-delay: .4s; }
    @keyframes vlmb-bounce { 0%,80%,100%{transform:translateY(0);opacity:.4} 40%{transform:translateY(-6px);opacity:1} }

    /* Input area */
    #vlmb-input-area {
      padding: 10px 12px 12px;
      border-top: 1px solid #eef2f8;
      display: flex; gap: 8px; align-items: flex-end;
      flex-shrink: 0;
    }
    #vlmb-input {
      flex: 1; border: 1.5px solid #d0dff0; border-radius: 12px;
      padding: 9px 13px; font-size: 13.5px; font-family: inherit;
      resize: none; max-height: 88px; outline: none;
      transition: border-color .2s; line-height: 1.45;
      box-sizing: border-box;
    }
    #vlmb-input:focus { border-color: ${BLUE}; }
    #vlmb-input::placeholder { color: #a0aab8; }

    #vlmb-send {
      width: 38px; height: 38px; border-radius: 10px;
      background: ${BLUE}; border: none; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      transition: background .2s, transform .15s; flex-shrink: 0;
    }
    #vlmb-send:hover { background: #134d8a; transform: scale(1.05); }
    #vlmb-send:disabled { background: #b0c4de; cursor: not-allowed; transform: none; }
    #vlmb-send svg { width: 17px; height: 17px; fill: #fff; }

    @media (max-width: 420px) {
      #vlmb-panel { width: calc(100vw - 20px); right: 10px; bottom: 90px; height: 480px; }
      #vlmb-fab   { bottom: 18px; right: 18px; }
    }
  `;

  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  /* ══════════════════════════════════════
     2. DOM
  ══════════════════════════════════════ */

  // FAB
  const fab = document.createElement('button');
  fab.id = 'vlmb-fab';
  fab.setAttribute('aria-label', 'Deschide asistent VLM Poliplast');
  fab.innerHTML = `
    <div id="vlmb-badge">1</div>
    <img src="${LOGO_URL}" alt="VLM Poliplast">
  `;
  document.body.appendChild(fab);

  // Panel
  const panel = document.createElement('div');
  panel.id = 'vlmb-panel';
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-label', 'Asistent VLM Poliplast');
  panel.innerHTML = `
    <div id="vlmb-header">
      <div id="vlmb-hdr-avatar">
        <img src="${LOGO_URL}" alt="VLM Poliplast">
      </div>
      <div id="vlmb-hdr-info">
        <div id="vlmb-hdr-name">Asistent VLM Poliplast</div>
        <div id="vlmb-hdr-status">
          <div class="vlmb-dot"></div>
          Online · Răspund imediat
        </div>
      </div>
      <button id="vlmb-close" aria-label="Închide">
        <svg viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41
          5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
      </button>
    </div>
    <div id="vlmb-quick">
      <button class="vlmb-qbtn" data-q="Ce tipuri de pungi produceți?">Tipuri de pungi</button>
      <button class="vlmb-qbtn" data-q="Ce folii FFS / flow-pack oferiți?">Folii FFS</button>
      <button class="vlmb-qbtn" data-q="Ce este EcoMonoFilm® și cum respectă PPWR?">EcoMonoFilm® / PPWR</button>
      <button class="vlmb-qbtn" data-q="Vreau să solicit o ofertă de preț.">Cerere ofertă</button>
    </div>
    <div id="vlmb-msgs" aria-live="polite"></div>
    <div id="vlmb-input-area">
      <textarea id="vlmb-input" rows="1" placeholder="Scrieți întrebarea dvs..."></textarea>
      <button id="vlmb-send" aria-label="Trimite">
        <svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
      </button>
    </div>
  `;
  document.body.appendChild(panel);

  /* ══════════════════════════════════════
     3. LOGICĂ
  ══════════════════════════════════════ */
  const badge    = document.getElementById('vlmb-badge');
  const closeBtn = document.getElementById('vlmb-close');
  const msgArea  = document.getElementById('vlmb-msgs');
  const input    = document.getElementById('vlmb-input');
  const sendBtn  = document.getElementById('vlmb-send');

  const messages = [];
  let isOpen = false, isTyping = false, welcomeSent = false;

  function openPanel() {
    isOpen = true;
    panel.classList.add('vlmb-open');
    badge.classList.add('vlmb-hidden');
    input.focus();
    if (!welcomeSent) { addWelcome(); welcomeSent = true; }
  }
  function closePanel() {
    isOpen = false;
    panel.classList.remove('vlmb-open');
  }

  fab.addEventListener('click', () => isOpen ? closePanel() : openPanel());
  closeBtn.addEventListener('click', closePanel);
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && isOpen) closePanel(); });

  function addWelcome() {
    addMsg('bot',
      'Bună ziua! 👋 Sunt asistentul virtual al <strong>VLM Poliplast SRL</strong>.<br>' +
      'Vă pot ajuta cu informații despre ambalaje flexibile, materiale, certificări sau o ofertă personalizată.<br>' +
      'Cum vă pot ajuta astăzi?'
    );
  }

  function addMsg(role, html, isLoading = false) {
    const wrap = document.createElement('div');
    wrap.className = `vlmb-msg vlmb-${role}`;

    const av = document.createElement('div');
    av.className = 'vlmb-avatar';
    if (role === 'bot') {
      av.innerHTML = `<img src="${LOGO_URL}" alt="VLM">`;
    } else {
      av.textContent = 'Tu';
    }

    const bubble = document.createElement('div');
    bubble.className = 'vlmb-bubble';
    if (isLoading) {
      bubble.innerHTML = '<div class="vlmb-dots"><span></span><span></span><span></span></div>';
      wrap.id = 'vlmb-typing';
    } else {
      bubble.innerHTML = html;
    }

    wrap.appendChild(av);
    wrap.appendChild(bubble);
    msgArea.appendChild(wrap);
    msgArea.scrollTop = msgArea.scrollHeight;
    return wrap;
  }

  function removeTyping() {
    const el = document.getElementById('vlmb-typing');
    if (el) el.remove();
  }

  // Quick buttons
  document.querySelectorAll('.vlmb-qbtn').forEach(btn => {
    btn.addEventListener('click', () => {
      input.value = btn.dataset.q;
      sendMessage();
    });
  });

  // Auto-resize textarea
  input.addEventListener('input', () => {
    input.style.height = 'auto';
    input.style.height = Math.min(input.scrollHeight, 88) + 'px';
  });

  // Send on Enter
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  });
  sendBtn.addEventListener('click', sendMessage);

  async function sendMessage() {
    const text = input.value.trim();
    if (!text || isTyping) return;

    addMsg('user', esc(text));
    messages.push({ role: 'user', content: text });

    input.value = '';
    input.style.height = 'auto';
    sendBtn.disabled = true;
    isTyping = true;
    addMsg('bot', '', true);
    msgArea.scrollTop = msgArea.scrollHeight;

    try {
      const res  = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages }),
      });
      const data = await res.json();
      removeTyping();
      const reply = data.reply || 'Îmi pare rău, a apărut o eroare.';
      addMsg('bot', fmt(reply));
      messages.push({ role: 'assistant', content: reply });
    } catch {
      removeTyping();
      addMsg('bot', 'Eroare de conexiune. Contactați <a href="mailto:office@vlmpoliplast.ro" style="color:' + BLUE + '">office@vlmpoliplast.ro</a>.');
    } finally {
      sendBtn.disabled = false;
      isTyping = false;
      input.focus();
    }
  }

  function esc(s) {
    return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }
  function fmt(text) {
    return esc(text)
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/^[-•]\s(.+)/gm, '<li>$1</li>')
      .replace(/(<li>[\s\S]*<\/li>)/, '<ul style="padding-left:18px;margin:6px 0">$1</ul>')
      .replace(/\n/g, '<br>');
  }

})();
