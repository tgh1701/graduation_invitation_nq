// ============================================
// CONFIGURATION
// ============================================
const GRADUATION_DATE = new Date('2026-10-15T08:00:00+07:00');
const GRADUATE_NAME = 'Vũ Thị Ngọc Quỳnh';

// CLOUD DATABASE API (Google Sheets hoặc Firebase)
// Khi dán link Web App Google Sheets vào đây, lời chúc sẽ được lưu trực tuyến
// và tất cả mọi người mở website đều nhìn thấy lời chúc của nhau!
// Xem hướng dẫn chi tiết tại HUONG_DAN_DEPLOY_VA_DATABASE.md
const CLOUD_API_URL = '';

// ============================================
// STATE
// ============================================
let musicPlaying = false;
let audioContext = null;
let confettiParticles = [];
let confettiAnimFrame = null;
let cameraStream = null;
let currentSticker = 'classic';

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    createEnvelopeParticles();
    createFloatingCaps();
    setupConfettiCanvas();
    startCountdown();
    loadWishes();
    setupScrollReveal();
    setupScrollToTop();
    setupFireworks();
});

// ============================================
// ENVELOPE OPENING
// ============================================
function openEnvelope() {
    const envelope = document.querySelector('.envelope');
    if (envelope.classList.contains('opened')) return;

    envelope.classList.add('opened');

    // After card slides out, transition to main content
    setTimeout(() => {
        launchConfetti();
        playWinSound();
    }, 800);

    setTimeout(() => {
        const screen = document.getElementById('envelopeScreen');
        screen.classList.add('hidden');

        const main = document.getElementById('mainContent');
        main.classList.remove('main-hidden');

        // Show music toggle
        document.getElementById('musicToggle').classList.add('visible');

        // Trigger hero reveal
        setTimeout(() => {
            document.querySelectorAll('.hero .reveal').forEach(el => {
                el.classList.add('visible');
            });
        }, 300);

        // Toss graduation caps
        setTimeout(tossGraduationCaps, 500);
    }, 2000);
}

function createEnvelopeParticles() {
    const container = document.getElementById('envelopeParticles');
    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.className = 'envelope-particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDuration = (2 + Math.random() * 3) + 's';
        particle.style.animationDelay = Math.random() * 4 + 's';
        particle.style.width = (2 + Math.random() * 4) + 'px';
        particle.style.height = particle.style.width;
        container.appendChild(particle);
    }
}

// ============================================
// GRADUATION CAP TOSS ANIMATION
// ============================================
function tossGraduationCaps() {
    const canvas = document.getElementById('confettiCanvas');
    const ctx = canvas.getContext('2d');

    const caps = [];
    const capEmojis = ['🎓', '🎓', '🎓', '⭐', '✨', '🌟', '🎉', '🎊', '💫'];

    for (let i = 0; i < 25; i++) {
        caps.push({
            x: Math.random() * canvas.width,
            y: canvas.height + 50,
            vx: (Math.random() - 0.5) * 8,
            vy: -(12 + Math.random() * 10),
            gravity: 0.2 + Math.random() * 0.1,
            rotation: Math.random() * 360,
            rotationSpeed: (Math.random() - 0.5) * 8,
            emoji: capEmojis[Math.floor(Math.random() * capEmojis.length)],
            size: 16 + Math.random() * 20,
            opacity: 1,
        });
    }

    function animateCaps() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let alive = false;

        caps.forEach(cap => {
            cap.vy += cap.gravity;
            cap.x += cap.vx;
            cap.y += cap.vy;
            cap.rotation += cap.rotationSpeed;

            if (cap.y > canvas.height + 50) {
                cap.opacity -= 0.05;
            }

            if (cap.opacity > 0) {
                alive = true;
                ctx.save();
                ctx.translate(cap.x, cap.y);
                ctx.rotate((cap.rotation * Math.PI) / 180);
                ctx.globalAlpha = Math.max(0, cap.opacity);
                ctx.font = `${cap.size}px serif`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(cap.emoji, 0, 0);
                ctx.restore();
            }
        });

        if (alive) {
            requestAnimationFrame(animateCaps);
        }
    }

    animateCaps();
}

