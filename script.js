/* ==========================================================================
   FLORES AMARILLAS - INTERACTIVE SCRIPT
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initPetalCanvas();
  initScrollReveal();
  initLetterCustomizer();
  initAudioPlayer();
  initGardenInteractions();
  checkURLParameters();
});

/* --------------------------------------------------------------------------
   1. PETAL CANVAS ANIMATION (HTML5 Canvas falling golden/yellow petals)
   -------------------------------------------------------------------------- */
function initPetalCanvas() {
  const canvas = document.getElementById('petals-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const petalsCount = 32;
  const petals = [];

  const petalColors = ['#FFD84D', '#F6C900', '#FFF4C4', '#FFEAA5', '#E5B800'];

  for (let i = 0; i < petalsCount; i++) {
    petals.push({
      x: Math.random() * width,
      y: Math.random() * height - height,
      size: Math.random() * 12 + 8,
      speedY: Math.random() * 1.5 + 0.8,
      speedX: Math.random() * 0.8 - 0.4,
      rotation: Math.random() * 360,
      rotationSpeed: Math.random() * 2 - 1,
      color: petalColors[Math.floor(Math.random() * petalColors.length)],
      opacity: Math.random() * 0.5 + 0.4
    });
  }

  function drawPetal(p) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate((p.rotation * Math.PI) / 180);
    ctx.globalAlpha = p.opacity;
    ctx.fillStyle = p.color;

    // Organic petal shape formula
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(-p.size / 2, -p.size, -p.size, p.size / 3, 0, p.size);
    ctx.bezierCurveTo(p.size, p.size / 3, p.size / 2, -p.size, 0, 0);
    ctx.fill();

    ctx.restore();
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    petals.forEach(p => {
      p.y += p.speedY;
      p.x += Math.sin(p.y * 0.01) * 0.6 + p.speedX;
      p.rotation += p.rotationSpeed;

      if (p.y > height + 20) {
        p.y = -20;
        p.x = Math.random() * width;
      }

      drawPetal(p);
    });

    requestAnimationFrame(render);
  }

  render();
}

/* --------------------------------------------------------------------------
   2. SCROLL REVEAL ANIMATION (IntersectionObserver)
   -------------------------------------------------------------------------- */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal');

  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, observerOptions);

  revealElements.forEach(el => observer.observe(el));
}

/* --------------------------------------------------------------------------
   3. LETTER CUSTOMIZER & DEDICATION MODAL
   -------------------------------------------------------------------------- */
function initLetterCustomizer() {
  const modal = document.getElementById('customize-modal');
  const btnOpen = document.getElementById('open-modal-btn');
  const btnClose = document.getElementById('close-modal-btn');
  const btnSave = document.getElementById('save-letter-btn');

  const recipientInput = document.getElementById('input-recipient');
  const messageInput = document.getElementById('input-message');
  const senderInput = document.getElementById('input-sender');

  const recipientDisplay = document.getElementById('letter-recipient-display');
  const messageDisplay = document.getElementById('letter-message-display');
  const senderDisplay = document.getElementById('letter-sender-display');

  if (btnOpen && modal) {
    btnOpen.addEventListener('click', () => {
      modal.classList.add('active');
    });
  }

  if (btnClose && modal) {
    btnClose.addEventListener('click', () => {
      modal.classList.remove('active');
    });
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('active');
    });
  }

  if (btnSave) {
    btnSave.addEventListener('click', () => {
      const recipient = recipientInput.value.trim() || 'ti';
      const message = messageInput.value.trim() || 'Hoy quería regalarte algo diferente...';
      const sender = senderInput.value.trim() || 'Con cariño';

      if (recipientDisplay) recipientDisplay.textContent = `Para ${recipient}.`;
      if (messageDisplay) messageDisplay.textContent = `“${message}”`;
      if (senderDisplay) senderDisplay.textContent = `— ${sender}`;

      modal.classList.remove('active');

      // Update URL parameters for sharing
      const url = new URL(window.location.href);
      url.searchParams.set('para', recipient);
      url.searchParams.set('mensaje', message);
      url.searchParams.set('de', sender);
      window.history.replaceState({}, '', url);

      showToast('¡Carta actualizada y lista para compartir!');
    });
  }
}

