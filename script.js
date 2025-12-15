// Fix viewport height for iOS Safari (prevents browser UI from appearing/disappearing)
// This calculates the real viewport height and stores it in a CSS variable
function setViewportHeight() {
    // Get the real viewport height
    const vh = window.innerHeight * 0.01;
    // Set the CSS variable
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

// Set initial viewport height
setViewportHeight();

// Update on resize and orientation change
window.addEventListener('resize', setViewportHeight);
window.addEventListener('orientationchange', () => {
    // Small delay to ensure orientation change is complete
    setTimeout(setViewportHeight, 100);
});

// Prevent iOS Safari from showing/hiding browser UI on scroll
// This helps maintain consistent viewport height
let lastScrollTop = 0;
let ticking = false;

function preventBrowserUI() {
    // Only apply on iOS devices
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    
    if (isIOS) {
        // Update viewport height on scroll to account for browser UI changes
        setViewportHeight();
    }
    
    ticking = false;
}

window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(preventBrowserUI);
        ticking = true;
    }
}, { passive: true });

// Navbar scroll effect
const navbar = document.querySelector('.navbar');
let lastScroll = 0;
let isScrolling = false;
let isNavigatingWithHash = false;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
    updateScrollIndicator();
});

// Update scroll indicator based on current section
function updateScrollIndicator() {
    const sections = document.querySelectorAll('section[id]');
    const dots = document.querySelectorAll('.scroll-indicator-dot');
    const navLinks = document.querySelectorAll('.nav-link');
    const scrollPosition = window.pageYOffset + window.innerHeight / 2;
    let currentSectionId = null;

    sections.forEach((section, index) => {
        const sectionTop = section.offsetTop;
        const sectionBottom = sectionTop + section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
            currentSectionId = sectionId;
            
            // Update scroll indicator dots
            dots.forEach(dot => dot.classList.remove('active'));
            const activeDot = document.querySelector(`[data-section="${sectionId}"]`);
            if (activeDot) {
                activeDot.classList.add('active');
            }
            
            // Update navigation links
            navLinks.forEach(link => link.classList.remove('active'));
            const activeNavLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
            if (activeNavLink) {
                activeNavLink.classList.add('active');
            }
        }
    });

    // Update URL hash without triggering scroll
    // But don't update if we're navigating from another page with a hash
    if (currentSectionId && !isScrolling && !isNavigatingWithHash) {
        const urlHash = window.location.hash;
        // Don't update hash if we're in works section with a specific project ID
        if (urlHash && urlHash.startsWith('#works-')) {
            return; // Keep the project-specific hash
        }
        
        const newHash = `#${currentSectionId}`;
        // Only update hash if it's different AND we're not in the middle of a hash navigation
        // Check if we have a hash in URL that we're trying to navigate to
        if (urlHash && urlHash !== newHash && !urlHash.startsWith('#works-')) {
            // If URL has a hash that's different from current section, don't update
            // This means we're navigating to a specific section
            return;
        }
        if (window.location.hash !== newHash && !urlHash.startsWith('#works-')) {
            history.replaceState(null, null, newHash);
        }
    }
}

// Click on indicator dots to scroll to section
document.querySelectorAll('.scroll-indicator-dot').forEach(dot => {
    dot.addEventListener('click', function() {
        const sectionId = this.getAttribute('data-section');
        const section = document.getElementById(sectionId);
        if (section) {
            // Update URL hash
            history.replaceState(null, null, `#${sectionId}`);
            
            isScrolling = true;
            section.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            setTimeout(() => {
                isScrolling = false;
                updateScrollIndicator();
            }, 1000);
        }
    });
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        // Only handle links that start with # and are not external URLs
        if (!href || !href.startsWith('#') || href.includes('http') || href.includes('www.')) {
            return; // Let the link work normally (external links, etc.)
        }
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            // Remove active class from all nav links
            document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
            // Add active class to clicked link
            this.classList.add('active');
            
            // Update URL hash
            const hash = this.getAttribute('href');
            if (hash && hash !== '#') {
                history.replaceState(null, null, hash);
            }
            
            isScrolling = true;
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            setTimeout(() => {
                isScrolling = false;
                // Update active state based on final scroll position
                updateScrollIndicator();
            }, 1000);
        }
    });
});

