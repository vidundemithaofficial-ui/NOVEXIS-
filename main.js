// Professional Wedding Site Scripts

document.addEventListener('DOMContentLoaded', () => {
    // Prevent browser from restoring scroll position
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }
    // Force immediate scroll to top in case browser ignored restoration setting
    window.scrollTo(0, 0);

    // --- 0. ENVELOPE INTERACTION ---
    const seal = document.querySelector('.seal');
    const envelopeOverlay = document.getElementById('envelope-overlay');
    const mainSite = document.getElementById('main-site');
    const music = document.getElementById('music');
    const body = document.body;

    if (seal) {
        seal.addEventListener('click', () => {
            // Start Music
            music.volume = 0.4;
            music.play().catch(e => console.log("Audio play blocked", e));

            const tl = gsap.timeline();

            // 1. Seal disappears
            tl.to(".seal", {
                scale: 0,
                opacity: 0,
                duration: 0.5,
                ease: "back.in(1.7)"
            })
                // 2. CSS Envelope fades away
                .to(".envelope", {
                    opacity: 0,
                    duration: 0.8,
                    ease: "power2.out"
                }, "-=0.2")
                // 3. Custom Envelope (PNG) appears and zooms
                .to(".custom-envelop", {
                    opacity: 1,
                    scale: 1.25,
                    duration: 1.2,
                    ease: "power3.out"
                }, "-=0.4")
                // 4. Fade out the entire overlay and show main site
                .to("#envelope-overlay", {
                    opacity: 0,
                    duration: 1.5,
                    delay: 0.5,
                    onComplete: () => {
                        envelopeOverlay.style.visibility = "hidden";
                        // Ensure we are at the top before showing site
                        window.scrollTo(0, 0);
                        mainSite.classList.remove('site-hidden');
                        mainSite.classList.add('site-visible');
                        body.classList.remove('locked');
                    }
                });
        });
    }

    // --- 0.1 FLOATING DUST PARTICLES ---
    const canvas = document.getElementById('dust');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', resize);
        resize();

        for (let i = 0; i < 40; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                r: Math.random() * 1.5,
                d: Math.random() * 0.4 + 0.1
            });
        }

        function drawDust() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
            ctx.beginPath();
            for (let i = 0; i < particles.length; i++) {
                let p = particles[i];
                ctx.moveTo(p.x, p.y);
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2, true);
            }
            ctx.fill();
            updateDust();
            requestAnimationFrame(drawDust);
        }

        function updateDust() {
            for (let i = 0; i < particles.length; i++) {
                let p = particles[i];
                p.y -= p.d;
                if (p.y < 0) {
                    p.y = canvas.height;
                    p.x = Math.random() * canvas.width;
                }
            }
        }
        drawDust();
    }


    // --- 1. Navigation Toggle ---
    const navToggle = document.getElementById('navToggle');
    const navOverlay = document.getElementById('navOverlay');
    const navLinks = document.querySelectorAll('.nav-link');

    navToggle.addEventListener('click', () => {
        navOverlay.classList.toggle('open');
        navToggle.classList.toggle('active');

        if (navOverlay.classList.contains('open')) {
            navToggle.querySelector('.bar').style.background = '#222';
        } else {
            checkNavColor();
        }
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navOverlay.classList.remove('open');
        });
    });

    // --- 2. Parallax Effect for Hero ---
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        const heroContent = document.querySelector('.hero-content');
        const heroBg = document.querySelector('.hero-bg');

        // Only run parallax if site is visible
        if (!body.classList.contains('locked')) {
            heroContent.style.transform = `translateY(${scrolled * 0.4}px)`;
            heroBg.style.transform = `scale(${1 + scrolled * 0.0005})`;

            // New Section Parallax
            const parallaxItems = document.querySelectorAll('.parallax');
            parallaxItems.forEach(item => {
                const speed = 0.15;
                const rect = item.parentElement.getBoundingClientRect();
                const offset = rect.top * speed;
                item.style.transform = `translateY(${offset}px)`;
            });

            checkNavColor();
        }
    });

    function checkNavColor() {
        if (window.scrollY > window.innerHeight - 50) {
            document.querySelectorAll('.bar').forEach(b => b.style.background = '#222');
        } else {
            // Keep dark or toggle to white depending on background
            document.querySelectorAll('.bar').forEach(b => b.style.background = '#222');
        }
    }

    // --- 3. Countdown Timer ---
    const weddingDate = new Date("August 12, 2026 09:30:00").getTime();

    function updateCountdown() {
        const now = new Date().getTime();
        const distance = weddingDate - now;

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        const countdownContainer = document.getElementById("countdown");

        if (distance < 0) {
            countdownContainer.innerHTML = "<h3>Happily Ever After</h3>";
            return;
        }

        countdownContainer.innerHTML = `
            <div class="countdown-item"><span>${days}</span><label>Days</label></div>
            <div class="countdown-item"><span>${hours}</span><label>Hours</label></div>
            <div class="countdown-item"><span>${minutes}</span><label>Minutes</label></div>
            <div class="countdown-item"><span>${seconds}</span><label>Seconds</label></div>
        `;
    }

    setInterval(updateCountdown, 1000);
    updateCountdown();

    // --- 4. Reveal on Scroll ---
    const observerOptions = {
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    // --- 5. RSVP Form Handling with SheetDB API ---
    const form = document.getElementById('rsvpForm');
    const seatsContainer = document.getElementById('seatsContainer');
    const seatsSelect = document.getElementById('seats');
    const attendingRadios = document.getElementsByName('attending');

    if (form) {
        // Handle conditional visibility of seats
        attendingRadios.forEach(radio => {
            radio.addEventListener('change', (e) => {
                if (e.target.value === 'no') {
                    seatsContainer.style.display = 'none';
                    seatsSelect.required = false;
                } else {
                    seatsContainer.style.display = 'block';
                    seatsSelect.required = true;
                }
            });
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = form.querySelector('button');
            const originalText = btn.innerText;

            // Show loading state
            btn.innerText = "Processing...";
            btn.disabled = true;
            btn.style.opacity = "0.7";

            const formData = new FormData(form);

            fetch('https://sheetdb.io/api/v1/5u9yrdv1rr0ux', {
                method: 'POST',
                body: formData,
            })
                .then(response => response.json())
                .then(data => {
                    // Success state
                    btn.innerText = "See You There!";
                    btn.style.background = "#8da28f"; // Elegant Sage Green
                    btn.style.opacity = "1";

                    form.reset();
                    // Reset seats visibility after form reset
                    seatsContainer.style.display = 'block';
                    seatsSelect.required = true;

                    setTimeout(() => {
                        btn.innerText = originalText;
                        btn.style.background = ""; // Revert to gold gradient
                        btn.disabled = false;
                    }, 4000);
                })
                .catch(error => {
                    console.error('RSVP Error:', error);
                    btn.innerText = "Try Again";
                    btn.style.background = "#c68d8d"; // Soft Muted Red
                    btn.disabled = false;

                    setTimeout(() => {
                        btn.innerText = originalText;
                        btn.style.background = "";
                    }, 4000);
                });
        });
    }
});