// ============================================
// FLOATING CAPS (BACKGROUND)
// ============================================
function createFloatingCaps() {
    const container = document.getElementById('floatingCaps');
    const items = ['🎓', '⭐', '📚', '✨', '🎓', '💫', '📖'];

    for (let i = 0; i < 10; i++) {
        const cap = document.createElement('div');
        cap.className = 'floating-cap';
        cap.textContent = items[Math.floor(Math.random() * items.length)];
        cap.style.left = Math.random() * 100 + '%';
        cap.style.fontSize = (1 + Math.random() * 1.5) + 'rem';
        cap.style.animationDuration = (15 + Math.random() * 20) + 's';
        cap.style.animationDelay = Math.random() * 20 + 's';
        container.appendChild(cap);
    }
}

// ============================================
// CONFETTI
// ============================================
function setupConfettiCanvas() {
    const canvas = document.getElementById('confettiCanvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

function launchConfetti() {
    const canvas = document.getElementById('confettiCanvas');
    const ctx = canvas.getContext('2d');
    confettiParticles = [];

    const colors = ['#d4af37', '#f5d769', '#e8a0bf', '#7eb8da', '#ffffff', '#ffd700', '#c9a84c'];

    for (let i = 0; i < 120; i++) {
        confettiParticles.push({
            x: canvas.width / 2 + (Math.random() - 0.5) * 300,
            y: canvas.height / 2,
            vx: (Math.random() - 0.5) * 18,
            vy: -Math.random() * 22 - 5,
            color: colors[Math.floor(Math.random() * colors.length)],
            size: Math.random() * 8 + 3,
            rotation: Math.random() * 360,
            rotationSpeed: (Math.random() - 0.5) * 12,
            gravity: 0.25 + Math.random() * 0.15,
            opacity: 1,
            shape: Math.random() > 0.5 ? 'rect' : 'circle',
        });
    }

    function animateConfetti() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let alive = false;

        confettiParticles.forEach(p => {
            p.x += p.vx;
            p.vy += p.gravity;
            p.y += p.vy;
            p.rotation += p.rotationSpeed;
            p.opacity -= 0.006;
            p.vx *= 0.99;

            if (p.opacity > 0) {
                alive = true;
                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate((p.rotation * Math.PI) / 180);
                ctx.globalAlpha = Math.max(0, p.opacity);
                ctx.fillStyle = p.color;

                if (p.shape === 'rect') {
                    ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size * 0.5);
                } else {
                    ctx.beginPath();
                    ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
                    ctx.fill();
                }

                ctx.restore();
            }
        });

        if (alive) {
            confettiAnimFrame = requestAnimationFrame(animateConfetti);
        }
    }

    if (confettiAnimFrame) cancelAnimationFrame(confettiAnimFrame);
    animateConfetti();
}

// ============================================
// COUNTDOWN TIMER
// ============================================
function startCountdown() {
    function update() {
        const now = new Date();
        const diff = GRADUATION_DATE - now;

        if (diff <= 0) {
            document.getElementById('countDays').textContent = '🎉';
            document.getElementById('countHours').textContent = '🎓';
            document.getElementById('countMinutes').textContent = '🥳';
            document.getElementById('countSeconds').textContent = '💕';
            return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        document.getElementById('countDays').textContent = String(days).padStart(2, '0');
        document.getElementById('countHours').textContent = String(hours).padStart(2, '0');
        document.getElementById('countMinutes').textContent = String(minutes).padStart(2, '0');
        document.getElementById('countSeconds').textContent = String(seconds).padStart(2, '0');
    }

    update();
    setInterval(update, 1000);
}

// ============================================
// SCROLL REVEAL
// ============================================
function setupScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    // Observe all elements except hero (hero is triggered manually)
    document.querySelectorAll('.reveal:not(.hero .reveal)').forEach(el => {
        observer.observe(el);
    });
}

// ============================================
// SCROLL TO TOP
// ============================================
function setupScrollToTop() {
    const btn = document.getElementById('scrollTopBtn');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 600) {
            btn.classList.add('visible');
        } else {
            btn.classList.remove('visible');
        }
    });
}

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ============================================
// RSVP FORM (WITH INTEGRATED PHOTO BOOTH)
// ============================================
let hasAttachedPhoto = false;