// Handle show-more-btn click with smooth animation
document.querySelectorAll('.show-more-btn[href="about.html"]').forEach(btn => {
    // Force button to be visible immediately
    btn.style.opacity = '1';
    btn.style.transform = 'translateX(0)';
    btn.style.visibility = 'visible';
    btn.classList.add('animate');
    
    btn.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Animate button fade out
        this.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';
        this.style.opacity = '0';
        this.style.transform = 'translateY(20px)';
        
        // Animate scroll indicator sidebar fade out
        const scrollIndicator = document.querySelector('.scroll-indicator-sidebar');
        if (scrollIndicator) {
            scrollIndicator.style.transition = 'opacity 0.5s ease-out';
            scrollIndicator.style.opacity = '0';
        }
        
        // Navigate after animation
        setTimeout(() => {
            window.location.href = 'about.html';
        }, 500);
    });
});

// Ensure show-more-btn in about section is always visible
document.addEventListener('DOMContentLoaded', function() {
    const aboutShowMoreBtn = document.querySelector('.about.section .show-more-btn');
    if (aboutShowMoreBtn) {
        // Force visibility immediately
        aboutShowMoreBtn.style.opacity = '1';
        aboutShowMoreBtn.style.transform = 'translateX(0)';
        aboutShowMoreBtn.style.visibility = 'visible';
        aboutShowMoreBtn.classList.add('animate');
        
        // Also ensure it stays visible after observer runs
        setTimeout(() => {
            aboutShowMoreBtn.style.opacity = '1';
            aboutShowMoreBtn.style.transform = 'translateX(0)';
            aboutShowMoreBtn.style.visibility = 'visible';
        }, 100);
    }
});

// Enhanced scroll snap with wheel event
// Only enable on index.html, not on about.html or work.html
let scrollTimeout;
if (!document.body.classList.contains('about-page-body') && !document.body.classList.contains('work-page-body')) {
    window.addEventListener('wheel', (e) => {
        if (isScrolling) return;
        
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            const sections = document.querySelectorAll('section[id]');
            const currentScroll = window.pageYOffset;
            const windowHeight = window.innerHeight;
            
            let targetSection = null;
            
            if (e.deltaY > 0) {
                // Scrolling down
                sections.forEach(section => {
                    if (section.offsetTop > currentScroll + 50) {
                        if (!targetSection || section.offsetTop < targetSection.offsetTop) {
                            targetSection = section;
                        }
                    }
                });
            } else {
                // Scrolling up
                sections.forEach(section => {
                    if (section.offsetTop < currentScroll - 50) {
                        if (!targetSection || section.offsetTop > targetSection.offsetTop) {
                            targetSection = section;
                        }
                    }
                });
            }
            
            if (targetSection) {
                const sectionId = targetSection.getAttribute('id');
                if (sectionId) {
                    history.replaceState(null, null, `#${sectionId}`);
                }
                
                isScrolling = true;
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                setTimeout(() => {
                    isScrolling = false;
                    updateScrollIndicator();
                }, 1000);
            }
        }, 50);
    }, { passive: true });
    
    // Mobile: touch events for scroll-snap (only add touch support, don't modify existing code)
    let touchStartY = 0;
    let touchEndY = 0;
    let touchStartTime = 0;
    let touchScrollTimeout;
    
    window.addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].clientY;
        touchStartTime = Date.now();
    }, { passive: true });
    
    window.addEventListener('touchend', (e) => {
        if (isScrolling) return;
        
        touchEndY = e.changedTouches[0].clientY;
        const touchDuration = Date.now() - touchStartTime;
        const touchDistance = Math.abs(touchEndY - touchStartY);
        
        // Only trigger scroll-snap if it's a significant swipe (more than 50px) and quick (less than 300ms)
        if (touchDistance > 50 && touchDuration < 300) {
            clearTimeout(touchScrollTimeout);
            touchScrollTimeout = setTimeout(() => {
                const sections = document.querySelectorAll('section[id]');
                const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
                const windowHeight = window.innerHeight;
                
                let targetSection = null;
                const scrollDirection = touchEndY < touchStartY ? 'down' : 'up';
                
                if (scrollDirection === 'down') {
                    // Scrolling down - find next section
                    sections.forEach(section => {
                        if (section.offsetTop > currentScroll + windowHeight * 0.3) {
                            if (!targetSection || section.offsetTop < targetSection.offsetTop) {
                                targetSection = section;
                            }
                        }
                    });
                } else {
                    // Scrolling up - find previous section
                    sections.forEach(section => {
                        if (section.offsetTop < currentScroll - windowHeight * 0.3) {
                            if (!targetSection || section.offsetTop > targetSection.offsetTop) {
                                targetSection = section;
                            }
                        }
                    });
                }
                
                if (targetSection) {
                    const sectionId = targetSection.getAttribute('id');
                    if (sectionId) {
                        history.replaceState(null, null, `#${sectionId}`);
                    }
                    
                    isScrolling = true;
                    targetSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    setTimeout(() => {
                        isScrolling = false;
                        updateScrollIndicator();
                    }, 1000);
                }
            }, 100);
        }
    }, { passive: true });
}

