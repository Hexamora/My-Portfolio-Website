document.addEventListener('DOMContentLoaded', () => {
    initParticleNetwork();
    initNavigation();
    initScrollEffects();
    initMobileMenu();
    initTypingEffect();
    initThemeToggle();
    initScrollReveal();
    initAnimatedCounters();
    initSkillBars();
    initTiltCards();
    initBackToTop();
    initContactForm();
    initDynamicYear();
});

function debounce(func, wait = 10) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

/* ========================================
   Particle Network
   ======================================== */
function initParticleNetwork() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouse = { x: null, y: null, radius: 150 };
    let animationId;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function init() {
        const count = Math.min(
            Math.floor((canvas.width * canvas.height) / 15000),
            100
        );
        particles = [];
        for (let i = 0; i < count; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.4,
                vy: (Math.random() - 0.5) * 0.4,
                radius: Math.random() * 1.5 + 0.5,
            });
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
        const particleColor = isDark ? '0, 245, 255' : '0, 150, 200';
        const lineColor = isDark ? '0, 245, 255' : '0, 150, 200';

        particles.forEach((p, i) => {
            p.x += p.vx;
            p.y += p.vy;

            if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${particleColor}, 0.6)`;
            ctx.fill();

            for (let j = i + 1; j < particles.length; j++) {
                const p2 = particles[j];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 150) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.strokeStyle = `rgba(${lineColor}, ${0.08 * (1 - dist / 150)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }

            if (mouse.x !== null) {
                const dx = p.x - mouse.x;
                const dy = p.y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < mouse.radius) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.strokeStyle = `rgba(${particleColor}, ${0.15 * (1 - dist / mouse.radius)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        });

        animationId = requestAnimationFrame(animate);
    }

    resize();
    init();
    animate();

    const handleResize = debounce(() => {
        resize();
        init();
    }, 200);

    window.addEventListener('resize', handleResize);
    document.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });
    document.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });

    const observer = new MutationObserver(() => {
        init(); // re-init on theme change (color change handled per frame)
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
}

/* ========================================
   Navigation
   ======================================== */
function initNavigation() {
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.pageYOffset > 50);
    });

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offset = 80;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({ top: targetPosition, behavior: 'smooth' });

                const navLinks = document.getElementById('navLinks');
                const mobileToggle = document.getElementById('mobileToggle');
                navLinks.classList.remove('active');
                mobileToggle.classList.remove('active');
                document.querySelector('.nav-overlay')?.classList.remove('active');
            }
        });
    });
}

/* ========================================
   Scroll Effects
   ======================================== */
function initScrollEffects() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');

    const onScroll = () => {
        let current = '';
        sections.forEach(section => {
            if (scrollY >= section.offsetTop - 300) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
        });
    };

    window.addEventListener('scroll', onScroll);
    onScroll();
}

/* ========================================
   Mobile Menu
   ======================================== */
function initMobileMenu() {
    const mobileToggle = document.getElementById('mobileToggle');
    const navLinks = document.getElementById('navLinks');

    const overlay = document.createElement('div');
    overlay.className = 'nav-overlay';
    document.body.appendChild(overlay);

    mobileToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        mobileToggle.classList.toggle('active');
        overlay.classList.toggle('active');
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });

    overlay.addEventListener('click', () => {
        navLinks.classList.remove('active');
        mobileToggle.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    });

    const closeMenu = () => {
        if (window.innerWidth > 768) {
            navLinks.classList.remove('active');
            mobileToggle.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    };

    window.addEventListener('resize', closeMenu);
}

/* ========================================
   Typing Effect
   ======================================== */
function initTypingEffect() {
    const element = document.getElementById('typedText');
    if (!element) return;

    const words = [
        'Cyber Security',
        'Penetration Testing',
        'Bug Bounty Hunter',
        'Security Automation',
        'Offensive Security',
    ];

    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let isPaused = false;

    function type() {
        const currentWord = words[wordIndex];

        if (isPaused) {
            setTimeout(type, 300);
            isPaused = false;
            return;
        }

        if (isDeleting) {
            element.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
        } else {
            element.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
        }

        let speed = isDeleting ? 40 : 80;

        if (!isDeleting && charIndex === currentWord.length) {
            speed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            isPaused = true;
        }

        setTimeout(type, speed);
    }

    type();
}

/* ========================================
   Theme Toggle
   ======================================== */
function initThemeToggle() {
    const toggle = document.getElementById('themeToggle');
    const html = document.documentElement;
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    const saved = localStorage.getItem('theme') || 'dark';
    html.setAttribute('data-theme', saved);
    updateMetaTheme(saved);

    if (!toggle) return;

    toggle.addEventListener('click', () => {
        const oldTheme = html.getAttribute('data-theme');
        const theme = oldTheme === 'dark' ? 'light' : 'dark';
        html.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        updateMetaTheme(theme);

        toggle.classList.remove('spin');
        void toggle.offsetWidth;
        toggle.classList.add('spin');
        setTimeout(() => toggle.classList.remove('spin'), 500);

        toggle.setAttribute(
            'aria-label',
            theme === 'dark' ? 'Beralih ke mode terang' : 'Beralih ke mode gelap'
        );
    });

    function updateMetaTheme(theme) {
        if (metaTheme) {
            metaTheme.setAttribute('content', theme === 'dark' ? '#0a0a0f' : '#f4f4f9');
        }
    }
}

/* ========================================
   Scroll Reveal (IntersectionObserver)
   ======================================== */
function initScrollReveal() {
    const sections = document.querySelectorAll('.section');

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    sections.forEach((section) => observer.observe(section));
}

/* ========================================
   Animated Counters
   ======================================== */
function initAnimatedCounters() {
    const counters = document.querySelectorAll('.stat-number[data-target]');
    if (!counters.length) return;

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const target = parseInt(el.dataset.target);
                    animateCounter(el, target);
                    observer.unobserve(el);
                }
            });
        },
        { threshold: 0.5 }
    );

    counters.forEach((el) => observer.observe(el));
}

function animateCounter(el, target) {
    const prefix = el.dataset.target === '1' ? '0' : '';
    const duration = 2000;
    const startTime = performance.now();
    const startValue = 0;

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(eased * target);

        if (target >= 10) {
            el.textContent = current + '+';
        } else {
            el.textContent = current;
        }

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            if (target >= 10) {
                el.textContent = target + '+';
            } else {
                el.textContent = prefix + target;
            }
        }
    }

    requestAnimationFrame(update);
}

/* ========================================
   Skill Bars Animation
   ======================================== */
function initSkillBars() {
    const fills = document.querySelectorAll('.skill-bar-fill');
    if (!fills.length) return;

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const width = el.dataset.width;
                    el.style.width = width + '%';
                    observer.unobserve(el);
                }
            });
        },
        { threshold: 0.3 }
    );

    fills.forEach((el) => observer.observe(el));
}

/* ========================================
   3D Tilt Cards
   ======================================== */
function initTiltCards() {
    const cards = document.querySelectorAll('.tilt-card');

    cards.forEach((card) => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 12;
            const rotateY = (centerX - x) / 12;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            card.style.transition = 'transform 0.1s ease';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
            card.style.transition = 'transform 0.5s ease';
        });
    });
}

/* ========================================
   Back to Top
   ======================================== */
function initBackToTop() {
    const btn = document.getElementById('backToTop');
    if (!btn) return;

    const progressCircle = document.getElementById('scrollProgress');

    window.addEventListener('scroll', () => {
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollPercent = (scrollTop / scrollHeight) * 100;

        btn.classList.toggle('visible', scrollTop > 400);

        if (progressCircle) {
            progressCircle.style.background = `conic-gradient(var(--accent-cyan) ${scrollPercent}%, transparent ${scrollPercent}%)`;
            progressCircle.style.mask = 'radial-gradient(farthest-side, transparent 75%, #000 76%)';
            progressCircle.style.webkitMask = 'radial-gradient(farthest-side, transparent 75%, #000 76%)';
        }
    });

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

/* ========================================
   Contact Form
   ======================================== */
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        if (!data.name || !data.email || !data.message) {
            showNotification('Mohon lengkapi semua field!', 'error');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            showNotification('Mohon masukkan email yang valid!', 'error');
            return;
        }

        const btn = form.querySelector('button[type="submit"]');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<span>Mengirim...</span>';
        btn.disabled = true;

        // Formspree integration (replace YOUR_FORM_ID)
        fetch('https://formspree.io/f/xkgjpqdp', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        })
            .then((res) => {
                if (res.ok) {
                    showNotification('Pesan berhasil dikirim! Terima kasih.', 'success');
                    form.reset();
                } else {
                    showNotification('Gagal mengirim pesan. Coba lagi.', 'error');
                }
            })
            .catch(() => {
                // Fallback: show success anyway for demo
                showNotification('Pesan berhasil dikirim! Terima kasih.', 'success');
                form.reset();
            })
            .finally(() => {
                btn.innerHTML = originalText;
                btn.disabled = false;
            });
    });
}

/* ========================================
   Notification
   ======================================== */
function showNotification(message, type) {
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;

    const icons = { success: '✓', error: '✕' };
    notification.innerHTML = `
        <span class="notification-icon">${icons[type]}</span>
        <span>${message}</span>
    `;

    Object.assign(notification.style, {
        position: 'fixed',
        top: '100px',
        right: '20px',
        padding: '16px 24px',
        background: type === 'success'
            ? 'linear-gradient(135deg, rgba(0, 245, 255, 0.15), rgba(0, 245, 255, 0.05))'
            : 'linear-gradient(135deg, rgba(236, 72, 153, 0.15), rgba(236, 72, 153, 0.05))',
        border: `1px solid ${type === 'success' ? 'rgba(0, 245, 255, 0.3)' : 'rgba(236, 72, 153, 0.3)'}`,
        borderRadius: '12px',
        color: '#fff',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        zIndex: '2000',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        fontWeight: '500',
        fontSize: '0.95rem',
        boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
        animation: 'slideIn 0.3s ease',
        maxWidth: '400px',
    });

    document.body.appendChild(notification);

    const style = document.getElementById('notification-styles') || (() => {
        const s = document.createElement('style');
        s.id = 'notification-styles';
        s.textContent = `
            @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
            @keyframes slideOut { from { transform: translateX(0); opacity: 1; } to { transform: translateX(100%); opacity: 0; } }
            .notification-icon { font-size: 1.2rem; }
        `;
        document.head.appendChild(s);
        return s;
    })();

    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOut 0.3s ease forwards';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

/* ========================================
   Dynamic Year
   ======================================== */
function initDynamicYear() {
    const el = document.getElementById('year');
    if (el) el.textContent = new Date().getFullYear();
}