function submitRSVP(event) {
    event.preventDefault();

    const name = document.getElementById('guestName').value.trim();
    const relation = document.getElementById('guestRelation').value;
    const attendance = document.querySelector('input[name="attendance"]:checked').value;
    const wish = document.getElementById('guestWish').value.trim();

    if (!name) {
        showToast('⚠️', 'Vui lòng nhập họ tên!');
        return;
    }

    let photoData = null;
    if (hasAttachedPhoto) {
        const canvas = document.getElementById('photoCanvas');
        if (canvas) {
            photoData = compressPhoto(canvas, 320);
        }
    }

    // Save to localStorage
    const wishes = JSON.parse(localStorage.getItem('graduation_wishes') || '[]');
    const newWish = {
        id: Date.now(),
        name,
        relation,
        attendance,
        wish: wish || (hasAttachedPhoto ? 'Chúc mừng tốt nghiệp Quỳnh nhé! 📸🎉' : 'Chúc mừng tốt nghiệp! 🎉'),
        photo: photoData,
        timestamp: new Date().toISOString(),
    };

    wishes.unshift(newWish);

    try {
        localStorage.setItem('graduation_wishes', JSON.stringify(wishes));
    } catch (e) {
        if (photoData) {
            const canvas = document.getElementById('photoCanvas');
            newWish.photo = compressPhoto(canvas, 220);
            wishes[0] = newWish;
            try {
                localStorage.setItem('graduation_wishes', JSON.stringify(wishes));
            } catch (e2) {
                showToast('⚠️', 'Bộ nhớ đầy, chỉ lưu được lời chúc không kèm ảnh.');
                delete newWish.photo;
                wishes[0] = newWish;
                localStorage.setItem('graduation_wishes', JSON.stringify(wishes));
            }
        }
    }

    // Sync to Online Cloud Database if configured
    if (CLOUD_API_URL) {
        syncWishToCloud(newWish);
    }

    // Reset form & attached photo
    document.getElementById('rsvpForm').reset();
    resetAttachedPhotoState();

    // Show success feedback
    const attendText = attendance === 'yes' ? 'Đã xác nhận tham dự!' : 'Đã ghi nhận!';
    showToast('🎉', `Cảm ơn ${name}! ${attendText}`);

    // Reload wishes & confetti
    loadWishes();
    launchConfetti();

    // Scroll to wishes section
    setTimeout(() => {
        const wishesEl = document.getElementById('wishes');
        if (wishesEl) wishesEl.scrollIntoView({ behavior: 'smooth' });
    }, 600);
}

function syncWishToCloud(newWish) {
    if (!CLOUD_API_URL) return;
    try {
        fetch(CLOUD_API_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify(newWish)
        }).then(() => {
            console.log('Synced wish to cloud successfully');
        }).catch(err => console.warn('Cloud sync error:', err));
    } catch (e) {
        console.warn('Sync wish failed:', e);
    }
}

function resetAttachedPhotoState() {
    hasAttachedPhoto = false;
    const emptyHint = document.getElementById('photoStatusEmpty');
    const attachedBox = document.getElementById('photoStatusAttached');
    const submitBtnText = document.getElementById('submitBtnText');
    if (emptyHint) emptyHint.style.display = 'flex';
    if (attachedBox) attachedBox.style.display = 'none';
    if (submitBtnText) submitBtnText.textContent = '💐 Gửi Xác Nhận & Lời Chúc';
}

function removeAttachedPhoto() {
    resetAttachedPhotoState();
    retakePhoto();
    showToast('ℹ️', 'Đã bỏ đính kèm ảnh.');
}

