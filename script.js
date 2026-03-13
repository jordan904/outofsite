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

    // --- Testimonials carousel ---
    const track = document.querySelector('.testimonials-track');
    const cards = document.querySelectorAll('.testimonial-card');
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');
    let carouselIdx = 0;

    function getVisibleCount() {
        const cardW = cards[0].offsetWidth + 20; // card width + gap
        return Math.round(track.offsetWidth / cardW);
    }

    function scrollCarousel() {
        const cardW = cards[0].offsetWidth + 20;
        track.scrollTo({ left: carouselIdx * cardW, behavior: 'smooth' });
    }

    prevBtn.addEventListener('click', () => {
        carouselIdx = Math.max(0, carouselIdx - 1);
        scrollCarousel();
    });

    nextBtn.addEventListener('click', () => {
        const maxIdx = cards.length - getVisibleCount();
        carouselIdx = Math.min(maxIdx, carouselIdx + 1);
        scrollCarousel();
    });

    // --- Premium scroll animations ---
    // Slide from left
    document.querySelectorAll('.about-images, .contact-left').forEach(el => el.classList.add('reveal-left'));
    // Slide from right
    document.querySelectorAll('.about-content, .contact-right').forEach(el => el.classList.add('reveal-right'));
    // Scale up for cards
    document.querySelectorAll('.ba-card, .gallery-item').forEach(el => el.classList.add('reveal-scale'));
    // Stagger children for grids
    document.querySelectorAll('.services-grid, .testimonials-track').forEach(el => el.classList.add('stagger-children'));
    // Basic reveal for section intros
    document.querySelectorAll('.section-intro, .about-highlights, .trust-bar').forEach(el => el.classList.add('reveal'));

    const allAnimated = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .stagger-children');

    const obs = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    allAnimated.forEach(el => obs.observe(el));

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
