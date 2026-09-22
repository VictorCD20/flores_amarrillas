/* ==========================================================================
   FLORES AMARILLAS - DEDICATORIA PERSONAL (INTERACTIVE SCRIPT)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initPetalCanvas();
  initScrollReveal();
  initSurpriseButton();
  initEditorModal();
  initAudioPlayer();
  initPhotoUploader();
  loadURLParameters();
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

  const petalsCount = 28;
  const petals = [];
  const petalColors = ['#FFD84D', '#F6C900', '#FFF4C4', '#FFEAA5', '#E5B800'];

  for (let i = 0; i < petalsCount; i++) {
    petals.push({
      x: Math.random() * width,
      y: Math.random() * height - height,
      size: Math.random() * 11 + 7,
      speedY: Math.random() * 1.4 + 0.7,
      speedX: Math.random() * 0.7 - 0.35,
      rotation: Math.random() * 360,
      rotationSpeed: Math.random() * 1.8 - 0.9,
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
      p.x += Math.sin(p.y * 0.01) * 0.5 + p.speedX;
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
    threshold: 0.12
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, observerOptions);

  revealElements.forEach(el => observer.observe(el));
}

/* --------------------------------------------------------------------------
   3. SECCIÓN 08 — SORPRESA INTERACTIVA (Una flor por cada sonrisa...)
   -------------------------------------------------------------------------- */
function initSurpriseButton() {
  const btnSurprise = document.getElementById('btn-surprise');
  const surpriseBox = document.getElementById('surprise-box');
  const bloomGarden = document.getElementById('bloom-garden');

  if (!btnSurprise || !surpriseBox || !bloomGarden) return;

  btnSurprise.addEventListener('click', () => {
    surpriseBox.classList.add('active');
    bloomGarden.innerHTML = '';

    const flowers = ['🌼', '🌻', '🌷', '🌼', '☀️', '🌼', '🌻', '✨'];
    
    flowers.forEach((flowerSymbol, index) => {
      setTimeout(() => {
        const flowerEl = document.createElement('span');
        flowerEl.textContent = flowerSymbol;
        flowerEl.style.cssText = `
          display: inline-block;
          transform: scale(0);
          transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        `;
        bloomGarden.appendChild(flowerEl);

        requestAnimationFrame(() => {
          flowerEl.style.transform = 'scale(1.2)';
          setTimeout(() => flowerEl.style.transform = 'scale(1)', 200);
        });
      }, index * 220);
    });

    btnSurprise.style.transform = 'scale(0.95)';
    setTimeout(() => btnSurprise.style.transform = 'scale(1)', 150);
  });
}

/* --------------------------------------------------------------------------
   4. EDITOR MODAL & PERSONALIZACIÓN DE DEDICATORIA
   -------------------------------------------------------------------------- */
function initEditorModal() {
  const modal = document.getElementById('editor-modal');
  const btnOpen = document.getElementById('open-editor-btn');
  const btnClose = document.getElementById('close-editor-btn');
  const btnCloseX = document.getElementById('close-modal-x');
  const btnSave = document.getElementById('save-editor-btn');

  const inputRecipient = document.getElementById('edit-recipient');
  const inputSender = document.getElementById('edit-sender');
  const inputLetter = document.getElementById('edit-letter');

  if (btnOpen && modal) {
    btnOpen.addEventListener('click', () => modal.classList.add('active'));
  }

  // Open modal if URL has ?edit=true or ?editar=true
  const urlParams = new URLSearchParams(window.location.search);
  if ((urlParams.has('edit') || urlParams.has('editar')) && modal) {
    modal.classList.add('active');
  }

  const closeModal = () => modal.classList.remove('active');
  if (btnClose) btnClose.addEventListener('click', closeModal);
  if (btnCloseX) btnCloseX.addEventListener('click', closeModal);
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  if (btnSave) {
    btnSave.addEventListener('click', () => {
      const recipient = inputRecipient.value.trim() || 'ti';
      const sender = inputSender.value.trim();
      const letterText = inputLetter.value.trim();

      updateDedicationUI(recipient, sender, letterText);

      // Save to URL search params
      const url = new URL(window.location.href);
      url.searchParams.set('para', recipient);
      if (sender) url.searchParams.set('de', sender);
      if (letterText) url.searchParams.set('carta', letterText);

      window.history.replaceState({}, '', url);

      closeModal();
      showToast('✨ ¡Dedicatoria actualizada!');
    });
  }
}