function checkURLParameters() {
  const urlParams = new URLSearchParams(window.location.search);
  const para = urlParams.get('para');
  const mensaje = urlParams.get('mensaje');
  const de = urlParams.get('de');

  const recipientDisplay = document.getElementById('letter-recipient-display');
  const messageDisplay = document.getElementById('letter-message-display');
  const senderDisplay = document.getElementById('letter-sender-display');

  if (para && recipientDisplay) recipientDisplay.textContent = `Para ${para}.`;
  if (mensaje && messageDisplay) messageDisplay.textContent = `“${mensaje}”`;
  if (de && senderDisplay) senderDisplay.textContent = `— ${de}`;
}

/* --------------------------------------------------------------------------
   4. COPY SHARE LINK & EXTRA EFFECTS
   -------------------------------------------------------------------------- */
window.copyShareLink = function() {
  navigator.clipboard.writeText(window.location.href).then(() => {
    showToast('✨ Enlace copiado al portapapeles. ¡Mándalo a tu persona especial!');
  }).catch(() => {
    showToast('Flores listas para regalar 🌼');
  });
};

function showToast(message) {
  let toast = document.getElementById('custom-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'custom-toast';
    toast.style.cssText = `
      position: fixed;
      bottom: 2rem;
      left: 50%;
      transform: translateX(-50%) translateY(100px);
      background: #222018;
      color: #FFFEFA;
      padding: 0.9rem 1.8rem;
      border-radius: 50px;
      font-size: 0.95rem;
      font-weight: 500;
      box-shadow: 0 10px 30px rgba(0,0,0,0.25);
      z-index: 9999;
      transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
      border: 1px solid #FFD84D;
    `;
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.style.transform = 'translateX(-50%) translateY(0)';

  setTimeout(() => {
    toast.style.transform = 'translateX(-50%) translateY(100px)';
  }, 3500);
}

/* --------------------------------------------------------------------------
   5. AMBIENT AUDIO PLAYER (Web Audio API Synthesizer)
   -------------------------------------------------------------------------- */
let audioCtx = null;
let isPlayingAudio = false;
let audioTimer = null;

function initAudioPlayer() {
  const btn = document.getElementById('audio-toggle-btn');
  if (!btn) return;

  btn.addEventListener('click', () => {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }

    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    isPlayingAudio = !isPlayingAudio;

    if (isPlayingAudio) {
      btn.innerHTML = '🔊 <span>Música Entorno</span>';
      playAmbientArpeggio();
    } else {
      btn.innerHTML = '🎵 <span>Música Entorno</span>';
      if (audioTimer) clearInterval(audioTimer);
    }
  });
}

function playAmbientArpeggio() {
  // Harmonic warm frequencies inspired by warm sunlight (F Major 9 / C Major 9)
  const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 523.25, 392.00, 329.63];
  let noteIdx = 0;

  audioTimer = setInterval(() => {
    if (!isPlayingAudio || !audioCtx) return;

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(notes[noteIdx % notes.length], audioCtx.currentTime);

    gain.gain.setValueAtTime(0, audioCtx.currentTime);
    gain.gain.linearRampToValueAtTime(0.04, audioCtx.currentTime + 0.2);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 2.5);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 2.6);

    noteIdx++;
  }, 900);
}

/* --------------------------------------------------------------------------
   6. GARDEN INTERACTION EFFECTS
   -------------------------------------------------------------------------- */
function initGardenInteractions() {
  const cards = document.querySelectorAll('.flower-card');
  cards.forEach(card => {
    card.addEventListener('click', () => {
      const flowerName = card.querySelector('.flower-name')?.textContent || 'esta flor';
      showToast(`✨ Escogiste ${flowerName} para tu jardín.`);
    });
  });
}