// Parallax effect for animated elements
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const clouds = document.querySelectorAll('.cloud');
    const moon = document.querySelector('.moon');
    
    clouds.forEach((cloud, index) => {
        const speed = (index + 1) * 0.1;
        cloud.style.transform = `translateY(${scrolled * speed}px)`;
    });
    
    if (moon) {
        moon.style.transform = `translateY(${scrolled * 0.15}px)`;
    }
});

// Flag to track if we're navigating with hash (from back arrow)
// This prevents animations when navigating from about.html
// Check if it was set by the inline script in index.html
let isNavigatingFromHash = (typeof window !== 'undefined' && window.isNavigatingFromHash) || false;

// Intersection Observer for slide-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

// More permissive options for mobile
const mobileObserverOptions = {
    threshold: 0.05,
    rootMargin: '0px 0px -50px 0px'
};

const isMobile = window.innerWidth <= 768;
const activeObserverOptions = isMobile ? mobileObserverOptions : observerOptions;

const slideObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Check if we're navigating from hash and if element is in target section
            const hash = window.location.hash;
            const isInTargetSection = hash && entry.target.closest(hash);
            
            // If we're navigating from hash and element is in target section, show immediately
            if (isNavigatingFromHash && isInTargetSection) {
                // If element already has animate class and inline styles, skip (was set by inline script)
                if (entry.target.classList.contains('animate') && 
                    entry.target.style.opacity === '1') {
                    return; // Already handled by inline script
                }
                // Show immediately without animation
                entry.target.classList.add('animate');
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateX(0)';
                entry.target.style.transition = 'none';
            } else {
                // Normal animation - ensure inline styles don't interfere
                // Remove any inline styles that might prevent animation
                if (entry.target.style.transition === 'none') {
                    entry.target.style.transition = '';
                }
                // Remove opacity and transform inline styles to allow CSS transitions
                if (entry.target.style.opacity === '1') {
                    entry.target.style.opacity = '';
                }
                if (entry.target.style.transform === 'translateX(0)' || entry.target.style.transform === 'translateX(0px)') {
                    entry.target.style.transform = '';
                }
                // Only animate if element doesn't already have animate class
                if (!entry.target.classList.contains('animate')) {
                    setTimeout(() => {
                        entry.target.classList.add('animate');
                    }, 50);
                }
            }
        } else {
            // Reset animation when element leaves viewport to allow re-animation
            // But don't reset for show-more-btn in about section on mobile
            // And don't reset for slider-controls (they should always be visible)
            const isSliderControls = entry.target.classList.contains('slider-controls');
            if (!(entry.target.classList.contains('show-more-btn') && entry.target.closest('.about.section') && isMobile) && !isSliderControls) {
                entry.target.classList.remove('animate');
                // Always reset inline styles when leaving viewport to allow re-animation
                // This ensures scroll animations work normally after hash navigation
                entry.target.style.opacity = '';
                entry.target.style.transform = '';
                entry.target.style.transition = '';
            }
        }
    });
}, activeObserverOptions);

