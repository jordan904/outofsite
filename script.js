// ============================================
// Out of Site Renovations — v2 Script
// ============================================

document.addEventListener('DOMContentLoaded', () => {

    // --- Navbar scroll ---
    const navbar = document.getElementById('navbar');
    const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // --- Mobile nav ---
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');

    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    navLinks.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // --- Gallery filter ---
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const f = btn.dataset.filter;
            galleryItems.forEach(item => {
                item.classList.toggle('hidden', f !== 'all' && item.dataset.category !== f);
            });
        });
    });

    // --- Lightbox ---
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    let currentIdx = 0;

    const getVisible = () => Array.from(galleryItems).filter(i => !i.classList.contains('hidden'));

    function openLightbox(idx) {
        currentIdx = idx;
        const vis = getVisible();
        const img = vis[currentIdx].querySelector('img');
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    function nav(dir) {
        const vis = getVisible();
        currentIdx = (currentIdx + dir + vis.length) % vis.length;
        const img = vis[currentIdx].querySelector('img');
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
    }

    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const vis = getVisible();
            openLightbox(vis.indexOf(item));
        });
    });

    document.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
    document.querySelector('.lightbox-prev').addEventListener('click', () => nav(-1));
    document.querySelector('.lightbox-next').addEventListener('click', () => nav(1));
    lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });

    document.addEventListener('keydown', e => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') nav(-1);
        if (e.key === 'ArrowRight') nav(1);
    });

    // --- Scroll animations ---
    const animEls = document.querySelectorAll(
        '.service-card, .testimonial-card, .gallery-item, .about-images, .about-content, .ba-card, .contact-left, .contact-right'
    );
    animEls.forEach(el => el.classList.add('fade-in'));

    const obs = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

    animEls.forEach(el => obs.observe(el));

    // --- Smooth scroll ---
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            const target = document.querySelector(a.getAttribute('href'));
            if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
        });
    });

    // --- Form ---
    document.getElementById('contactForm').addEventListener('submit', e => {
        e.preventDefault();
        const btn = e.target.querySelector('button[type="submit"]');
        btn.textContent = 'Message Sent!';
        btn.style.background = '#4a58a8';
        btn.disabled = true;
        setTimeout(() => {
            btn.textContent = 'Send Request';
            btn.style.background = '';
            btn.disabled = false;
            e.target.reset();
        }, 3000);
    });
});
