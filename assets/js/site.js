/* =========================================================
   Oratorio Madonna dei Poveri — script condiviso del sito
   ========================================================= */

/* ---------------------------------------------------------
   DATI: orario settimanale reale delle attività.
   Unica fonte di verità, usata sia per la sezione "Orari"
   sia per il widget "Oggi in Oratorio" nella hero.
   --------------------------------------------------------- */
const SCHEDULE = [
    { day: 'Lunedì', items: [
        { time: '17:00 – 18:30', title: 'Primi Calci', group: 'Elementari', detail: 'Bambini di 5, 6 (1ª elementare) e 7 (2ª elementare) anni', category: 'elementari' },
        { time: '17:00 – 18:00', title: 'Catechismo · Prima Comunione', group: 'Elementari', detail: 'Bambini di 4ª elementare', category: 'elementari' }
    ]},
    { day: 'Martedì', items: [
        { time: '17:00 – 18:30', title: 'Calcio', group: 'Medie', detail: 'Ragazzi di 1ª, 2ª e 3ª media', category: 'medie' },
        { time: '17:00 – 18:00', title: 'Catechismo · Prima Confessione', group: 'Elementari', detail: 'Bambini di 3ª elementare', category: 'elementari' }
    ]},
    { day: 'Mercoledì', items: [
        { time: '17:00 – 18:00', title: 'Catechismo · Santa Cresima', group: 'Medie', detail: 'Ragazzi di 1ª media', category: 'medie' }
    ]},
    { day: 'Giovedì', items: [
        { time: '17:30 – 19:00', title: 'Calcio', group: 'Elementari', detail: 'Bambini di 3ª, 4ª e 5ª elementare', category: 'elementari' },
        { time: '17:00 – 18:00', title: 'Catechismo · Santa Cresima', group: 'Elementari', detail: 'Bambini di 5ª elementare', category: 'elementari' }
    ]},
    { day: 'Venerdì', items: [
        { time: '20:30 – 22:30', title: 'Pallavolo', group: 'Medie', detail: 'Ragazzi dalla 2ª/3ª media in poi', category: 'medie' }
    ]},
    { day: 'Sabato', items: [
        { time: '15:00 – 17:30', title: 'Attività e giochi', group: 'Elementari & Medie', detail: 'Ragazzi dalla 3ª elementare alla 3ª media', category: 'elementari medie' },
        { time: '15:00 – 17:30', title: 'Catechismo', group: 'Elementari', detail: 'Bambini dalla 1ª alla 2ª elementare', category: 'elementari' }
    ]},
    { day: 'Domenica', items: [
        { time: '11:00', title: 'S. Messa della Comunità Parrocchiale', group: 'Tutta la comunità', detail: '', category: 'comunita' }
    ]}
];

