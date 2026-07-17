document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // 1. Sticky Header Scroll Effect
    // ==========================================
    const header = document.querySelector('.main-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // ==========================================
    // 2. Mobile Menu Toggle
    // ==========================================
    const navToggle = document.getElementById('navToggle');
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');

    if (navToggle && navbar) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('open');
            navbar.classList.toggle('open');
        });

        // Close menu when a link is clicked
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('open');
                navbar.classList.remove('open');
            });
        });
    }

    // ==========================================
    // 3. Language Switcher (English / Marathi)
    // ==========================================
    const langSwitch = document.getElementById('langSwitch');
    const labelEn = document.querySelector('.label-en');
    const labelMr = document.querySelector('.label-mr');
    const htmlTag = document.documentElement;

    // Default language is English ('en')
    let currentLang = localStorage.getItem('insightLang') || 'en';

    const updateLanguageUI = (lang) => {
        // Toggle body classes & HTML attributes
        if (lang === 'en') {
            htmlTag.setAttribute('lang', 'en');
            document.body.classList.remove('lang-mr');
            document.body.classList.add('lang-en');
            labelEn.classList.add('active');
            labelMr.classList.remove('active');
        } else {
            htmlTag.setAttribute('lang', 'mr');
            document.body.classList.remove('lang-en');
            document.body.classList.add('lang-mr');
            labelMr.classList.add('active');
            labelEn.classList.remove('active');
        }

        // Update all translation nodes
        document.querySelectorAll('.select-lang').forEach(element => {
            const translation = element.getAttribute(`data-${lang}`);
            if (translation) {
                // If it contains placeholder elements (like icons), keep them and replace text
                // But since our nodes are simple spans/headings, we can replace text content directly.
                if (element.querySelector('i')) {
                    // Node has an icon, only replace direct text node
                    const textNode = Array.from(element.childNodes).find(node => node.nodeType === Node.TEXT_NODE);
                    if (textNode) {
                        textNode.textContent = translation;
                    }
                } else {
                    element.textContent = translation;
                }
            }
        });

        // Update form placeholders specifically
        const formName = document.getElementById('userName');
        const formPhone = document.getElementById('userPhone');
        const formMsg = document.getElementById('userMsg');
        if (formName && formPhone && formMsg) {
            if (lang === 'en') {
                formName.placeholder = "e.g., Rahul Deshmukh";
                formPhone.placeholder = "e.g., 9876543210";
                formMsg.placeholder = "Tell us about your requirement or frame design preference...";
            } else {
                formName.placeholder = "उदा. राहुल देशमुख";
                formPhone.placeholder = "उदा. ९८७६५४३२१०";
                formMsg.placeholder = "मला ब्लू-कट चष्म्याबद्दल चौकशी करायची आहे...";
            }
        }
    };

    // Apply language on load
    updateLanguageUI(currentLang);

    if (langSwitch) {
        langSwitch.addEventListener('click', () => {
            currentLang = currentLang === 'mr' ? 'en' : 'mr';
            localStorage.setItem('insightLang', currentLang);
            updateLanguageUI(currentLang);
        });
    }

    // ==========================================
    // 4. Products Category Filter
    // ==========================================
    const tabBtns = document.querySelectorAll('.tab-btn');
    const productCards = document.querySelectorAll('.product-card');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            tabBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            productCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                if (filterValue === 'all' || cardCategory === filterValue) {
                    card.style.display = 'block';
                    // Trigger reflow for animation
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // ==========================================
    // 5. Testimonial Reviews Slider
    // ==========================================
    const slider = document.getElementById('reviewsSlider');
    const slides = document.querySelectorAll('.review-slide');
    const prevBtn = document.getElementById('prevSlide');
    const nextBtn = document.getElementById('nextSlide');
    const dotsContainer = document.getElementById('sliderDots');
    
    let currentSlide = 0;
    let slideInterval;

    if (slider && slides.length > 0) {
        // Create Dots
        slides.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(index));
            dotsContainer.appendChild(dot);
        });

        const dots = document.querySelectorAll('.dot');

        const updateSlides = () => {
            slides.forEach((slide, index) => {
                slide.classList.remove('active');
                dots[index].classList.remove('active');
            });
            slides[currentSlide].classList.add('active');
            dots[currentSlide].classList.add('active');
        };

        const nextSlide = () => {
            currentSlide = (currentSlide + 1) % slides.length;
            updateSlides();
        };

        const prevSlide = () => {
            currentSlide = (currentSlide - 1 + slides.length) % slides.length;
            updateSlides();
        };

        const goToSlide = (index) => {
            currentSlide = index;
            updateSlides();
            resetTimer();
        };

        const startTimer = () => {
            slideInterval = setInterval(nextSlide, 5000); // Auto slide every 5s
        };

        const resetTimer = () => {
            clearInterval(slideInterval);
            startTimer();
        };

        if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); resetTimer(); });
        if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); resetTimer(); });

        startTimer();
    }

    // ==========================================
    // 6. Contact Form - Redirect to WhatsApp
    // ==========================================
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('userName').value.trim();
            const phone = document.getElementById('userPhone').value.trim();
            const message = document.getElementById('userMsg').value.trim();

            const shopWhatsApp = "917248988205"; // Insight Eyewear Number

            // Prepare pre-filled message text based on selected language
            let textMsg = "";
            if (currentLang === 'en') {
                textMsg = `Hello Insight Eyewear, my name is ${name}. I am contacting you from your website.
*Phone*: ${phone}
*Requirement*: ${message}`;
            } else {
                textMsg = `नमस्कार इन्साईट आयवेअर, माझे नाव ${name} आहे. मी आपल्या वेबसाईटवरून संपर्क करत आहे.
*मोबाईल*: ${phone}
*गरज/चौकशी*: ${message}`;
            }

            // Create WhatsApp URL
            const whatsappUrl = `https://wa.me/${shopWhatsApp}?text=${encodeURIComponent(textMsg)}`;

            // Open WhatsApp in new tab
            window.open(whatsappUrl, '_blank');
        });
    }

    // ==========================================
    // 7. Scroll-Triggered Animation (Intersection Observer)
    // ==========================================
    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                // Unobserve once animated
                animationObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1, // Trigger when 10% of the element is visible
        rootMargin: "0px 0px -50px 0px" // Trigger slightly before it enters viewport
    });

    const revealElements = document.querySelectorAll('.reveal-fade');
    revealElements.forEach(el => {
        animationObserver.observe(el);
    });

    // Handle active class for navigation links during scrolling
    const sections = document.querySelectorAll('section');
    window.addEventListener('scroll', () => {
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - varHeaderHeight())) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });

    function varHeaderHeight() {
        return header.clientHeight + 20;
    }
});
