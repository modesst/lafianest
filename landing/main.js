/* landing/main.js */
document.addEventListener('DOMContentLoaded', () => {
    initCustomCursor();
    initScrollReveal();
    initNavScroll();
    initParallax();
    initCounters();
    initTrustRings();
});

/**
 * 1. Custom Cursor Logic
 * Two elements: a small dot and a lagging ring for a fluid feel.
 */
function initCustomCursor() {
    const dot = document.getElementById('cursor-dot');
    const ring = document.getElementById('cursor-ring');
    
    if (!dot || !ring) return;

    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;

    document.addEventListener('mousemove', e => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Immediate dot move
        dot.style.left = `${mouseX}px`;
        dot.style.top = `${mouseY}px`;
    });

    // Lagging ring animation (LERP)
    function animateRing() {
        ringX += (mouseX - ringX) * 0.15;
        ringY += (mouseY - ringY) * 0.15;
        
        ring.style.left = `${ringX}px`;
        ring.style.top = `${ringY}px`;
        
        requestAnimationFrame(animateRing);
    }
    animateRing();

    // Hover states for interactive elements
    const interactives = document.querySelectorAll('a, button, input, select, .prop-card');
    interactives.forEach(el => {
        el.addEventListener('mouseenter', () => {
            dot.classList.add('hovered');
            ring.classList.add('hovered');
        });
        el.addEventListener('mouseleave', () => {
            dot.classList.remove('hovered');
            ring.classList.remove('hovered');
        });
    });
}

/**
 * 2. Scroll Reveal Logic
 * Uses IntersectionObserver for efficient reveal animations.
 */
function initScrollReveal() {
    const options = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in');
                // Optional: stop observing after reveal
                // observer.unobserve(entry.target);
            }
        });
    }, options);

    const revealables = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
    revealables.forEach(el => observer.observe(el));
}

/**
 * 3. Navigation Scroll Behavior
 * Toggles background and padding on scroll.
 */
function initNavScroll() {
    const nav = document.getElementById('nav');
    if (!nav) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 80) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });
}

/**
 * 4. Parallax Scrolling
 * Subtle movement for hero collage and mesh.
 */
function initParallax() {
    const hero = document.getElementById('hero');
    const items = document.querySelectorAll('.collage-item');
    const content = document.querySelector('.hero-content');
    
    if (!hero) return;

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        
        if (scrolled < window.innerHeight) {
            // Content parallax
            if (content) {
                content.style.transform = `translateY(${scrolled * 0.2}px)`;
                content.style.opacity = 1 - (scrolled / 700);
            }
            
            // Collage items parallax (different speeds)
            items.forEach((item, index) => {
                const speed = (index + 1) * 0.05;
                item.style.transform = `translateY(${scrolled * speed}px)`;
            });
        }
    });
}

/**
 * 5. Animated Counters
 * Triggers when stats section enters viewport.
 */
function initCounters() {
    const statsSection = document.querySelector('.hero-stats');
    if (!statsSection) return;

    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            const counters = statsSection.querySelectorAll('.stat-num');
            counters.forEach(animateCounter);
            observer.disconnect();
        }
    }, { threshold: 0.5 });

    observer.observe(statsSection);

    function animateCounter(el) {
        const target = parseInt(el.getAttribute('data-target'));
        const suffix = el.getAttribute('data-suffix') || '';
        let count = 0;
        const duration = 2000; // 2 seconds
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Ease-out cubic
            const easedProgress = 1 - Math.pow(1 - progress, 3);
            count = Math.floor(easedProgress * target);
            
            el.textContent = count.toLocaleString() + suffix;

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }
        requestAnimationFrame(update);
    }
}

/**
 * 6. Dynamic Trust Score Rings
 * Generates SVG progress circles based on data-score.
 */
function initTrustRings() {
    const containers = document.querySelectorAll('.trust-score-mini');
    
    containers.forEach(container => {
        const score = parseInt(container.getAttribute('data-score')) || 0;
        const radius = 13;
        const circumference = 2 * Math.PI * radius;
        const offset = circumference - (score / 100) * circumference;
        
        let color = '--teal';
        if (score < 40) color = '--error';
        else if (score < 75) color = '--gold';

        container.innerHTML = `
            <svg width="32" height="32" viewBox="0 0 32 32">
                <circle cx="16" cy="16" r="${radius}" fill="none" stroke="var(--bg-deep)" stroke-width="2.5"/>
                <circle cx="16" cy="16" r="${radius}" fill="none" stroke="var(${color})" stroke-width="2.5"
                    stroke-dasharray="${circumference}" stroke-dashoffset="${offset}"
                    stroke-linecap="round" style="transition: stroke-dashoffset 1s ease-out;"/>
            </svg>
            <div class="trust-ring-val" style="position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-size: 8px; font-weight: 700; color: var(--navy);">
                ${score}
            </div>
        `;
    });
}
