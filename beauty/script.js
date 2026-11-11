const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, {threshold: 0.12});
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
menuButton.addEventListener('click', () => {
  const opened = nav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(opened));
});
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
}));

document.getElementById('year').textContent = new Date().getFullYear();

const form = document.getElementById('bookingForm');
const hint = document.getElementById('formHint');
form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const message = `Здравствуйте! Хочу записаться в Brows.Asya.%0AИмя: ${encodeURIComponent(data.get('name'))}%0AКонтакт: ${encodeURIComponent(data.get('contact'))}%0AУслуга: ${encodeURIComponent(data.get('service'))}`;
  const plain = decodeURIComponent(message.replaceAll('%0A', '\n'));
  try {
    await navigator.clipboard.writeText(plain);
    hint.textContent = 'Заявка скопирована! Отправь её мастеру в удобный мессенджер. Добавь свои контакты в сайт, чтобы подключить прямую запись.';
  } catch {
    hint.textContent = plain;
  }
});

// Service rows lead directly to the booking form with the selected service.
document.querySelectorAll('.service-row').forEach(row => {
  row.setAttribute('role','button');
  row.setAttribute('tabindex','0');
  const choose = () => {
    const title = row.querySelector('h3')?.textContent?.trim();
    const select = document.querySelector('.booking-form select[name="service"]');
    if (select && title) {
      const option = [...select.options].find(o => o.text.trim() === title);
      if (option) select.value = option.value;
    }
    document.querySelector('#booking')?.scrollIntoView({behavior:'smooth'});
  };
  row.addEventListener('click', choose);
  row.addEventListener('keydown', e => { if(e.key === 'Enter' || e.key === ' '){e.preventDefault();choose();} });
});
// Tap gallery images for a full-screen view.
const lightbox = document.createElement('div');
lightbox.className = 'image-lightbox';
lightbox.innerHTML = '<button type="button" aria-label="Закрыть">×</button><img alt="">';
document.body.appendChild(lightbox);
const lightboxImage = lightbox.querySelector('img');
const closeLightbox = () => lightbox.classList.remove('open');
lightbox.querySelector('button').addEventListener('click', closeLightbox);
lightbox.addEventListener('click', e => { if(e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', e => { if(e.key === 'Escape') closeLightbox(); });
document.querySelectorAll('.gallery figure img, .intro-photo img').forEach(img => {
  img.style.cursor = 'zoom-in';
  img.addEventListener('click', () => {
    lightboxImage.src = img.src;
    lightboxImage.alt = img.alt;
    lightbox.classList.add('open');
  });
});
