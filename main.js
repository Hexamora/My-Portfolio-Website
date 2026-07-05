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
    initScrollProgress();
    initSpotlight();
    initTimelineReveal();
    initProjectFilters();
    initLightbox();
    initTypingGlitch();
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
        const particleColor = isDark ? '255, 255, 255' : '100, 100, 100';
        const lineColor = isDark ? '255, 255, 255' : '100, 100, 100';

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
            metaTheme.setAttribute('content', theme === 'dark' ? '#0a0a0a' : '#f5f5f5');
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
   Contact Form Enhanced
   ======================================== */
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    const inputs = form.querySelectorAll('.form-input');
    const textarea = document.getElementById('message');
    const charCount = document.getElementById('charCount');
    const submitBtn = document.getElementById('submitBtn');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    /* Floating label autofill fix */
    inputs.forEach((input) => {
        if (input.value) input.classList.add('focused');
    });

    /* Real-time validation */
    inputs.forEach((input) => {
        input.addEventListener('input', () => {
            validateField(input);
        });

        input.addEventListener('blur', () => {
            if (!input.value) {
                input.classList.remove('input-valid', 'input-invalid');
            } else {
                validateField(input);
            }
        });
    });

    function validateField(input) {
        input.classList.remove('input-valid', 'input-invalid');

        if (!input.value) return;

        if (input.type === 'email') {
            if (emailRegex.test(input.value)) {
                input.classList.add('input-valid');
            } else {
                input.classList.add('input-invalid');
            }
        } else if (input.id === 'name') {
            if (input.value.length >= 2) {
                input.classList.add('input-valid');
            } else {
                input.classList.add('input-invalid');
            }
        } else if (input.id === 'message') {
            if (input.value.length >= 10) {
                input.classList.add('input-valid');
            } else {
                input.classList.add('input-invalid');
            }
        }
    }

    /* Character counter */
    if (textarea && charCount) {
        textarea.addEventListener('input', () => {
            const len = textarea.value.length;
            const max = textarea.maxLength || 500;
            charCount.textContent = len;

            const counter = charCount.parentElement;
            counter.classList.remove('near-limit', 'at-limit');
            if (len >= max - 20) counter.classList.add('near-limit');
            if (len >= max) counter.classList.add('at-limit');
        });
    }

    /* Submit handler */
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        /* Final validation */
        let hasError = false;
        inputs.forEach((input) => {
            validateField(input);
            if (input.classList.contains('input-invalid') || (!input.value && input.required)) {
                hasError = true;
            }
        });

        if (!data.name || !data.email || !data.message) {
            showNotification('Mohon lengkapi semua field!', 'error');
            return;
        }

        if (hasError || !emailRegex.test(data.email)) {
            showNotification('Mohon periksa kembali input kamu!', 'error');
            return;
        }

        /* Show loading state */
        if (submitBtn) {
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;
        }

        const webhookURL = 'https://discord.com/api/webhooks/1523364423891157003/fo6opErz68DpR0d_0OuvVTyV6Ks-CYOUWFw_fjQNUmo-UuhcamyIinUbPdeCIF1Cv0NF';

        const embed = {
            embeds: [{
                title: '📬 Pesan Baru dari Portfolio',
                color: 0x00f5ff,
                fields: [
                    { name: 'Nama', value: data.name, inline: true },
                    { name: 'Email', value: data.email, inline: true },
                    { name: 'Pesan', value: data.message },
                ],
                timestamp: new Date().toISOString(),
                footer: { text: 'Portfolio - Abdullah Nur Hadi' },
            }],
        };

        fetch(webhookURL, {
            method: 'POST',
            body: JSON.stringify(embed),
            headers: { 'Content-Type': 'application/json' },
        })
            .then((res) => {
                if (res.ok) {
                    showNotification('Pesan berhasil dikirim! Terima kasih.', 'success');
                    form.reset();
                    inputs.forEach((i) => i.classList.remove('input-valid', 'input-invalid'));
                    if (charCount) charCount.textContent = '0';
                } else {
                    showNotification('Gagal mengirim pesan. Coba lagi.', 'error');
                }
            })
            .catch(() => {
                showNotification('Gagal mengirim pesan. Coba lagi.', 'error');
            })
            .finally(() => {
                if (submitBtn) {
                    submitBtn.classList.remove('loading');
                    submitBtn.disabled = false;
                }
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
            ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.04))'
            : 'linear-gradient(135deg, rgba(160, 160, 160, 0.12), rgba(160, 160, 160, 0.04))',
        border: `1px solid ${type === 'success' ? 'rgba(255, 255, 255, 0.25)' : 'rgba(160, 160, 160, 0.3)'}`,
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

/* ========================================
   Scroll Progress Bar
   ======================================== */
function initScrollProgress() {
    const bar = document.getElementById('scrollProgressBar');
    if (!bar) return;

    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
                const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
                const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
                bar.style.width = progress + '%';
                ticking = false;
            });
            ticking = true;
        }
    });
}

