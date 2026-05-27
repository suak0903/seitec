/* SEITtec — Shared chrome behaviour */
(function(){
  'use strict';

  const nav = document.getElementById('nav');
  const isSolid = nav && nav.classList.contains('solid');

  // ----- Nav scroll state (only when not forced solid) -----
  if (nav && !isSolid){
    let ticking = false;
    function onScroll(){
      const threshold = window.innerWidth >= 1024 ? 100 : 160;
      nav.classList.toggle('scrolled', window.scrollY > threshold);
      ticking = false;
    }
    window.addEventListener('scroll', () => {
      if (!ticking){ requestAnimationFrame(onScroll); ticking = true; }
    }, { passive: true });
    onScroll();
  }

  // ----- Mobile menu -----
  const burger = document.getElementById('burger');
  const mobile = document.getElementById('mobile-menu');
  if (burger && mobile){
    function setMobile(open){
      burger.classList.toggle('open', open);
      mobile.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      mobile.setAttribute('aria-hidden', open ? 'false' : 'true');
      document.body.style.overflow = open ? 'hidden' : '';
    }
    burger.addEventListener('click', () => setMobile(!mobile.classList.contains('open')));
    mobile.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMobile(false)));
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && mobile.classList.contains('open')) setMobile(false);
    });
  }

  // ----- Active section (IntersectionObserver) -----
  const navLinks = document.querySelectorAll('.nav__links a[href^="#"]');
  if (navLinks.length){
    const map = new Map();
    navLinks.forEach(a => {
      const id = a.getAttribute('href').slice(1);
      const el = document.getElementById(id);
      if (el) map.set(el, a);
    });
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => {
        const link = map.get(en.target);
        if (!link) return;
        if (en.isIntersecting && en.intersectionRatio > 0.35){
          navLinks.forEach(l => l.classList.remove('is-active'));
          link.classList.add('is-active');
        }
      });
    }, { threshold: [0.35, 0.6] });
    map.forEach((_, el) => io.observe(el));
  }

  // ----- Hero parallax -----
  const heroImg = document.querySelector('.hero__img');
  if (heroImg && !window.matchMedia('(prefers-reduced-motion: reduce)').matches){
    let raf = null;
    function tick(){
      heroImg.style.transform = 'translate3d(0,' + (window.scrollY * 0.35) + 'px,0)';
      raf = null;
    }
    window.addEventListener('scroll', () => {
      if (!raf) raf = requestAnimationFrame(tick);
    }, { passive: true });
  }

  // ----- Marquee -----
  const marquee = document.querySelector('.marquee');
  if (marquee && !window.matchMedia('(prefers-reduced-motion: reduce)').matches){
    const track = marquee.querySelector('.marquee__track');
    if (track){
      // Ensure the track contains at least two copies for seamless loop.
      const originalChildren = Array.from(track.children);
      const total = originalChildren.length;
      if (total) for (let i = 0; i < total; i++) track.appendChild(originalChildren[i].cloneNode(true));

      let halfWidth = 0;
      function measure(){ halfWidth = track.scrollWidth / 2; }
      measure();
      window.addEventListener('resize', measure);

      const SPEED = 50; // px/sec
      let pos = 0;
      let last = performance.now();
      let dragging = false;
      let startX = 0;
      let startPos = 0;
      let velocity = 0;
      let lastMoveX = 0;
      let lastMoveT = 0;
      let flingT = 0;

      function wrap(p){
        if (halfWidth <= 0) return 0;
        if (p <= -halfWidth) return p + halfWidth;
        if (p > 0) return p - halfWidth;
        return p;
      }

      function frame(now){
        const dt = (now - last) / 1000;
        last = now;
        if (!dragging){
          if (flingT > 0){
            // ease velocity back to autoscroll over 600ms
            const T = 0.6;
            const t = Math.min(1, (now - flingT)/1000 / T);
            const target = -SPEED;
            velocity = velocity + (target - velocity) * t * 0.18;
            if (t >= 1){ flingT = 0; velocity = -SPEED; }
            pos = wrap(pos + velocity * dt);
          } else {
            pos = wrap(pos - SPEED * dt);
          }
          track.style.transform = 'translate3d(' + pos + 'px,0,0)';
        }
        requestAnimationFrame(frame);
      }
      requestAnimationFrame(frame);

      function down(e){
        dragging = true;
        marquee.classList.add('dragging');
        const x = e.touches ? e.touches[0].clientX : e.clientX;
        startX = x; startPos = pos;
        lastMoveX = x; lastMoveT = performance.now();
        velocity = 0; flingT = 0;
      }
      function move(e){
        if (!dragging) return;
        const x = e.touches ? e.touches[0].clientX : e.clientX;
        const now = performance.now();
        const dt = (now - lastMoveT) / 1000;
        if (dt > 0) velocity = (x - lastMoveX) / dt;
        lastMoveX = x; lastMoveT = now;
        pos = wrap(startPos + (x - startX));
        track.style.transform = 'translate3d(' + pos + 'px,0,0)';
        if (e.cancelable && Math.abs(x - startX) > 4) e.preventDefault();
      }
      function up(){
        if (!dragging) return;
        dragging = false;
        marquee.classList.remove('dragging');
        velocity = Math.max(-1400, Math.min(1400, velocity));
        flingT = performance.now();
      }
      marquee.addEventListener('touchstart', down, { passive: true });
      marquee.addEventListener('touchmove', move, { passive: false });
      marquee.addEventListener('touchend', up);
      marquee.addEventListener('touchcancel', up);
      marquee.addEventListener('mousedown', down);
      window.addEventListener('mousemove', move);
      window.addEventListener('mouseup', up);
      window.addEventListener('blur', up);
    }
  }
})();
