const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const header = document.getElementById('header');
const contactForm = document.getElementById('contactForm');
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');
const skillCards = document.querySelectorAll('.skill-card');
const cards = document.querySelectorAll('.skill-card, .education-card');

function resetHamburgerIcon() {
    const spans = hamburger.querySelectorAll('span');
    spans.forEach((span) => {
        span.style.transform = 'none';
        span.style.opacity = '1';
    });
}

function closeMobileMenu() {
    navMenu.classList.remove('active');
    resetHamburgerIcon();
}

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');

    const spans = hamburger.querySelectorAll('span');
    if (navMenu.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translate(8px, 9px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(7px, -8px)';
    } else {
        resetHamburgerIcon();
    }
});

document.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('click', closeMobileMenu);
});

function updateActiveLink() {
    const scrollPosition = window.scrollY + 100;

    sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navLinks.forEach((link) => {
                link.classList.remove('active');
                if (link.getAttribute('href').includes(section.id)) {
                    link.classList.add('active');
                }
            });
        }
    });
}

function animateSkills() {
    skillCards.forEach((card) => {
        const cardTop = card.getBoundingClientRect().top;

        if (cardTop < window.innerHeight) {
            const progressBars = card.querySelectorAll('.skill-progress');
            progressBars.forEach((bar) => {
                const width = bar.dataset.width || bar.style.width;
                if (!bar.dataset.width) {
                    bar.dataset.width = width;
                }
                bar.style.width = '0';
                setTimeout(() => {
                    bar.style.width = bar.dataset.width;
                }, 100);
            });
        }
    });
}

const observer = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';

                if (entry.target.classList.contains('skills-section')) {
                    animateSkills();
                }
            }
        });
    },
    {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    }
);

document.querySelectorAll('.skill-card, .timeline-item, .education-card, .skills-section').forEach((el) => {
    if (!el.classList.contains('skills-section')) {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    }
    observer.observe(el);
});

if (contactForm) {
    contactForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData.entries());
        showSuccessMessage(data.name || '');
        contactForm.reset();
    });
}

function showSuccessMessage(name) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
        <div class="toast-content">
            <i class="fas fa-check-circle"></i>
            <span>Merci ${name} ! Votre message a ete envoye avec succes.</span>
            <button type="button">Fermer</button>
        </div>
    `;

    document.body.appendChild(toast);

    const closeButton = toast.querySelector('button');
    closeButton.addEventListener('click', () => {
        toast.remove();
    });

    toast.style.opacity = '0';
    toast.style.transform = 'translateY(100px)';

    setTimeout(() => {
        toast.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        toast.style.opacity = '1';
        toast.style.transform = 'translateY(0)';
    }, 10);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(-100px)';
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 5000);
}

window.addEventListener('load', () => {
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.style.opacity = '1';
        heroContent.style.transform = 'translateY(0)';
    }

    const loader = document.createElement('div');
    loader.className = 'loader-overlay';
    loader.innerHTML = `
        <div class="loader-content">
            <i class="fas fa-spinner fa-spin"></i>
            <span>Chargement...</span>
        </div>
    `;

    document.body.appendChild(loader);

    setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => loader.remove(), 300);
    }, 800);
});

window.addEventListener('scroll', () => {
    updateActiveLink();

    const scrolled = window.scrollY;
    const heroVisual = document.querySelector('.hero-visual');
    if (heroVisual && scrolled < 800) {
        heroVisual.style.transform = `translateY(${scrolled * 0.3}px)`;
    }

    if (scrolled > 100) {
        header.style.padding = '0.5rem 0';
        header.style.background = 'rgba(255, 255, 255, 0.98)';
    } else {
        header.style.padding = '1rem 0';
        header.style.background = 'rgba(255, 255, 255, 0.95)';
    }

    animateSkills();
});

cards.forEach((card) => {
    card.addEventListener('mousemove', (event) => {
        const rect = card.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 12;
        const rotateY = (centerX - x) / 12;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
    });
});

window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        closeMobileMenu();
    }
});

updateActiveLink();