// ============================================
// WISHES BOARD
// ============================================
async function loadWishes() {
    let wishes = JSON.parse(localStorage.getItem('graduation_wishes') || '[]');

    // Render immediately from local cache
    renderWishCards(wishes);

    // If online database is configured, fetch latest from cloud in background
    if (CLOUD_API_URL) {
        try {
            const res = await fetch(CLOUD_API_URL);
            if (res.ok) {
                const cloudWishes = await res.json();
                if (Array.isArray(cloudWishes) && cloudWishes.length > 0) {
                    wishes = cloudWishes;
                    localStorage.setItem('graduation_wishes', JSON.stringify(wishes));
                    renderWishCards(wishes);
                }
            }
        } catch (e) {
            console.log('Using local offline wishes:', e);
        }
    }
}

async function manualRefreshWishes() {
    const btn = document.getElementById('btnRefreshWishes');
    if (btn) btn.classList.add('spinning');
    await loadWishes();
    setTimeout(() => {
        if (btn) btn.classList.remove('spinning');
        showToast('✨', 'Đã cập nhật danh sách lời chúc mới nhất!');
    }, 600);
}

// Auto refresh wishes every 35s if CLOUD_API_URL is configured
setInterval(() => {
    if (CLOUD_API_URL && !document.hidden) {
        loadWishes();
    }
}, 35000);

function renderWishCards(wishes) {
    const grid = document.getElementById('wishesGrid');
    const noWishes = document.getElementById('noWishes');
    if (!grid) return;

    grid.innerHTML = '';

    if (!wishes || wishes.length === 0) {
        if (noWishes) noWishes.classList.remove('hidden');
        return;
    }

    if (noWishes) noWishes.classList.add('hidden');

    wishes.forEach(wish => {
        const card = document.createElement('div');
        card.className = 'wish-card';

        const initial = wish.name.charAt(0).toUpperCase();
        const attendClass = wish.attendance === 'yes' ? 'attending' : 'not-attending';
        const attendText = wish.attendance === 'yes' ? '✅ Sẽ tham dự' : '❌ Không thể tham dự';

        // Photo section (if exists)
        const photoHtml = wish.photo 
            ? `<div class="wish-photo" onclick="openLightbox('${wish.photo}')">
                    <img src="${wish.photo}" alt="Photo Booth" />
               </div>`
            : '';

        const photoBadge = wish.photo 
            ? '<span class="wish-photo-badge">📸 Photo Booth</span>'
            : '';

        card.innerHTML = `
            <div class="wish-header">
                <div class="wish-avatar">${initial}</div>
                <div class="wish-info">
                    <span class="wish-name">${escapeHtml(wish.name)}</span>
                    <span class="wish-relation">${escapeHtml(wish.relation)}</span>
                </div>
            </div>
            ${photoHtml}
            <p class="wish-text">"${escapeHtml(wish.wish)}"</p>
            <span class="wish-attendance ${attendClass}">${attendText}</span>
            ${photoBadge}
        `;

        grid.appendChild(card);
    });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ============================================
// TOAST NOTIFICATION
// ============================================
function showToast(icon, text) {
    const toast = document.getElementById('toast');
    document.getElementById('toastIcon').textContent = icon;
    document.getElementById('toastText').textContent = text;

    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3500);
}

// ============================================
// MUSIC - Graduation March (Pomp and Circumstance)
// ============================================
function toggleMusic() {
    if (musicPlaying) {
        stopMusic();
    } else {
        playGraduationMarch();
    }
}

