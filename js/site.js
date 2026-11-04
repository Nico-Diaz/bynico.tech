// bynico.tech · interacción y coreografía
(() => {
  const root = document.documentElement;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // WhatsApp: todos los enlaces con texto ya escrito
  const WA = '34624091057';
  const WA_TEXT = 'Hola Nico, vengo de tu web y quiero contarte mi proyecto.';
  document.querySelectorAll('[data-wa]').forEach((a) => {
    const text = a.dataset.waText || WA_TEXT;
    a.href = `https://wa.me/${WA}?text=${encodeURIComponent(text)}`;
    a.target = '_blank';
    a.rel = 'noopener';
  });

  // Cabecera: borde al hacer scroll
  const top = document.querySelector('.top');
  const onScroll = () => top.classList.toggle('is-scrolled', scrollY > 8);
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Entrada del hero
  requestAnimationFrame(() => requestAnimationFrame(() => root.classList.add('is-ready')));

  // Chat: el momento principal. Pregunta → escribiendo… → respuesta automática, tres veces.
  const chat = document.getElementById('chat');
  const count = document.getElementById('chat-count');
  const steps = [...chat.querySelectorAll('[data-step]')].sort((a, b) => a.dataset.step - b.dataset.step);
  let answered = 0;
  const bump = () => {
    answered += 1;
    count.textContent = answered;
    count.classList.remove('bump');
    void count.offsetWidth;
    count.classList.add('bump');
  };

  if (reduced) {
    steps.forEach((s) => !s.classList.contains('msg--typing') && s.classList.add('is-shown'));
    count.textContent = steps.filter((s) => s.classList.contains('msg--out')).length;
  } else {
    const wait = (ms) => new Promise((r) => setTimeout(r, ms));
    const play = async () => {
      await wait(700);
      for (const s of steps) {
        if (s.classList.contains('msg--in')) {
          s.classList.add('is-shown');
          await wait(750);
        } else if (s.classList.contains('msg--typing')) {
          s.classList.add('is-shown');
          await wait(1100);
          s.classList.remove('is-shown');
        } else {
          s.classList.add('is-shown');
          bump();
          await wait(1000);
        }
      }
    };
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) { io.disconnect(); play(); }
    }, { threshold: 0.35 });
    io.observe(chat);
  }

  // Problemas: cada uno se tacha cuando llega a la zona de lectura
  const problems = document.querySelectorAll('.pb');
  if (reduced) {
    problems.forEach((p) => p.classList.add('is-solved'));
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('is-solved'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -40% 0px', threshold: 0.6 });
    problems.forEach((p) => io.observe(p));
  }

  // Botón flotante de WhatsApp (móvil): aparece tras el hero y se esconde en el cierre
  const float = document.querySelector('.float-wa');
  const hero = document.querySelector('.hero');
  const closing = document.querySelector('.closing');
  const seen = new Map([[hero, true], [closing, false]]);
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => seen.set(e.target, e.isIntersecting));
    float.classList.toggle('is-visible', !seen.get(hero) && !seen.get(closing));
  });
  io.observe(hero);
  io.observe(closing);
})();