/* ---------------------------------------------------------
   1. ANNO CORRENTE NEL FOOTER
   --------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
    const yearEl = document.getElementById('current-year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
});

/* ---------------------------------------------------------
   2. TOGGLE MENU MOBILE (HAMBURGER)
   --------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuIcon = document.getElementById('menu-icon');
    if (!mobileMenuBtn || !mobileMenu || !menuIcon) return;

    const mobileLinks = mobileMenu.querySelectorAll('.mobile-link');

    mobileMenuBtn.addEventListener('click', () => {
        const isHidden = mobileMenu.classList.contains('hidden');
        mobileMenu.classList.toggle('hidden', !isHidden ? true : false);
        if (isHidden) {
            mobileMenu.classList.remove('hidden');
            menuIcon.classList.remove('fa-bars');
            menuIcon.classList.add('fa-xmark');
        } else {
            mobileMenu.classList.add('hidden');
            menuIcon.classList.remove('fa-xmark');
            menuIcon.classList.add('fa-bars');
        }
    });

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
            menuIcon.classList.remove('fa-xmark');
            menuIcon.classList.add('fa-bars');
        });
    });
});

/* ---------------------------------------------------------
   3. WIDGET "OGGI IN ORATORIO" (hero, solo home page)
   --------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('today-widget');
    if (!container) return;

    const giorni = ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'];
    const oggiNome = giorni[new Date().getDay()];
    const giornoData = SCHEDULE.find(d => d.day === oggiNome);

    const labelEl = document.getElementById('today-label');
    if (labelEl) labelEl.textContent = oggiNome;

    if (!giornoData) {
        container.innerHTML = `
            <div class="p-4 rounded-2xl bg-slate-50 text-sm text-slate-500 text-center">
                Nessuna attività fissa oggi: passa a trovarci comunque, la sede è aperta per lo Spazio Ragazzi!
            </div>`;
        return;
    }

    container.innerHTML = giornoData.items.map(item => `
        <div class="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 hover:bg-sky-50 transition-colors">
            <div class="w-9 h-9 shrink-0 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center text-sm font-bold">
                <i class="fa-regular fa-clock"></i>
            </div>
            <div class="min-w-0">
                <div class="text-sm font-semibold text-slate-800 truncate">${item.title}</div>
                <div class="text-xs text-slate-500">${item.time} · ${item.group}</div>
            </div>
        </div>`).join('');
});

/* ---------------------------------------------------------
   4. TABELLA ORARI SETTIMANALI (sezione #orari, solo home page)
   --------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
    const scheduleEl = document.getElementById('schedule-list');
    if (!scheduleEl) return;

    scheduleEl.innerHTML = SCHEDULE.map(giorno => `
        <div class="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6">
            <h3 class="font-heading text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-brand-sky"></span> ${giorno.day}
            </h3>
            <div class="space-y-3">
                ${giorno.items.map(item => `
                <div class="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-4 p-3 rounded-2xl bg-slate-50">
                    <div class="sm:w-36 shrink-0 text-sm font-bold text-brand-blue">${item.time}</div>
                    <div class="flex-1 min-w-0">
                        <div class="text-sm font-semibold text-slate-800">${item.title}</div>
                        ${item.detail ? `<div class="text-xs text-slate-500">${item.detail}</div>` : ''}
                    </div>
                    <div class="shrink-0"><span class="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg text-xs font-semibold">${item.group}</span></div>
                </div>`).join('')}
            </div>
        </div>`).join('');
});

/* ---------------------------------------------------------
   5. FILTRO ATTIVITÀ INTERATTIVO (sezione #attivita)
   --------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
    const filterButtons = document.querySelectorAll('#filter-buttons .filter-btn');
    const activityCards = document.querySelectorAll('#activities-grid .activity-card');
    if (!filterButtons.length) return;

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => {
                btn.classList.remove('bg-brand-blue', 'text-white', 'shadow-md', 'active-filter');
                btn.classList.add('bg-white', 'text-slate-700', 'border', 'border-slate-200');
            });
            button.classList.remove('bg-white', 'text-slate-700', 'border', 'border-slate-200');
            button.classList.add('bg-brand-blue', 'text-white', 'shadow-md', 'active-filter');

            const filterValue = button.getAttribute('data-filter');
            activityCards.forEach(card => {
                const categories = card.getAttribute('data-category') || '';
                if (filterValue === 'all' || categories.includes(filterValue)) {
                    card.style.display = 'flex';
                    setTimeout(() => { card.style.opacity = '1'; card.style.transform = 'scale(1)'; }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.95)';
                    setTimeout(() => { card.style.display = 'none'; }, 200);
                }
            });
        });
    });
});

/* ---------------------------------------------------------
   6. FAQ ACCORDION
   --------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
    const faqBtns = document.querySelectorAll('.faq-btn');
    faqBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const content = btn.nextElementSibling;
            const icon = btn.querySelector('.faq-icon');
            const isOpen = !content.classList.contains('hidden');

            document.querySelectorAll('.faq-content').forEach(c => c.classList.add('hidden'));
            document.querySelectorAll('.faq-icon').forEach(i => i.classList.remove('rotate-180'));

            if (!isOpen) {
                content.classList.remove('hidden');
                icon.classList.add('rotate-180');
            }
        });
    });
});

/* ---------------------------------------------------------
   7. MODALE DI CONFERMA + FORM DI CONTATTO
   NB: il modulo di pre-iscrizione online è stato rimosso su
   richiesta. Il form "Scrivici" resta come placeholder: per
   renderlo funzionante collegalo a un servizio come Formspree,
   EmailJS o a un tuo indirizzo "mailto:".
   --------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('confirmation-modal');
    if (!modal) return;

    const modalTitle = document.getElementById('modal-title');
    const modalMessage = document.getElementById('modal-message');
    const closeModalBtn = document.getElementById('close-modal-btn');

    function showModal(title, message) {
        modalTitle.textContent = title;
        modalMessage.textContent = message;
        modal.classList.remove('hidden');
    }

    closeModalBtn.addEventListener('click', () => modal.classList.add('hidden'));
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.classList.add('hidden'); });

    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const contactName = document.getElementById('contact-name').value;
            showModal(
                'Messaggio Inviato!',
                `Grazie ${contactName}, il tuo messaggio è stato inviato correttamente alla segreteria dell'Oratorio Madonna dei Poveri. Ti risponderemo il prima possibile. (Placeholder: collega questo form a un servizio di invio reale.)`
            );
            contactForm.reset();
        });
    }
});

/* ---------------------------------------------------------
   8. ANIMAZIONE DI COMPARSA DISCRETA (IntersectionObserver)
   --------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
    const revealEls = document.querySelectorAll('.reveal');
    if (!revealEls.length || !('IntersectionObserver' in window)) {
        revealEls.forEach(el => el.classList.add('is-visible'));
        return;
    }
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    revealEls.forEach(el => observer.observe(el));
});