function playGraduationMarch() {
    try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        musicPlaying = true;
        document.getElementById('musicIcon').textContent = '🔊';

        // Simplified "Pomp and Circumstance" melody
        // Key of D major, simplified for Web Audio
        const bpm = 100;
        const beatDuration = 60 / bpm;

        // Melody: notes as [frequency, beats]
        const melody = [
            // Bar 1-2: Opening theme
            [293.66, 2], // D4
            [329.63, 1], // E4
            [369.99, 2], // F#4
            [392.00, 1], // G4
            // Bar 3-4
            [440.00, 3], // A4
            [392.00, 1], // G4
            [369.99, 1], // F#4
            [329.63, 1], // E4
            // Bar 5-6
            [293.66, 2], // D4
            [329.63, 1], // E4
            [369.99, 3], // F#4
            // Bar 7-8
            [329.63, 2], // E4
            [293.66, 1], // D4
            [329.63, 3], // E4
            // Bar 9-10: Second phrase
            [293.66, 2], // D4
            [329.63, 1], // E4
            [369.99, 2], // F#4
            [392.00, 1], // G4
            // Bar 11-12
            [440.00, 3], // A4
            [493.88, 1], // B4
            [440.00, 1], // A4
            [392.00, 1], // G4
            // Bar 13-14
            [369.99, 2], // F#4
            [392.00, 1], // G4
            [440.00, 2], // A4
            [369.99, 1], // F#4
            // Bar 15-16: Resolution
            [293.66, 4], // D4 (held)
            [0, 2], // Rest
        ];

        let currentTime = audioContext.currentTime + 0.1;

        // Play each note
        melody.forEach(([freq, beats]) => {
            if (freq > 0) {
                const osc = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                const duration = beats * beatDuration;

                osc.connect(gainNode);
                gainNode.connect(audioContext.destination);

                // Use a softer waveform
                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, currentTime);

                // Smooth envelope
                gainNode.gain.setValueAtTime(0, currentTime);
                gainNode.gain.linearRampToValueAtTime(0.12, currentTime + 0.05);
                gainNode.gain.setValueAtTime(0.12, currentTime + duration - 0.08);
                gainNode.gain.linearRampToValueAtTime(0, currentTime + duration);

                osc.start(currentTime);
                osc.stop(currentTime + duration);

                // Add harmony (3rd above, softer)
                const harmOsc = audioContext.createOscillator();
                const harmGain = audioContext.createGain();
                harmOsc.connect(harmGain);
                harmGain.connect(audioContext.destination);
                harmOsc.type = 'sine';
                harmOsc.frequency.setValueAtTime(freq * 1.25, currentTime); // Major 3rd
                harmGain.gain.setValueAtTime(0, currentTime);
                harmGain.gain.linearRampToValueAtTime(0.04, currentTime + 0.05);
                harmGain.gain.setValueAtTime(0.04, currentTime + duration - 0.08);
                harmGain.gain.linearRampToValueAtTime(0, currentTime + duration);
                harmOsc.start(currentTime);
                harmOsc.stop(currentTime + duration);
            }

            currentTime += beats * beatDuration;
        });

        // Auto-stop after melody ends
        const totalDuration = melody.reduce((sum, [, beats]) => sum + beats, 0) * beatDuration;
        setTimeout(() => {
            if (musicPlaying) {
                // Loop: replay
                playGraduationMarch();
            }
        }, totalDuration * 1000 + 500);

    } catch (e) {
        showToast('⚠️', 'Không thể phát nhạc trên trình duyệt này');
    }
}

function stopMusic() {
    musicPlaying = false;
    document.getElementById('musicIcon').textContent = '🔇';
    if (audioContext) {
        audioContext.close();
        audioContext = null;
    }
}

// ============================================
// CELEBRATION SOUND
// ============================================
function playWinSound() {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6

        notes.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.frequency.value = freq;
            osc.type = 'sine';
            gain.gain.setValueAtTime(0.08, ctx.currentTime + i * 0.12);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.12 + 0.4);
            osc.start(ctx.currentTime + i * 0.12);
            osc.stop(ctx.currentTime + i * 0.12 + 0.4);
        });
    } catch (e) {
        // Audio not supported
    }
}

// ============================================
// SHARE FUNCTIONS
// ============================================
function shareOn(platform) {
    const rawUrl = window.location.href;
    const isLocal = window.location.protocol === 'file:' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const publicUrl = isLocal ? 'https://vimaru.edu.vn' : rawUrl;
    const shareText = `🎓 Trân trọng kính mời bạn đến dự Lễ Tốt Nghiệp Thạc Sĩ Quản lí Kinh tế của ${GRADUATE_NAME} tại Đại học Hàng Hải Việt Nam! 🎉`;

    if (platform === 'native') {
        if (navigator.share) {
            navigator.share({
                title: `Lễ Tốt Nghiệp Thạc Sĩ - ${GRADUATE_NAME}`,
                text: shareText,
                url: isLocal ? publicUrl : rawUrl,
            }).catch(() => {});
            return;
        } else {
            copyLink();
            return;
        }
    }

    if (platform === 'facebook') {
        if (isLocal) {
            copyTextToClipboard(`${shareText}\n${rawUrl}`);
            showToast('📋', 'Đã copy lời mời! (Khi tải web lên mạng, Facebook sẽ tự load thiệp)');
            window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(publicUrl)}&quote=${encodeURIComponent(shareText)}`, '_blank', 'width=620,height=520');
        } else {
            window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(rawUrl)}&quote=${encodeURIComponent(shareText)}`, '_blank', 'width=620,height=520');
        }
    } else if (platform === 'messenger') {
        copyTextToClipboard(`${shareText}\n${rawUrl}`);
        showToast('💬', 'Đã sao chép lời mời! Bạn có thể dán ngay vào Messenger.');

        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        if (isMobile) {
            window.location.href = `fb-messenger://share?link=${encodeURIComponent(isLocal ? publicUrl : rawUrl)}`;
        } else {
            window.open('https://www.messenger.com', '_blank');
        }
    }
}

function copyTextToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).catch(() => {});
    } else {
        const input = document.createElement('textarea');
        input.value = text;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
    }
}

function copyLink() {
    navigator.clipboard.writeText(window.location.href).then(() => {
        showToast('🔗', 'Đã sao chép liên kết!');
    }).catch(() => {
        // Fallback
        const input = document.createElement('input');
        input.value = window.location.href;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
        showToast('🔗', 'Đã sao chép liên kết!');
    });
}

// ============================================
// FIREWORKS ON CLICK
// ============================================
function setupFireworks() {
    document.addEventListener('click', (e) => {
        // Don't fire on buttons, inputs, or interactive elements
        const tag = e.target.tagName.toLowerCase();
        const isInteractive = e.target.closest('button, a, input, textarea, select, form, .envelope-container, .photobooth-controls, .sticker-selector');
        if (isInteractive) return;

        createFireworkBurst(e.clientX, e.clientY);
    });
}

function createFireworkBurst(x, y) {
    const burst = document.createElement('div');
    burst.className = 'firework-burst';
    burst.style.left = x + 'px';
    burst.style.top = y + 'px';

    const colors = ['#d4af37', '#f5d769', '#e8a0bf', '#7eb8da', '#ff6b9d', '#ffffff', '#ffd700'];
    const particleCount = 20 + Math.floor(Math.random() * 15);

    // Create expanding ring
    const ring = document.createElement('div');
    ring.className = 'firework-ring';
    ring.style.width = '80px';
    ring.style.height = '80px';
    ring.style.borderColor = colors[Math.floor(Math.random() * colors.length)];
    burst.appendChild(ring);

    // Create particles
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'firework-particle';

        const angle = (i / particleCount) * Math.PI * 2;
        const velocity = 40 + Math.random() * 80;
        const tx = Math.cos(angle) * velocity;
        const ty = Math.sin(angle) * velocity;

        const color = colors[Math.floor(Math.random() * colors.length)];
        const size = 3 + Math.random() * 5;

        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.background = color;
        particle.style.boxShadow = `0 0 ${size * 2}px ${color}`;
        particle.style.setProperty('--tx', tx + 'px');
        particle.style.setProperty('--ty', ty + 'px');
        particle.style.animationDuration = (0.5 + Math.random() * 0.5) + 's';

        burst.appendChild(particle);
    }

    document.body.appendChild(burst);

    // Cleanup after animation
    setTimeout(() => burst.remove(), 1200);
}

// ============================================
// PHOTO BOOTH
// ============================================
async function startCamera() {
    try {
        cameraStream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
            audio: false
        });

        const video = document.getElementById('cameraVideo');
        video.srcObject = cameraStream;

        // Hide placeholder, show camera controls
        document.getElementById('cameraPlaceholder').style.display = 'none';
        document.getElementById('startCameraBtn').style.display = 'none';
        document.getElementById('captureBtn').style.display = 'inline-flex';
        document.getElementById('stickerSelector').style.display = 'block';

        showToast('📷', 'Camera đã sẵn sàng! Hãy tạo dáng~');
    } catch (err) {
        showToast('⚠️', 'Không thể truy cập camera. Vui lòng cho phép quyền truy cập.');
        console.error('Camera error:', err);
    }
}

