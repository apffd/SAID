// === АНИМАЦИЯ СЧЁТЧИКОВ ===
function animateCounters() {
    document.querySelectorAll('.stat-value').forEach(counter => {
        const target = parseFloat(counter.dataset.target);
        const isFloat = target % 1 !== 0;
        let current = 0;
        const step = target / 70;

        const update = () => {
            current += step;
            if (current < target) {
                counter.textContent = isFloat
                    ? current.toFixed(1)
                    : Math.floor(current).toLocaleString('ru-RU');
                requestAnimationFrame(update);
            } else {
                counter.textContent = isFloat
                    ? target.toFixed(1)
                    : target.toLocaleString('ru-RU');
            }
        };
        update();
    });
}

// === ЗАПОЛНЕНИЕ ПОЛОСОК НАВЫКОВ ===
function animateBars() {
    document.querySelectorAll('.bar-fill').forEach(bar => {
        bar.style.width = bar.dataset.width + '%';
    });
}

// === ПОЯВЛЕНИЕ ЭЛЕМЕНТОВ ПРИ СКРОЛЛЕ ===
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.15 });

document.querySelectorAll('.section, .quote, .footer').forEach(el => {
    el.classList.add('reveal');
    revealObserver.observe(el);
});

// === СТАРТ АНИМАЦИЙ ПРИ ДОСТИЖЕНИИ СЕКЦИИ ===
let statsDone = false;
let barsDone = false;

const triggerObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            if (entry.target.id === 'stats' && !statsDone) {
                statsDone = true;
                animateCounters();
            }
            if (entry.target.id === 'skills' && !barsDone) {
                barsDone = true;
                setTimeout(animateBars, 300);
            }
        }
    });
}, { threshold: 0.2 });

const statsSection = document.getElementById('stats');
const skillsSection = document.getElementById('skills');
if (statsSection) triggerObserver.observe(statsSection);
if (skillsSection) triggerObserver.observe(skillsSection);

// === ПЛАВНЫЙ СКРОЛЛ ПО НАВИГАЦИИ ===
document.querySelectorAll('nav a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
        const target = document.querySelector(link.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// === ПАРАЛЛАКС: СЛЕГКА ДВИГАЕМ ОРБЫ ЗА КУРСОРОМ ===
const orbs = document.querySelectorAll('.bg-orb');
let mouseX = 0;
let mouseY = 0;
let orbX = 0;
let orbY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;  // -1..1
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
});

function animateOrbs() {
    // Плавное сглаживание (lerp)
    orbX += (mouseX - orbX) * 0.04;
    orbY += (mouseY - orbY) * 0.04;

    orbs.forEach((orb, i) => {
        const strength = (i + 1) * 15;
        orb.style.setProperty('--px', `${orbX * strength}px`);
        orb.style.setProperty('--py', `${orbY * strength}px`);
    });

    requestAnimationFrame(animateOrbs);
}
animateOrbs();

// === ЭФФЕКТ ТИПА "ПЕЧАТАЮЩИЙСЯ ТЕКСТ" В BADGE ===
// (мелкий штрих, но оживляет hero)
const badge = document.querySelector('.hero-badge');
if (badge) {
    const textNode = [...badge.childNodes].find(n => n.nodeType === Node.TEXT_NODE);
    if (textNode) {
        const original = textNode.textContent.trim();
        textNode.textContent = ' ';
        let i = 0;
        const type = () => {
            if (i <= original.length) {
                textNode.textContent = ' ' + original.slice(0, i);
                i++;
                setTimeout(type, 60);
            }
        };
        setTimeout(type, 600);
    }
}

// === ПОДСВЕТКА АКТИВНОЙ СЕКЦИИ В НАВИГАЦИИ ===
const navLinks = document.querySelectorAll('.nav a');
const sections = [...document.querySelectorAll('section[id]')];

const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.id;
            navLinks.forEach(link => {
                link.classList.toggle(
                    'active',
                    link.getAttribute('href') === '#' + id
                );
            });
        }
    });
}, { threshold: 0.4, rootMargin: '-20% 0px -50% 0px' });

sections.forEach(sec => navObserver.observe(sec));

// === ПРИВЕТСТВИЕ В КОНСОЛИ ===
console.log(
    '%c САИД — CS LEGEND ',
    'background: linear-gradient(90deg,#ff4fa3,#14e0c8); color:#0a0710; font-size:22px; font-weight:900; padding:12px 24px; border-radius:10px; letter-spacing:2px;'
);
console.log(
    '%c Добро пожаловать на сайт Саида. GL HF! 🎯',
    'color:#14e0c8; font-size:14px; font-family:monospace;'
);