// Observe all slide-in elements (keep observing, don't unobserve)
document.querySelectorAll('.slide-in-left, .slide-in-right').forEach(element => {
    slideObserver.observe(element);
});

// Special handling for show-more-btn in about section on mobile
if (isMobile) {
    const aboutShowMoreBtn = document.querySelector('.about.section .show-more-btn');
    if (aboutShowMoreBtn) {
        // Force visibility after a short delay if still not visible
        setTimeout(() => {
            if (!aboutShowMoreBtn.classList.contains('animate')) {
                aboutShowMoreBtn.classList.add('animate');
            }
        }, 500);
        
        // Also check when section comes into view
        const aboutSection = document.querySelector('.about.section');
        if (aboutSection) {
            const sectionObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && aboutShowMoreBtn) {
                        setTimeout(() => {
                            aboutShowMoreBtn.classList.add('animate');
                        }, 300);
                    }
                });
            }, { threshold: 0.3 });
            sectionObserver.observe(aboutSection);
        }
    }
}

// Initialize scroll indicator and nav links on load
// But don't update hash if we're navigating with a hash
if (!window.location.hash) {
    updateScrollIndicator();
}

// Also update on page load to set initial active state
window.addEventListener('load', () => {
    // If we have a hash in URL, the DOMContentLoaded handler already handled it
    // Just update the scroll indicator
    if (window.location.hash) {
        // Small delay to ensure everything is settled
        setTimeout(() => {
            updateScrollIndicator();
        }, 100);
    } else {
        updateScrollIndicator();
    }
});

// Also handle hash on DOMContentLoaded for faster response
// This ensures scroll works when navigating from another page
// Note: The inline script in index.html handles the initial scroll
document.addEventListener('DOMContentLoaded', () => {
    // If hash is present, the inline script should have already scrolled
    // Just set up the flags and update indicators
    if (window.location.hash) {
        const hash = window.location.hash;
        // Handle hash with project ID (e.g., #works-projectId)
        let actualHash = hash;
        if (hash.startsWith('#works-')) {
            actualHash = '#works';
        }
        const targetSection = document.querySelector(actualHash);
        if (targetSection) {
            // Set flags to prevent updateScrollIndicator from changing the hash
            // and to disable animations for this section
            isNavigatingWithHash = true;
            isNavigatingFromHash = true;
            
            // If navigating to #about, disable animations for that section
            // Add 'animate' class immediately to all slide-in elements in the section
            if (hash === '#about') {
                const aboutSection = document.querySelector('#about');
                if (aboutSection) {
                    const slideInElements = aboutSection.querySelectorAll('.slide-in-left, .slide-in-right');
                    slideInElements.forEach(element => {
                        // Add animate class immediately to show elements without animation
                        element.classList.add('animate');
                        // Also set inline styles to ensure they're visible
                        element.style.opacity = '1';
                        element.style.transform = 'translateX(0)';
                    });
                }
            }
            
            // Ensure we're at the correct position (in case inline script didn't work)
            // Don't subtract navbar height - offsetTop already positions correctly
            // The padding-top of the section handles the spacing from navbar
            const sectionTop = targetSection.offsetTop;
            const currentScroll = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
            
            // Only adjust if we're not already at the right position
            if (Math.abs(currentScroll - sectionTop) > 10) {
                // Force instant scroll - no animation
                document.documentElement.scrollTop = sectionTop;
                document.body.scrollTop = sectionTop;
                window.scrollTo(0, sectionTop);
            }
            
            isScrolling = true;
            // Small delay to ensure scroll is applied
            setTimeout(() => {
                isScrolling = false;
                // Update scroll indicator but keep the hash
                updateScrollIndicator();
                // Ensure the hash stays as intended
                history.replaceState(null, null, hash);
                // Reset flags after navigation is complete
                setTimeout(() => {
                    isNavigatingWithHash = false;
                    // Reset animation flag after a longer delay to allow normal scroll animations
                    // This allows other sections (like home) to animate normally when scrolling
                    setTimeout(() => {
                        isNavigatingFromHash = false;
                    }, 500);
                }, 100);
            }, 50);
        }
    }
});