function capturePhoto() {
    const video = document.getElementById('cameraVideo');
    const canvas = document.getElementById('photoCanvas');
    const ctx = canvas.getContext('2d');

    // Set canvas size to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw mirrored video frame
    ctx.save();
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    ctx.restore();

    // Draw frame overlay
    drawFrameOnCanvas(ctx, canvas.width, canvas.height);

    // Flash effect
    const wrapper = document.getElementById('cameraWrapper');
    const flash = document.createElement('div');
    flash.className = 'camera-flash';
    wrapper.appendChild(flash);
    setTimeout(() => flash.remove(), 500);

    // Show captured image
    const capturedImg = document.getElementById('capturedPhoto');
    const photoDataUrl = canvas.toDataURL('image/png');
    capturedImg.src = photoDataUrl;
    capturedImg.style.display = 'block';
    video.style.display = 'none';

    // Toggle buttons
    document.getElementById('captureBtn').style.display = 'none';
    document.getElementById('retakeBtn').style.display = 'inline-flex';
    document.getElementById('downloadBtn').style.display = 'inline-flex';

    // Auto attach to RSVP form!
    hasAttachedPhoto = true;
    const attachedThumb = document.getElementById('attachedThumbImg');
    const emptyHint = document.getElementById('photoStatusEmpty');
    const attachedBox = document.getElementById('photoStatusAttached');
    const submitBtnText = document.getElementById('submitBtnText');

    if (attachedThumb) attachedThumb.src = photoDataUrl;
    if (emptyHint) emptyHint.style.display = 'none';
    if (attachedBox) attachedBox.style.display = 'flex';
    if (submitBtnText) submitBtnText.textContent = '🎉 Gửi Xác Nhận, Lời Chúc & Ảnh';

    // Mini confetti
    launchConfetti();
    showToast('📸', 'Đã chụp và tự động đính kèm vào lời chúc! 🥰');
}