/* ========================================
   Spotlight Cursor
   ======================================== */
function initSpotlight() {
    const spotlight = document.getElementById('spotlight');
    if (!spotlight) return;

    let hasMoved = false;

    document.addEventListener('mousemove', (e) => {
        if (!hasMoved) {
            hasMoved = true;
            spotlight.classList.add('visible');
        }
        spotlight.style.left = e.clientX + 'px';
        spotlight.style.top = e.clientY + 'px';
    });

    document.addEventListener('mouseleave', () => {
        spotlight.classList.remove('visible');
    });

    document.addEventListener('mouseenter', (e) => {
        if (hasMoved) {
            spotlight.classList.add('visible');
        }
    });
}

/* ========================================
   Enhanced Timeline Reveal (Per Item)
   ======================================== */
function initTimelineReveal() {
    const items = document.querySelectorAll('.timeline-item');
    if (!items.length) return;

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.15, rootMargin: '0px 0px -30px 0px' }
    );

    items.forEach((item) => observer.observe(item));
}

/* ========================================
   Typing Glitch Effect
   ======================================== */
function initTypingGlitch() {
    const el = document.getElementById('typedText');
    if (!el) return;

    const observer = new MutationObserver(() => {
        el.classList.add('glitch');
        setTimeout(() => el.classList.remove('glitch'), 600);
    });

    observer.observe(el, { childList: true });
}

/* ========================================
   Project Filters
   ======================================== */
function initProjectFilters() {
    const filters = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.project-card');
    if (!filters.length || !cards.length) return;

    filters.forEach((btn) => {
        btn.addEventListener('click', () => {
            const filter = btn.dataset.filter;

            filters.forEach((b) => b.classList.remove('active'));
            btn.classList.add('active');

            cards.forEach((card) => {
                if (filter === 'all' || card.dataset.category === filter) {
                    card.classList.remove('hidden');
                } else {
                    card.classList.add('hidden');
                }
            });

            // Re-layout masonry/grid effect
            const grid = document.querySelector('.projects-grid');
            if (grid) {
                grid.style.minHeight = grid.offsetHeight + 'px';
                requestAnimationFrame(() => {
                    grid.style.minHeight = '';
                });
            }
        });
    });
}

/* ========================================
   Lightbox
   ======================================== */
function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    const overlay = document.getElementById('lightboxOverlay');
    const image = document.getElementById('lightboxImage');
    const caption = document.getElementById('lightboxCaption');
    const closeBtn = document.getElementById('lightboxClose');
    const prevBtn = document.getElementById('lightboxPrev');
    const nextBtn = document.getElementById('lightboxNext');

    if (!lightbox || !overlay || !image) return;

    const projectImages = document.querySelectorAll('.project-image img');
    let currentIndex = 0;
    const images = [];

    projectImages.forEach((img, index) => {
        const projectCard = img.closest('.project-card');
        if (projectCard && !projectCard.classList.contains('hidden')) {
            const title = projectCard.querySelector('h3')?.textContent || '';
            images.push({ src: img.src, title: title });
        }
    });

    function open(index) {
        if (index < 0 || index >= images.length) return;
        currentIndex = index;
        image.src = images[index].src;
        image.alt = images[index].title;
        caption.textContent = images[index].title;
        lightbox.classList.add('active');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function close() {
        lightbox.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    function prev() {
        if (images.length <= 1) return;
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        image.src = images[currentIndex].src;
        image.alt = images[currentIndex].title;
        caption.textContent = images[currentIndex].title;
    }

    function next() {
        if (images.length <= 1) return;
        currentIndex = (currentIndex + 1) % images.length;
        image.src = images[currentIndex].src;
        image.alt = images[currentIndex].title;
        caption.textContent = images[currentIndex].title;
    }

    function refreshImages() {
        images.length = 0;
        document.querySelectorAll('.project-image img').forEach((img) => {
            const card = img.closest('.project-card');
            if (card && !card.classList.contains('hidden')) {
                const title = card.querySelector('h3')?.textContent || '';
                images.push({ src: img.src, title: title });
            }
        });
    }

    projectImages.forEach((img, index) => {
        img.style.cursor = 'pointer';
        img.addEventListener('click', (e) => {
            e.stopPropagation();
            const card = img.closest('.project-card');
            if (card && card.classList.contains('hidden')) return;
            refreshImages();
            const newIndex = images.findIndex((i) => i.src === img.src);
            if (newIndex !== -1) open(newIndex);
        });
    });

    if (closeBtn) closeBtn.addEventListener('click', close);
    if (overlay) overlay.addEventListener('click', close);
    if (prevBtn) prevBtn.addEventListener('click', prev);
    if (nextBtn) nextBtn.addEventListener('click', next);

    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') close();
        if (e.key === 'ArrowLeft') prev();
        if (e.key === 'ArrowRight') next();
    });

    // Refresh images when filter changes
    document.querySelectorAll('.filter-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
            setTimeout(refreshImages, 500);
        });
    });
}