function updateDedicationUI(recipient, sender, letterText) {
  const headerTag = document.getElementById('header-to-tag');
  const letterSalutation = document.getElementById('letter-salutation');
  const signatureDisplay = document.getElementById('signature-name-display');
  const letterBody = document.getElementById('letter-content-body');

  if (headerTag && recipient && recipient !== 'ti') {
    headerTag.innerHTML = `Para <span>${escapeHTML(recipient)}</span>`;
  }
  if (letterSalutation) {
    letterSalutation.textContent = recipient && recipient !== 'ti' ? `Para ${recipient}:` : 'Para ti:';
  }
  if (signatureDisplay) {
    if (sender) {
      signatureDisplay.textContent = sender;
      signatureDisplay.style.display = 'block';
    } else {
      signatureDisplay.style.display = 'none';
    }
  }
  if (letterText && letterBody) {
    // Split text into paragraphs
    const paragraphs = letterText.split('\n\n').filter(p => p.trim());
    letterBody.innerHTML = paragraphs.map(p => `<p>${escapeHTML(p)}</p>`).join('');
  }
}

function loadURLParameters() {
  const urlParams = new URLSearchParams(window.location.search);
  const para = urlParams.get('para');
  const de = urlParams.get('de');
  const carta = urlParams.get('carta');

  if (para || de || carta) {
    updateDedicationUI(para || 'ti', de || '[Tu nombre]', carta);
  }
}

/* --------------------------------------------------------------------------
   5. PHOTO UPLOADER FOR POLAROID FRAME
   -------------------------------------------------------------------------- */
function initPhotoUploader() {
  const fileInput = document.getElementById('edit-photo-input');
  const polaroidImg = document.getElementById('polaroid-img');
  const polaroidBox = document.getElementById('polaroid-box');
  const placeholder = document.getElementById('polaroid-placeholder');

  if (fileInput && polaroidImg) {
    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          polaroidImg.src = event.target.result;
          polaroidImg.style.display = 'block';
          if (placeholder) placeholder.style.display = 'none';
        };
        reader.readAsDataURL(file);
      }
    });
  }
}

/* --------------------------------------------------------------------------
   6. SHARE GIFT LINK & TOAST NOTIFICATION
   -------------------------------------------------------------------------- */
window.copyGiftLink = function() {
  navigator.clipboard.writeText(window.location.href).then(() => {
    showToast('✨ Enlace de dedicatoria copiado. ¡Mándalo a tu persona especial!');
  }).catch(() => {
    showToast('Flores amarillas listas para regalar 🌼');
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
      text-align: center;
      max-width: 90%;
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
   7. AMBIENT AUDIO PLAYER (Web Audio API Synthesizer)
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
      playAmbientNotes();
    } else {
      btn.innerHTML = '♫ <span>Escuchar</span>';
      if (audioTimer) clearInterval(audioTimer);
    }
  });
}

function playAmbientNotes() {
  // Delicate warm acoustic frequencies
  const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 523.25, 392.00, 329.63];
  let noteIdx = 0;

  audioTimer = setInterval(() => {
    if (!isPlayingAudio || !audioCtx) return;

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(notes[noteIdx % notes.length], audioCtx.currentTime);

    gain.gain.setValueAtTime(0, audioCtx.currentTime);
    gain.gain.linearRampToValueAtTime(0.035, audioCtx.currentTime + 0.25);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 2.8);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 2.9);

    noteIdx++;
  }, 950);
}

function escapeHTML(str) {
  return str.replace(/[&<>'"]/g, 
    tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag)
  );
}