function drawFrameOnCanvas(ctx, width, height) {
    if (currentSticker === 'none') return;

    const borderSize = Math.max(6, width * 0.015);
    const fontSize = Math.max(14, width * 0.035);
    const smallFontSize = Math.max(11, width * 0.025);
    const emojiSize = Math.max(28, width * 0.06);

    // Frame border
    if (currentSticker === 'elegant') {
        // Double border
        ctx.strokeStyle = '#d4af37';
        ctx.lineWidth = borderSize;
        ctx.strokeRect(borderSize / 2, borderSize / 2, width - borderSize, height - borderSize);
        ctx.lineWidth = borderSize / 2;
        ctx.strokeRect(borderSize * 1.5, borderSize * 1.5, width - borderSize * 3, height - borderSize * 3);
    } else {
        ctx.strokeStyle = currentSticker === 'fun' ? '#e84393' : '#d4af37';
        ctx.lineWidth = borderSize;
        ctx.strokeRect(borderSize / 2, borderSize / 2, width - borderSize, height - borderSize);
    }

    // Top banner
    const bannerY = borderSize + 15;
    const bannerText = '🎓 Chúc Mừng Tốt Nghiệp 🎓';
    ctx.font = `bold ${fontSize}px "Quicksand", sans-serif`;
    const bannerWidth = ctx.measureText(bannerText).width + 40;

    // Banner background
    const bannerGrad = ctx.createLinearGradient(width / 2 - bannerWidth / 2, 0, width / 2 + bannerWidth / 2, 0);
    if (currentSticker === 'fun') {
        bannerGrad.addColorStop(0, 'rgba(232, 67, 147, 0.9)');
        bannerGrad.addColorStop(1, 'rgba(253, 121, 168, 0.9)');
    } else {
        bannerGrad.addColorStop(0, 'rgba(212, 175, 55, 0.9)');
        bannerGrad.addColorStop(1, 'rgba(184, 150, 12, 0.9)');
    }

    const bannerH = fontSize + 16;
    ctx.fillStyle = bannerGrad;
    roundRect(ctx, width / 2 - bannerWidth / 2, bannerY, bannerWidth, bannerH, 20);
    ctx.fill();

    ctx.fillStyle = currentSticker === 'fun' ? '#fff' : '#0a0e27';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(bannerText, width / 2, bannerY + bannerH / 2);

    // Bottom name banner - Quản lí kinh tế (QLKT)
    const nameText = 'Vũ Thị Ngọc Quỳnh — Thạc Sĩ QLKT';
    ctx.font = `600 ${smallFontSize}px "Quicksand", sans-serif`;
    const nameWidth = ctx.measureText(nameText).width + 32;
    const nameY = height - borderSize - 15 - smallFontSize - 12;
    const nameH = smallFontSize + 14;

    ctx.fillStyle = 'rgba(10, 14, 39, 0.85)';
    roundRect(ctx, width / 2 - nameWidth / 2, nameY, nameWidth, nameH, 16);
    ctx.fill();
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 1;
    roundRect(ctx, width / 2 - nameWidth / 2, nameY, nameWidth, nameH, 16);
    ctx.stroke();

    ctx.fillStyle = '#f5d769';
    ctx.fillText(nameText, width / 2, nameY + nameH / 2);

    // Corner emojis
    ctx.font = `${emojiSize}px serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const pad = borderSize + emojiSize / 2 + 8;
    ctx.fillText('🎓', pad, pad);
    ctx.fillText('⭐', width - pad, pad);
    ctx.fillText('✨', pad, height - pad - 20);
    ctx.fillText('🎓', width - pad, height - pad - 20);

    ctx.textAlign = 'start';
}

function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
}

function retakePhoto() {
    const video = document.getElementById('cameraVideo');
    const capturedImg = document.getElementById('capturedPhoto');

    capturedImg.style.display = 'none';
    video.style.display = 'block';

    document.getElementById('captureBtn').style.display = 'inline-flex';
    document.getElementById('retakeBtn').style.display = 'none';
    document.getElementById('downloadBtn').style.display = 'none';

    // Clear attached photo from RSVP form when retaking
    resetAttachedPhotoState();
}

function downloadPhoto() {
    const canvas = document.getElementById('photoCanvas');
    const link = document.createElement('a');
    link.download = `graduation_photobooth_${GRADUATE_NAME.replace(/\s+/g, '_')}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    showToast('💾', 'Đã tải ảnh thành công!');
}

function selectSticker(type) {
    currentSticker = type;
    const frame = document.getElementById('photoFrame');

    // Update sticker buttons
    document.querySelectorAll('.sticker-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.sticker === type);
    });

    // Update frame style
    frame.className = 'photo-frame';
    if (type === 'none') {
        frame.classList.add('hidden');
    } else if (type === 'fun') {
        frame.classList.add('fun');
    } else if (type === 'elegant') {
        frame.classList.add('elegant');
    }

    // Update corner emojis for fun mode
    const corners = frame.querySelectorAll('.frame-corner');
    if (type === 'fun') {
        const funEmojis = ['🥳', '🎉', '🎊', '💃'];
        corners.forEach((c, i) => c.textContent = funEmojis[i]);
    } else {
        const classicEmojis = ['🎓', '⭐', '✨', '🎓'];
        corners.forEach((c, i) => c.textContent = classicEmojis[i]);
    }
}

// ============================================
// PHOTO COMPRESSION & UTILS
// ============================================

function compressPhoto(sourceCanvas, maxWidth) {
    const ratio = maxWidth / sourceCanvas.width;
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = maxWidth;
    tempCanvas.height = sourceCanvas.height * ratio;
    const ctx = tempCanvas.getContext('2d');
    ctx.drawImage(sourceCanvas, 0, 0, tempCanvas.width, tempCanvas.height);
    return tempCanvas.toDataURL('image/jpeg', 0.65);
}

// ============================================
// LIGHTBOX
// ============================================
function openLightbox(src) {
    const lightbox = document.getElementById('lightboxOverlay');
    const img = document.getElementById('lightboxImg');
    if (lightbox && img) {
        img.src = src;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeLightbox(event) {
    if (event) event.stopPropagation();
    const lightbox = document.getElementById('lightboxOverlay');
    if (lightbox) {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Global ESC key listener for lightbox
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeLightbox();
    }
});
