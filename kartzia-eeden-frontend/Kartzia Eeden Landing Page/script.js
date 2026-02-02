
feather.replace();


const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true
});



function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);



document.querySelectorAll('nav a, .btn-magnetic').forEach(link => {
  link.addEventListener('click', (e) => {
    const targetId = link.getAttribute('href');
    if (targetId.startsWith('#')) {
      e.preventDefault();
      const target = document.querySelector(targetId);
      if (target) lenis.scrollTo(target);
    }
  });
});

//i used gsap for animations
gsap.registerPlugin(ScrollTrigger);


const tl = gsap.timeline();
tl.to(".loader-curtain span", { opacity: 0, duration: 0.5, delay: 0.5 })
  .to(".loader-curtain", { height: 0, duration: 1, ease: "power4.inOut" })
  .to(".hero-title .char", { y: 0, opacity: 1, stagger: 0.05, duration: 1, ease: "power3.out" }, "-=0.5")
  .from(".hero-subtitle", { y: 20, opacity: 0, duration: 1 }, "-=0.8");


window.addEventListener('scroll', () => {
  const nav = document.querySelector('nav');
  if (window.scrollY > 50) nav.classList.add('scrolled');
  else nav.classList.remove('scrolled');
});


const cursorDot = document.querySelector('.cursor-dot');
const cursorCircle = document.querySelector('.cursor-circle');

window.addEventListener('mousemove', (e) => {
  gsap.to(cursorDot, { x: e.clientX, y: e.clientY, duration: 0 });
  gsap.to(cursorCircle, { x: e.clientX, y: e.clientY, duration: 0.15 });
});


document.querySelectorAll('.trigger').forEach(el => {
  el.addEventListener('mouseenter', () => {
    gsap.to(cursorCircle, { scale: 1.5, background: 'rgba(255,255,255,0.1)', borderColor: 'transparent' });
  });
  el.addEventListener('mouseleave', () => {
    gsap.to(cursorCircle, { scale: 1, background: 'transparent', borderColor: 'rgba(0,0,0,0.2)' });
  });
});


document.querySelectorAll('.btn-magnetic').forEach(btn => {
  btn.addEventListener('mousemove', (e) => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    gsap.to(btn, { x: x * 0.3, y: y * 0.3, duration: 0.3 });
  });
  btn.addEventListener('mouseleave', () => {
    gsap.to(btn, { x: 0, y: 0, duration: 0.3 });
  });
});


if (window.innerWidth > 900) { // for desktop


  ScrollTrigger.create({
    trigger: ".about-wrapper",
    start: "top top",
    end: "bottom bottom",
    pin: ".about-text-content",
  });


  gsap.to(".progress-fill", {
    height: "100%",
    ease: "none",
    scrollTrigger: {
      trigger: ".about-wrapper",
      start: "top top",
      end: "bottom bottom",
      scrub: true
    }
  });


  const images = document.querySelectorAll('.visual-block');
  const texts = document.querySelectorAll('.text-block');

  images.forEach((img, i) => {

    gsap.to(img.querySelector('.img-reveal'), {
      clipPath: "inset(0 0 0% 0)",
      scrollTrigger: {
        trigger: img,
        start: "top 60%",
        end: "top 20%",
        scrub: 1,
      }
    });


    gsap.fromTo(img.querySelector('img'),
      { scale: 1.2, y: -20 },
      {
        scale: 1, y: 0,
        scrollTrigger: {
          trigger: img,
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      }
    );


    ScrollTrigger.create({
      trigger: img,
      start: "top center",
      end: "bottom center",
      onEnter: () => setActiveText(i),
      onEnterBack: () => setActiveText(i)
    });
  });

  function setActiveText(index) {
    texts.forEach((text, i) => {
      if (i === index) {
        text.classList.add('active');
      } else {
        text.classList.remove('active');
      }
    });
  }
}


document.querySelectorAll('.product').forEach(product => {
  const quickBtn = product.querySelector('.quick-view');

  product.addEventListener('mousemove', (e) => {
    const rect = product.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    gsap.to(quickBtn, {
      top: y,
      left: x,
      duration: 0.1,
      ease: "power2.out"
    });
  });
});



gsap.set(".footer-big", { y: 100 });
ScrollTrigger.create({
  trigger: ".page-content",
  start: "bottom bottom",
  onEnter: () => gsap.to(".footer-big", { y: 0, duration: 1, ease: "power2.out" }),
  onLeaveBack: () => gsap.to(".footer-big", { y: 100, duration: 1 })
});