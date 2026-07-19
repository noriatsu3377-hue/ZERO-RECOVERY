document.addEventListener('DOMContentLoaded', () => {
    
    /* ==========================================================================
       Opening Animation Logic
       ========================================================================== */
    const opening = document.getElementById('opening');
    const skipBtn = document.getElementById('skip-btn');
    const body = document.body;
    
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Check session storage if user has already seen the animation in this session
    const hasSeenAnimation = sessionStorage.getItem('zeroRecoveryAnimationSeen');

    const finishAnimation = () => {
        opening.classList.add('is-hidden');
        body.classList.remove('no-scroll');
        sessionStorage.setItem('zeroRecoveryAnimationSeen', 'true');
        
        // Trigger fade-in for hero elements if they are in view
        setTimeout(() => {
            const heroElms = document.querySelectorAll('.hero.fade-in');
            heroElms.forEach(elm => elm.classList.add('is-visible'));
        }, 500); // Wait for opening to fade out
    };

    if (prefersReducedMotion || hasSeenAnimation) {
        // Skip animation entirely
        opening.style.display = 'none';
        finishAnimation();
    } else {
        // Prevent scrolling during animation
        body.classList.add('no-scroll');
        
        // Auto finish animation after 4.5 seconds (matches CSS animation duration)
        setTimeout(finishAnimation, 4500);

        // Allow manual skip
        if (skipBtn) {
            skipBtn.addEventListener('click', finishAnimation);
        }
    }

    /* ==========================================================================
       Scroll Fade-in Animation (Intersection Observer)
       ========================================================================== */
    const fadeElements = document.querySelectorAll('.fade-in');

    if ('IntersectionObserver' in window) {
        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -10% 0px',
            threshold: 0.1
        };

        const fadeObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target); // Stop observing once faded in
                }
            });
        }, observerOptions);

        fadeElements.forEach(elm => {
            fadeObserver.observe(elm);
        });
    } else {
        // Fallback for browsers without IntersectionObserver
        fadeElements.forEach(elm => elm.classList.add('is-visible'));
    }

    /* ==========================================================================
       Accordion Logic
       ========================================================================== */
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const content = header.nextElementSibling;
            const isExpanded = header.getAttribute('aria-expanded') === 'true';

            // Toggle current accordion
            if (isExpanded) {
                header.setAttribute('aria-expanded', 'false');
                content.style.maxHeight = null;
            } else {
                header.setAttribute('aria-expanded', 'true');
                content.style.maxHeight = content.scrollHeight + "px";
            }
        });
    });

    /* ==========================================================================
       Fixed CTA Logic (Smartphone)
       ========================================================================== */
    const fixedCta = document.getElementById('fixed-cta');
    const heroSection = document.getElementById('hero');
    
    if (fixedCta && heroSection && 'IntersectionObserver' in window) {
        const ctaObserverOptions = {
            root: null,
            threshold: 0
        };

        const ctaObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Show fixed CTA when hero section is not visible
                if (!entry.isIntersecting) {
                    fixedCta.classList.remove('hidden');
                } else {
                    fixedCta.classList.add('hidden');
                }
            });
        }, ctaObserverOptions);

        ctaObserver.observe(heroSection);
    }
    
    // Handle resizing for Accordions if content changes height
    window.addEventListener('resize', () => {
        const openHeaders = document.querySelectorAll('.accordion-header[aria-expanded="true"]');
        openHeaders.forEach(header => {
            const content = header.nextElementSibling;
            content.style.maxHeight = content.scrollHeight + "px";
        });
    });
});
