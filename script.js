/* ═══════════════════════════════════════════════════════
   SHARADA HEALTH & DENTAL CARE — Final Scripts
   3D tilt, parallax, smooth animations, lightbox
   ═══════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {

    /* ── Splash Screen (3.5s cinematic) ── */
    const splash = document.getElementById('splash');
    document.body.classList.add('no-scroll');
    setTimeout(() => {
        splash.classList.add('out');
        document.body.classList.remove('no-scroll');
        setTimeout(() => splash.classList.add('gone'), 700);
    }, 3500);

    /* ── Navbar scroll ── */
    const nav = document.getElementById('nav');
    const btt = document.getElementById('btt');
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const y = scrollY;
        nav.classList.toggle('scrolled', y > 50);
        btt.classList.toggle('show', y > 400);
        lastScroll = y;
    }, { passive: true });

    /* ── Back to top ── */
    btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

    /* ── Mobile Menu ── */
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('on');
        navMenu.classList.toggle('open');
    });
    navMenu.querySelectorAll('.nav-a').forEach(a => a.addEventListener('click', () => {
        hamburger.classList.remove('on');
        navMenu.classList.remove('open');
    }));
    document.addEventListener('click', e => {
        if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
            hamburger.classList.remove('on');
            navMenu.classList.remove('open');
        }
    });

    /* ── Active nav highlight on scroll ── */
    const sections = document.querySelectorAll('section[id]');
    const navAs = document.querySelectorAll('.nav-a');
    window.addEventListener('scroll', () => {
        const y = scrollY + 100;
        sections.forEach(s => {
            if (y >= s.offsetTop && y < s.offsetTop + s.offsetHeight) {
                const id = s.id;
                navAs.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + id));
            }
        });
    }, { passive: true });

    /* ── Smooth Scroll Reveal ── */
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('in');
                observer.unobserve(e.target);
            }
        });
    }, { rootMargin: '0px 0px -40px 0px', threshold: 0.06 });
    document.querySelectorAll('.anim').forEach(el => observer.observe(el));

    /* ── Counter Animation ── */
    const cObs = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.querySelectorAll('[data-count]').forEach(c => countUp(c));
                cObs.unobserve(e.target);
            }
        });
    }, { threshold: 0.4 });
    const stats = document.querySelector('.hero-stats');
    if (stats) cObs.observe(stats);

    function countUp(el) {
        const target = +el.dataset.count;
        const dur = 2200;
        const start = performance.now();
        (function tick(now) {
            const p = Math.min((now - start) / dur, 1);
            const ease = 1 - Math.pow(1 - p, 3);
            el.textContent = Math.floor(target * ease).toLocaleString();
            if (p < 1) requestAnimationFrame(tick);
            else el.textContent = target.toLocaleString();
        })(start);
    }

    /* ── Smooth anchors ── */
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            const t = document.querySelector(a.getAttribute('href'));
            if (t) { e.preventDefault(); window.scrollTo({ top: t.offsetTop - 70, behavior: 'smooth' }); }
        });
    });

    /* ══════════════════════════════════════
       3D TILT CARD EFFECT
       ══════════════════════════════════════ */
    const tiltCards = document.querySelectorAll('.tilt-card');
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const cx = rect.width / 2;
            const cy = rect.height / 2;
            const rotX = ((y - cy) / cy) * -6;
            const rotY = ((x - cx) / cx) * 6;

            card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-6px)`;
            card.style.boxShadow = `${-rotY * 2}px ${rotX * 2}px 30px rgba(0,0,0,.1)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
            card.style.boxShadow = '';
        });
    });

    /* ══════════════════════════════════════
       PARALLAX SCROLL EFFECT
       ══════════════════════════════════════ */
    window.addEventListener('scroll', () => {
        const y = scrollY;
        // Badge circle subtle float
        const badge = document.querySelector('.about-badge-circle');
        if (badge) {
            const rect = badge.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                badge.style.transform = `translateY(${Math.sin(y * 0.005) * 6}px)`;
            }
        }
    }, { passive: true });

    /* ══════════════════════════════════════
       GALLERY LIGHTBOX
       ══════════════════════════════════════ */
    const lb = document.createElement('div');
    lb.style.cssText = 'position:fixed;inset:0;z-index:9998;background:rgba(30,41,59,.94);display:none;align-items:center;justify-content:center;cursor:pointer;backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);opacity:0;transition:opacity .4s cubic-bezier(.4,0,.2,1)';
    
    const lbImg = document.createElement('img');
    lbImg.style.cssText = 'max-width:88%;max-height:82vh;border-radius:16px;object-fit:contain;box-shadow:0 20px 80px rgba(0,0,0,.5);transform:scale(.88) rotateY(8deg);transition:transform .5s cubic-bezier(.2,.8,.2,1)';
    
    const lbCap = document.createElement('div');
    lbCap.style.cssText = 'position:absolute;bottom:28px;left:50%;transform:translateX(-50%);color:rgba(255,255,255,.85);font-size:.95rem;font-family:DM Serif Display,serif;letter-spacing:.5px;text-shadow:0 2px 8px rgba(0,0,0,.3)';
    
    const lbX = document.createElement('button');
    lbX.innerHTML = '&times;';
    lbX.style.cssText = 'position:absolute;top:24px;right:24px;width:48px;height:48px;border-radius:50%;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.15);color:#fff;font-size:1.6rem;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .3s;backdrop-filter:blur(6px)';
    lbX.onmouseenter = () => lbX.style.background = 'rgba(255,255,255,.18)';
    lbX.onmouseleave = () => lbX.style.background = 'rgba(255,255,255,.08)';

    lb.append(lbImg, lbCap, lbX);
    document.body.appendChild(lb);

    function openLb(src, cap) {
        lbImg.src = src; lbCap.textContent = cap;
        lb.style.display = 'flex';
        requestAnimationFrame(() => { 
            lb.style.opacity = '1'; 
            lbImg.style.transform = 'scale(1) rotateY(0)'; 
        });
        document.body.style.overflow = 'hidden';
    }
    function closeLb() {
        lb.style.opacity = '0'; 
        lbImg.style.transform = 'scale(.88) rotateY(-8deg)';
        setTimeout(() => { lb.style.display = 'none'; document.body.style.overflow = ''; }, 400);
    }

    document.querySelectorAll('.gal-item').forEach(g => {
        g.addEventListener('click', () => {
            openLb(g.querySelector('img').src, g.querySelector('h4')?.textContent || '');
        });
    });
    lb.addEventListener('click', e => { if (e.target === lb || e.target === lbX) closeLb(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLb(); });

    /* ══════════════════════════════════════
       PRELOAD IMAGES
       ══════════════════════════════════════ */
    ['reception','dental-chair','consultation-room','treatment-room','doctor-cabin','logo-banner'].forEach(n => {
        const img = new Image();
        img.src = `images/${n}.jpeg`;
    });

});