// Preload work.html pages for instant navigation
function preloadWorkPages() {
    const workLinks = document.querySelectorAll('.work-show-more');
    workLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && href.includes('work.html')) {
            // Create a hidden link with prefetch
            const prefetchLink = document.createElement('link');
            prefetchLink.rel = 'prefetch';
            prefetchLink.href = href;
            prefetchLink.as = 'document';
            document.head.appendChild(prefetchLink);
            
            // Also fetch the page in background to cache it
            fetch(href, { method: 'GET', cache: 'force-cache' }).catch(() => {
                // Silently fail if prefetch doesn't work
            });
        }
    });
}

// Works Slider Functionality
document.addEventListener('DOMContentLoaded', function() {
    const slides = document.querySelectorAll('.work-slide');
    const dots = document.querySelectorAll('.slider-dot');
    const prevBtn = document.querySelector('.slider-btn-prev');
    const nextBtn = document.querySelector('.slider-btn-next');
    let currentSlide = 0;

    if (slides.length === 0) return;
    
    // Preload work pages when works section is visible
    const worksSection = document.getElementById('works');
    if (worksSection) {
        // Check if works section is visible
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Preload when section becomes visible
                    preloadWorkPages();
                    observer.disconnect();
                }
            });
        }, { threshold: 0.1 });
        
        observer.observe(worksSection);
        
        // Also preload immediately if section is already visible
        const rect = worksSection.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            preloadWorkPages();
        }
    }

    function showSlide(index) {
        // Remove active class from all slides and dots
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));

        // Ensure index is within bounds
        if (index >= slides.length) {
            currentSlide = 0;
        } else if (index < 0) {
            currentSlide = slides.length - 1;
        } else {
            currentSlide = index;
        }

        // Add active class to current slide and dot
        slides[currentSlide].classList.add('active');
        if (dots[currentSlide]) {
            dots[currentSlide].classList.add('active');
        }

        // Animate elements in the active slide
        const activeSlide = slides[currentSlide];
        const animatedElements = activeSlide.querySelectorAll('.slide-in-left, .slide-in-right');
        animatedElements.forEach((element, idx) => {
            // Reset animation by removing class
            element.classList.remove('animate');
            // Force a reflow to ensure the removal is processed
            void element.offsetHeight;
            // Small delay for staggered animation
            setTimeout(() => {
                element.classList.add('animate');
            }, 50 + (idx * 100));
        });
    }

    // Function to show slide by project ID
    function showSlideByProjectId(projectId) {
        slides.forEach((slide, index) => {
            const workId = slide.getAttribute('data-work-id');
            if (workId === projectId) {
                showSlide(index);
                return;
            }
        });
    }

    // Check if URL hash contains a specific project ID (format: #works-projectId)
    function checkForProjectHash() {
        // Check if there's a target project ID set by inline script
        if (window.targetProjectId) {
            showSlideByProjectId(window.targetProjectId);
            // Clear it after use
            delete window.targetProjectId;
            return;
        }
        
        // Otherwise check hash directly
        const hash = window.location.hash;
        if (hash && hash.startsWith('#works-')) {
            const projectId = hash.replace('#works-', '');
            showSlideByProjectId(projectId);
        }
    }

    // Check hash on load
    checkForProjectHash();

    // Also check hash after a short delay to ensure DOM is ready
    setTimeout(checkForProjectHash, 100);
    
    // Also check when hash changes (for browser back/forward)
    window.addEventListener('hashchange', function() {
        checkForProjectHash();
    });

    // Animate elements in the initial active slide when page loads
    // Wait a bit to ensure IntersectionObserver has a chance to work first
    setTimeout(() => {
        const activeSlide = document.querySelector('.work-slide.active');
        if (activeSlide) {
            const animatedElements = activeSlide.querySelectorAll('.slide-in-left, .slide-in-right');
            animatedElements.forEach((element, idx) => {
                // Only animate if not already animated by IntersectionObserver
                if (!element.classList.contains('animate')) {
                    setTimeout(() => {
                        element.classList.add('animate');
                    }, idx * 100);
                }
            });
        }
    }, 500);

    // Next slide
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            showSlide(currentSlide + 1);
        });
    }

    // Previous slide
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            showSlide(currentSlide - 1);
        });
    }

    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            showSlide(index);
        });
    });

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        const worksSection = document.getElementById('works');
        if (!worksSection) return;

        const rect = worksSection.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;

        if (isVisible) {
            if (e.key === 'ArrowLeft') {
                showSlide(currentSlide - 1);
            } else if (e.key === 'ArrowRight') {
                showSlide(currentSlide + 1);
            }
        }
    });

    // Handle show more button click for works
    document.querySelectorAll('.work-show-more').forEach(btn => {
        const href = btn.getAttribute('href');
        
        // Preload on hover for even faster navigation
        btn.addEventListener('mouseenter', function() {
            if (href && href.includes('work.html')) {
                // Aggressive preload on hover
                const prefetchLink = document.createElement('link');
                prefetchLink.rel = 'prefetch';
                prefetchLink.href = href;
                prefetchLink.as = 'document';
                if (!document.querySelector(`link[href="${href}"]`)) {
                    document.head.appendChild(prefetchLink);
                }
                
                // Also fetch immediately
                fetch(href, { method: 'GET', cache: 'force-cache' }).catch(() => {});
            }
        });
        
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Animate button fade out
            this.style.transition = 'opacity 0.3s ease-out, transform 0.3s ease-out';
            this.style.opacity = '0';
            this.style.transform = 'translateY(20px)';
            
            // Animate scroll indicator sidebar fade out
            const scrollIndicator = document.querySelector('.scroll-indicator-sidebar');
            if (scrollIndicator) {
                scrollIndicator.style.transition = 'opacity 0.3s ease-out';
                scrollIndicator.style.opacity = '0';
            }
            
            // Navigate immediately - page should be preloaded
            // Use a very short delay to allow animation to start
            setTimeout(() => {
                window.location.href = href;
            }, 100);
        });
    });
});

// Show more button functionality (you can customize this)
// Exclude work-show-more and buttons with external URLs (Visit Site buttons)
document.querySelectorAll('.show-more-btn:not(.work-show-more)').forEach(btn => {
    btn.addEventListener('click', function(e) {
        // If button has an external URL (Visit Site), let it work normally
        const href = this.getAttribute('href');
        if (href && (href.includes('http') || href.includes('www.') || href.startsWith('https://') || href.startsWith('http://'))) {
            return; // Let the link work normally
        }
        // Add your custom functionality here
        // For example, expand content, show modal, etc.
        console.log('Show more clicked');
    });
});

