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

    /* ══════════════════════════════════════
       APPOINTMENT MODAL & API SUBMISSION
       ══════════════════════════════════════ */
    const modal = document.getElementById('appointmentModal');
    const btnBook1 = document.getElementById('btn-book-modal');
    const btnBook2 = document.getElementById('btn-cta-modal');
    const btnClose = document.getElementById('modalClose');
    const form = document.getElementById('appointmentForm');
    const formStatus = document.getElementById('formStatus');

    function openApptModal() {
        if (!modal) return;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeApptModal() {
        if (!modal) return;
        modal.classList.remove('active');
        document.body.style.overflow = '';
        if(formStatus) formStatus.className = 'form-status'; // reset
    }

    if (btnBook1) btnBook1.addEventListener('click', openApptModal);
    if (btnBook2) btnBook2.addEventListener('click', openApptModal);
    if (btnClose) btnClose.addEventListener('click', closeApptModal);
    
    // Close on outside click
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeApptModal();
        });
    }

    // Handle Form Submit (AJAX)
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const btnSubmit = document.getElementById('btnSubmitForm');
            const originalText = btnSubmit.innerHTML;
            btnSubmit.innerHTML = 'Booking...';
            btnSubmit.disabled = true;
            
            formStatus.className = 'form-status'; // reset
            formStatus.textContent = '';
            
            const formData = new FormData(form);
            const pName = formData.get('patient_name');
            const pPhone = formData.get('phone_number');
            const pDate = formData.get('preferred_date');
            const pService = formData.get('service') || 'General';
            const pSymptom = formData.get('symptom') || 'Regular Checkup';

            // --- Spam Protection (Local) ---
            const lastBookingTime = localStorage.getItem('last_booking_' + pPhone);
            const now = Date.now();
            const oneDay = 24 * 60 * 60 * 1000;

            if (lastBookingTime && (now - lastBookingTime < oneDay)) {
                formStatus.textContent = "⚠️ An appointment was already requested for this number recently. Please wait for the clinic to contact you.";
                formStatus.classList.add('error');
                btnSubmit.innerHTML = originalText;
                btnSubmit.disabled = false;
                return;
            }

            // Visual Feedback
            // Function to format the technical date into a friendly AM/PM string
            const formatDate = (dtStr) => {
                if(!dtStr) return "Not specified";
                const date = new Date(dtStr);
                return date.toLocaleString('en-IN', { 
                    day: 'numeric', 
                    month: 'short', 
                    year: 'numeric', 
                    hour: 'numeric', 
                    minute: '2-digit', 
                    hour12: true 
                });
            };

            const pFriendlyDate = formatDate(pDate);

            // Construct WhatsApp message with AM/PM time
            const waMsg = encodeURIComponent(`Hello Sharada Dental Care! 👋\n\nI just booked an appointment online:\n👤 *Name*: ${pName}\n📞 *Phone*: ${pPhone}\n📅 *Date/Time*: ${pFriendlyDate}\n🦷 *Service*: ${pService}\n📝 *Notes*: ${pSymptom}\n\nPlease confirm my booking. Thank you!`);
            const waUrl = `https://wa.me/919886358222?text=${waMsg}`;
            
            form.reset();
            
            // Redirect after short delay
            setTimeout(() => {
                window.open(waUrl, '_blank');
                btnSubmit.innerHTML = originalText;
                btnSubmit.disabled = false;
                closeApptModal();
                formStatus.textContent = "";
                formStatus.className = "form-status";
            }, 2000);
        });
    }

    /* ══════════════════════════════════════
       SERVICE MODAL & DATA
       ══════════════════════════════════════ */
    const SERVICE_DATA = {
        'service-scaling': {
            title: 'Scaling & Cleaning',
            icon: 'fa-teeth',
            desc: 'Professional dental scaling and cleaning are essential for maintaining secondary gum health and a bright smile. Our procedure removes built-up tartar (calculus) and plaque that regular brushing cannot reach.',
            details: [
                'Prevents periodontal (gum) disease and bone loss.',
                'Removes external stains caused by coffee, tea, or tobacco.',
                'Includes a professional polish for a smooth, shiny finish.',
                'Recommended every 6 months for optimal oral hygiene.'
            ]
        },
        'service-rootcanal': {
            title: 'Root Canal Therapy',
            icon: 'fa-tooth',
            desc: 'A Root Canal Treatment (RCT) is a highly successful procedure designed to save a severely damaged or infected tooth. We use advanced rotary endodontics to ensure the process is quick and virtually painless.',
            details: [
                'Eliminates persistent toothache and sensitivity.',
                'Removes infected pulp and seals the canal to prevent re-infection.',
                'Preserves your natural tooth, avoiding the need for extraction.',
                'Completed with a custom crown for long-term strength.'
            ]
        },
        'service-implants': {
            title: 'Dental Implants',
            icon: 'fa-plus-circle',
            desc: 'Dental implants are the gold standard for replacing missing teeth. They provide a permanent, stable, and natural-looking solution that functions exactly like your real teeth.',
            details: [
                'Permanent titanium post serves as a root replacement.',
                'Prevents jawbone shrinkage and maintains facial structure.',
                'Allows you to eat, speak, and smile with 100% confidence.',
                'Biocompatible materials for lifetime durability.'
            ]
        },
        'service-orthodontics': {
            title: 'Orthodontics & Aligners',
            icon: 'fa-align-center',
            desc: 'Transform your smile and improve your oral health with our comprehensive orthodontic solutions. We offer traditional braces and modern clear aligners for all age groups.',
            details: [
                'Corrects crowding, spacing, and bite alignment issues.',
                'Options include Metal, Ceramic, and Invisible Aligners.',
                'Improves long-term dental health and jaw function.',
                'Customized treatment plans for a perfect, straight smile.'
            ]
        },
        'service-whitening': {
            title: 'Professional Teeth Whitening',
            icon: 'fa-magic',
            desc: 'Achieve a dazzling, professional-grade white smile. Our in-office whitening treatments are safer and much more effective than over-the-counter DIY kits.',
            details: [
                'Brightens your smile several shades in just one visit.',
                'Removes deep-seated stains and yellowing.',
                'Uses advanced light-activated technology.',
                'Minimal sensitivity with professional application.'
            ]
        },
        'service-extraction': {
            title: 'Painless Tooth Extraction',
            icon: 'fa-hand-holding-medical',
            desc: 'While we always aim to save teeth, sometimes an extraction is necessary for your overall health. We ensure the procedure is performed with maximum comfort and a gentle touch.',
            details: [
                'Specialized wisdom tooth removal (impaction).',
                'Advanced local anesthesia for a painless experience.',
                'Quick procedure with detailed aftercare instructions.',
                'Focus on preserving surrounding bone for future implants.'
            ]
        },
        'service-crowns': {
            title: 'Crowns & Bridges',
            icon: 'fa-crown',
            desc: 'Protect weakened teeth and restore your smile with high-quality crowns and bridges. These custom restorations are designed to match the color and shape of your natural teeth.',
            details: [
                'Crowns (caps) strengthen cracked or heavily filled teeth.',
                'Bridges fill gaps left by missing teeth using adjacent support.',
                'Made from durable, aesthetically pleasing ceramic materials.',
                'Restores full chewing function and aesthetic beauty.'
            ]
        },
        'service-dentures': {
            title: 'Custom Dentures',
            icon: 'fa-teeth-open',
            desc: 'Regain your smile and chewing ability with our custom-fit dentures. We provide both complete and partial dentures designed for maximum comfort and a natural look.',
            details: [
                'Precision-crafted for a secure and comfortable fit.',
                'Lightweight materials for effortless daily wear.',
                'Easy to maintain and provides excellent facial support.',
                'Options for implant-supported dentures for extra stability.'
            ]
        },
        'service-filling': {
            title: 'Cosmetic Fillings',
            icon: 'fa-fill-drip',
            desc: 'Say goodbye to old metallic fillings. Our modern composite fillings are tooth-colored and designed to blend seamlessly with your natural enamel.',
            details: [
                'Effectively repairs cavities and minor chips.',
                'Bond directly to the tooth, requiring less drilling.',
                'Chemically hardens in seconds under specialized light.',
                '100% Mercury-free and aesthetically superior.'
            ]
        },
        'service-pediatric': {
            title: 'Pediatric Dentistry',
            icon: 'fa-child',
            desc: 'We love kids! Our pediatric dental care focuses on creating a positive, fun experience to build a lifetime of healthy dental habits for your children.',
            details: [
                'Gentle exams and preventative fluoride treatments.',
                'Dental sealants to prevent cavities in young molars.',
                'Age-appropriate education on brushing and hygiene.',
                'Compassionate approach specifically for nervous children.'
            ]
        },
        'service-gum': {
            title: 'Gum Treatment',
            icon: 'fa-heartbeat',
            desc: 'Healthy gums are the foundation of a healthy mouth. We offer advanced periodontal treatments to manage and reverse gum disease at any stage.',
            details: [
                'Deep cleaning (Scaling & Root Planing) for infected gums.',
                'Treatment for bleeding gums and bad breath.',
                'Microbial irrigation to eliminate harmful bacteria.',
                'Long-term maintenance plans for gum health.'
            ]
        },
        'service-smile': {
            title: 'Smile Makeover',
            icon: 'fa-smile-beam',
            desc: 'Our Smile Makeover is a personalized combination of cosmetic procedures to give you the perfect smile you’ve always wanted. It’s a total transformation.',
            details: [
                'Combines Veneers, Crowns, and Whitening.',
                'Full digital smile design for predictable results.',
                'Corrects tooth shape, size, color, and alignment.',
                'A comprehensive approach to facial aesthetics.'
            ]
        }
    };

    const sModal = document.getElementById('serviceModal');
    const sBody = document.getElementById('srvModalBody');

    function openSrvModal(id) {
        const data = SERVICE_DATA[id];
        if (!data) return;

        sBody.innerHTML = `
            <div class="sm-top">
                <div class="sm-icon"><i class="fas ${data.icon}"></i></div>
                <div class="sm-head">
                    <h2>${data.title}</h2>
                    <p>Expert Specialized Care</p>
                </div>
            </div>
            <div class="sm-content">
                <p class="sm-desc">${data.desc}</p>
                <div class="sm-detail-list">
                    ${data.details.map(d => `<div class="sm-item"><i class="fas fa-check-circle"></i> <span>${d}</span></div>`).join('')}
                </div>
            </div>
            <div class="sm-footer">
                <button class="btn btn-fill srv-book-btn"><i class="fas fa-calendar-alt"></i> Book This Service</button>
                <button class="btn btn-white srv-close-btn">Close Details</button>
            </div>
        `;

        sModal.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Bind inner buttons
        sBody.querySelector('.srv-close-btn').onclick = closeSrvModal;
        sBody.querySelector('.srv-book-btn').onclick = () => {
            const selectEl = document.getElementById('p_service');
            if(selectEl) selectEl.value = data.title;
            closeSrvModal();
            setTimeout(openApptModal, 400);
        };
    }

    function closeSrvModal() {
        sModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    document.querySelectorAll('.srv').forEach(card => {
        card.style.cursor = 'pointer';
        card.addEventListener('click', () => openSrvModal(card.id));
    });

    if (sModal) {
        sModal.addEventListener('click', e => { if (e.target === sModal) closeSrvModal(); });
        document.getElementById('srvModalClose').onclick = closeSrvModal;
    }

});
