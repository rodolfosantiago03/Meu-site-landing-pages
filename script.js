/* ============================================
   ALEX CHEN — DARK PREMIUM LANDING PAGE
   JavaScript Puro | Interações & Animações
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. CANVAS BACKGROUND — Esferas Flutuantes
    // ==========================================
    const canvas = document.getElementById('bg-canvas');
    const ctx = canvas.getContext('2d');
    
    let width, height;
    let mouseX = 0, mouseY = 0;
    let targetMouseX = 0, targetMouseY = 0;
    const spheres = [];
    const sphereCount = 25;
    
    // Cores do tema
    const colors = [
        { r: 59, g: 130, b: 246 },   // Azul elétrico
        { r: 249, g: 115, b: 22 },   // Laranja profundo
        { r: 139, g: 92, b: 246 },   // Roxo
        { r: 251, g: 191, b: 36 }    // Dourado
    ];
    
    class Sphere {
        constructor() {
            this.reset();
        }
        
        reset() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.radius = Math.random() * 80 + 20;
            this.vx = (Math.random() - 0.5) * 0.3;
            this.vy = (Math.random() - 0.5) * 0.3;
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.alpha = Math.random() * 0.08 + 0.02;
            this.pulseSpeed = Math.random() * 0.02 + 0.01;
            this.pulseOffset = Math.random() * Math.PI * 2;
        }
        
        update() {
            // Movimento suave
            this.x += this.vx;
            this.y += this.vy;
            
            // Reação ao mouse (paralaxe)
            const dx = this.x - mouseX;
            const dy = this.y - mouseY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const maxDist = 300;
            
            if (dist < maxDist) {
                const force = (maxDist - dist) / maxDist;
                this.x += (dx / dist) * force * 0.5;
                this.y += (dy / dist) * force * 0.5;
            }
            
            // Bounce nas bordas
            if (this.x < -this.radius) this.x = width + this.radius;
            if (this.x > width + this.radius) this.x = -this.radius;
            if (this.y < -this.radius) this.y = height + this.radius;
            if (this.y > height + this.radius) this.y = -this.radius;
            
            // Pulso
            this.currentAlpha = this.alpha + Math.sin(Date.now() * this.pulseSpeed + this.pulseOffset) * 0.02;
        }
        
        draw() {
            const gradient = ctx.createRadialGradient(
                this.x, this.y, 0,
                this.x, this.y, this.radius
            );
            gradient.addColorStop(0, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${Math.max(0, this.currentAlpha)})`);
            gradient.addColorStop(0.5, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${Math.max(0, this.currentAlpha * 0.5)})`);
            gradient.addColorStop(1, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, 0)`);
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    function resizeCanvas() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    }
    
    function initSpheres() {
        spheres.length = 0;
        for (let i = 0; i < sphereCount; i++) {
            spheres.push(new Sphere());
        }
    }
    
    function animateCanvas() {
        ctx.clearRect(0, 0, width, height);
        
        // Interpolação suave do mouse
        mouseX += (targetMouseX - mouseX) * 0.05;
        mouseY += (targetMouseY - mouseY) * 0.05;
        
        spheres.forEach(sphere => {
            sphere.update();
            sphere.draw();
        });
        
        requestAnimationFrame(animateCanvas);
    }
    
    window.addEventListener('resize', () => {
        resizeCanvas();
        initSpheres();
    });
    
    document.addEventListener('mousemove', (e) => {
        targetMouseX = e.clientX;
        targetMouseY = e.clientY;
    });
    
    // Touch support
    document.addEventListener('touchmove', (e) => {
        targetMouseX = e.touches[0].clientX;
        targetMouseY = e.touches[0].clientY;
    });
    
    resizeCanvas();
    initSpheres();
    animateCanvas();
    
    
    // ==========================================
    // 2. HEADER SCROLL EFFECT
    // ==========================================
    const header = document.getElementById('header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    
    // ==========================================
    // 3. MOBILE MENU
    // ==========================================
    const mobileToggle = document.getElementById('mobile-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');
    
    mobileToggle.addEventListener('click', () => {
        mobileToggle.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });
    
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileToggle.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    
    // ==========================================
    // 4. TYPEWRITER EFFECT
    // ==========================================
    const typewriterElement = document.getElementById('typewriter');
    const phrases = ['para o mundo.', 'com elegância.', 'com impacto.', 'com resultados.'];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;
    
    function typeWriter() {
        const currentPhrase = phrases[phraseIndex];
        
        if (isDeleting) {
            typewriterElement.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 50;
        } else {
            typewriterElement.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 100;
        }
        
        if (!isDeleting && charIndex === currentPhrase.length) {
            isDeleting = true;
            typeSpeed = 2000; // Pausa no final
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typeSpeed = 500;
        }
        
        setTimeout(typeWriter, typeSpeed);
    }
    
    typeWriter();
    
    
    // ==========================================
    // 5. ANIMATED COUNTERS
    // ==========================================
    const statItems = document.querySelectorAll('.stat-item');
    let countersStarted = false;
    
    function animateCounter(element, target, duration = 2000) {
        const valueElement = element.querySelector('.stat-value');
        const suffix = element.querySelector('.stat-suffix');
        const isThousands = target >= 1000;
        const displayTarget = isThousands ? target / 1000 : target;
        const startTime = performance.now();
        
        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing ease-out
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(easeOut * displayTarget);
            
            if (isThousands) {
                valueElement.textContent = current;
                if (suffix) suffix.textContent = 'k';
            } else {
                valueElement.textContent = current;
                if (suffix) suffix.textContent = '%';
            }
            
            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }
        
        requestAnimationFrame(update);
    }
    
    function checkCounters() {
        if (countersStarted) return;
        
        const statsContainer = document.querySelector('.stats-container');
        const rect = statsContainer.getBoundingClientRect();
        
        if (rect.top < window.innerHeight * 0.8) {
            countersStarted = true;
            statItems.forEach(item => {
                const target = parseInt(item.dataset.target);
                animateCounter(item, target);
            });
        }
    }
    
    window.addEventListener('scroll', checkCounters);
    checkCounters(); // Check on load
    
    
    // ==========================================
    // 6. MARQUEE INFINITE LOOP
    // ==========================================
    const marqueeTrack = document.getElementById('marquee-track');
    const marqueeItems = marqueeTrack.innerHTML;
    marqueeTrack.innerHTML = marqueeItems + marqueeItems; // Duplica para loop infinito
    
    
    // ==========================================
    // 7. PARALLAX CARDS (Sobre)
    // ==========================================
    const parallaxCards = document.querySelectorAll('[data-parallax]');
    
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        
        parallaxCards.forEach(card => {
            const speed = card.dataset.parallax === 'slow' ? 0.05 : 0.1;
            const rect = card.getBoundingClientRect();
            const cardCenter = rect.top + rect.height / 2;
            const viewportCenter = window.innerHeight / 2;
            const offset = (cardCenter - viewportCenter) * speed;
            
            card.style.transform = `translateY(${offset}px)`;
        });
    });
    
    
    // ==========================================
    // 8. 3D TILT (Vanilla-Tilt.js)
    // ==========================================
    if (typeof VanillaTilt !== 'undefined') {
        VanillaTilt.init(document.querySelectorAll('[data-tilt]'), {
            max: 15,
            speed: 400,
            glare: true,
            'max-glare': 0.3,
            scale: 1.02
        });
        
        // Elite card com mais intensidade
        VanillaTilt.init(document.querySelectorAll('.card-elite'), {
            max: 20,
            speed: 300,
            glare: true,
            'max-glare': 0.5,
            scale: 1.03
        });
    }
    
    
    // ==========================================
    // 9. TIMELINE SCROLL PROGRESS
    // ==========================================
    const timeline = document.querySelector('.timeline');
    const timelineProgress = document.getElementById('timeline-progress');
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    function updateTimeline() {
        if (!timeline) return;
        
        const rect = timeline.getBoundingClientRect();
        const timelineTop = rect.top;
        const timelineHeight = rect.height;
        const viewportHeight = window.innerHeight;
        
        // Calcula progresso baseado no scroll
        let progress = 0;
        if (timelineTop < viewportHeight * 0.5) {
            progress = Math.min(
                ((viewportHeight * 0.5 - timelineTop) / (timelineHeight - viewportHeight * 0.3)) * 100,
                100
            );
        }
        
        timelineProgress.style.height = `${Math.max(0, progress)}%`;
        
        // Ativa items conforme scroll
        timelineItems.forEach((item, index) => {
            const itemRect = item.getBoundingClientRect();
            const itemTop = itemRect.top;
            
            if (itemTop < viewportHeight * 0.7) {
                item.classList.add('visible');
                item.classList.add('active');
            }
        });
    }
    
    window.addEventListener('scroll', updateTimeline);
    updateTimeline();
    
    
    // ==========================================
    // 10. PORTFOLIO FILTER
    // ==========================================
    const filtroBtns = document.querySelectorAll('.filtro-btn');
    const projetoCards = document.querySelectorAll('.projeto-card');
    
    filtroBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Atualiza botões ativos
            filtroBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filter = btn.dataset.filter;
            
            projetoCards.forEach(card => {
                const category = card.dataset.category;
                
                if (filter === 'all' || category === filter) {
                    card.classList.remove('hidden');
                    card.style.position = 'relative';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.9)';
                    setTimeout(() => {
                        card.classList.add('hidden');
                        card.style.position = 'absolute';
                    }, 400);
                }
            });
        });
    });
    
    
    // ==========================================
    // 11. TESTIMONIALS SLIDER (Auto + Manual)
    // ==========================================
    const sliderTrack = document.getElementById('slider-track');
    const depoimentoCards = document.querySelectorAll('.depoimento-card');
    const sliderDotsContainer = document.getElementById('slider-dots');
    let currentSlide = 0;
    let autoSlideInterval;
    
    // Cria dots
    depoimentoCards.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.classList.add('slider-dot');
        dot.setAttribute('aria-label', `Slide ${index + 1}`);
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        sliderDotsContainer.appendChild(dot);
    });
    
    const sliderDots = document.querySelectorAll('.slider-dot');
    
    function goToSlide(index) {
        currentSlide = index;
        
        // Atualiza cards
        depoimentoCards.forEach((card, i) => {
            card.classList.toggle('active', i === index);
        });
        
        // Atualiza dots
        sliderDots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
        
        // Move track
        sliderTrack.style.transform = `translateX(-${index * 100}%)`;
        
        // Reset auto slide
        clearInterval(autoSlideInterval);
        startAutoSlide();
    }
    
    function startAutoSlide() {
        autoSlideInterval = setInterval(() => {
            currentSlide = (currentSlide + 1) % depoimentoCards.length;
            goToSlide(currentSlide);
        }, 5000);
    }
    
    // Inicializa primeiro slide
    depoimentoCards[0].classList.add('active');
    startAutoSlide();
    
    
    // ==========================================
    // 12. FAQ ACCORDION
    // ==========================================
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Fecha todos
            faqItems.forEach(i => i.classList.remove('active'));
            
            // Abre o clicado (se não estava ativo)
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
    
    
    // ==========================================
    // 13. SCROLL REVEAL (Fade In)
    // ==========================================
    const fadeElements = document.querySelectorAll('section');
    
    function checkFadeElements() {
        fadeElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight * 0.85) {
                el.classList.add('visible');
            }
        });
    }
    
    window.addEventListener('scroll', checkFadeElements);
    checkFadeElements();
    
    
    // ==========================================
    // 14. SMOOTH SCROLL PARA ÂNCORAS
    // ==========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = header.offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    
    // ==========================================
    // 15. WHATSAPP FLOAT — Esconde no footer
    // ==========================================
    const whatsappFloat = document.getElementById('whatsapp-float');
    const footer = document.querySelector('.footer');
    
    window.addEventListener('scroll', () => {
        const footerRect = footer.getBoundingClientRect();
        if (footerRect.top < window.innerHeight) {
            whatsappFloat.style.opacity = '0';
            whatsappFloat.style.pointerEvents = 'none';
        } else {
            whatsappFloat.style.opacity = '1';
            whatsappFloat.style.pointerEvents = 'auto';
        }
    });
    
    
    // ==========================================
    // 16. MAGNETIC BUTTON EFFECT (CTAs)
    // ==========================================
    const magneticBtns = document.querySelectorAll('.btn-primary, .btn-cta-final');
    
    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
        });
        
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = '';
        });
    });
    
    
    // ==========================================
    // 17. CURSOR CUSTOM (Opcional — Desktop)
    // ==========================================
    if (window.matchMedia('(pointer: fine)').matches) {
        const cursor = document.createElement('div');
        cursor.classList.add('custom-cursor');
        cursor.style.cssText = `
            position: fixed;
            width: 20px;
            height: 20px;
            border: 2px solid var(--accent-blue);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            transition: transform 0.15s ease, opacity 0.15s ease;
            mix-blend-mode: difference;
        `;
        document.body.appendChild(cursor);
        
        const cursorDot = document.createElement('div');
        cursorDot.classList.add('cursor-dot');
        cursorDot.style.cssText = `
            position: fixed;
            width: 6px;
            height: 6px;
            background: var(--accent-blue);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            transition: transform 0.05s ease;
        `;
        document.body.appendChild(cursorDot);
        
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX - 10 + 'px';
            cursor.style.top = e.clientY - 10 + 'px';
            cursorDot.style.left = e.clientX - 3 + 'px';
            cursorDot.style.top = e.clientY - 3 + 'px';
        });
        
        // Efeito hover nos links
        document.querySelectorAll('a, button').forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.style.transform = 'scale(2)';
                cursor.style.borderColor = 'var(--accent-orange)';
            });
            el.addEventListener('mouseleave', () => {
                cursor.style.transform = 'scale(1)';
                cursor.style.borderColor = 'var(--accent-blue)';
            });
        });
    }
    
});