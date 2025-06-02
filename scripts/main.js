/* ========= Configs ========= */
const HEADER_HEIGHT   = 80;
const SCROLL_OFFSET   = HEADER_HEIGHT;
const SCROLL_DURATION = 400;
const CAROUSEL_INTERVAL = 5000;

/* ========= Menu hambúrguer ========= */
const nav = document.querySelector('nav');
document.querySelector('#menu-toggle')?.addEventListener('click', e => {
  nav.classList.toggle('collapsed');
  e.currentTarget.firstElementChild.classList.toggle('fa-bars');
  e.currentTarget.firstElementChild.classList.toggle('fa-xmark');
});

/* ========= Smooth-scroll ========= */
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click',e=>{
    const el=document.querySelector(a.getAttribute('href'));
    if(!el)return;
    e.preventDefault();
    const y=el.getBoundingClientRect().top+scrollY-SCROLL_OFFSET;
    smooth(y,SCROLL_DURATION); nav.classList.add('collapsed');
  });
});
function smooth(to,dur=100){const s =scrollY, d= to-s, e=t=>t<.5?2*t*t:1-(-2*t+2)**2/2;let t0;
  requestAnimationFrame(function step(ts){t0??=ts;
    const p=Math.min((ts-t0)/dur,1);scrollTo(0,s+d*e(p));
    p<1&&requestAnimationFrame(step);});
}

/* ========= Scroll-spy ========= */
const sections=[...document.querySelectorAll('section[id]')];
const links=document.querySelectorAll('nav a[href^="#"]');
addEventListener('scroll',()=>{
  const y=scrollY+SCROLL_OFFSET+1;
  const cur=[...sections].reverse().find(s=>y>=s.offsetTop);
  links.forEach(l=>l.classList.toggle('active',cur&&l.getAttribute('href')==='#'+cur.id));
});

/* ========= Fade-in ========= */
const io=new IntersectionObserver(es=>{
  es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('show');io.unobserve(e.target);} });
},{rootMargin:'0px 0px -20% 0px'});
document.querySelectorAll('[data-animate]').forEach(el=>io.observe(el));

/* ========= Parallax Hero ========= */
const hero=document.querySelector('.hero-image img');
hero&&addEventListener('scroll',()=>hero.style.transform=`translateY(${scrollY*0.25}px)`,{passive:true});

/* ========= Carousel ========= */
class Carousel{
  constructor(root){
    this.root=root;
    this.track=root.querySelector('.carousel-track');
    this.cards=[...this.track.children];
    if(this.cards.length<2)return;

    /* === clones fantasma (3 em cada ponta) === */
    for(let i=0;i<3;i++){
      const front=this.cards[i].cloneNode(true);
      const back =this.cards[this.cards.length-1-i].cloneNode(true);
      /* ★ torna clones sempre visíveis */
      [front,back].forEach(cl=>{
        cl.removeAttribute('data-animate');
        cl.classList.add('show');
      });
      this.track.append(front);
      this.track.prepend(back);
    }
    this.cards=[...this.track.children];

    this.index=3; this.moving=false;
    this.prev=root.querySelector('.prev');
    this.next=root.querySelector('.next');
    this.prev.addEventListener('click',()=>this.go(-1));
    this.next.addEventListener('click',()=>this.go( 1));

    /* swipe */
    let sx=0;
    this.track.addEventListener('touchstart',e=>sx=e.touches[0].clientX);
    this.track.addEventListener('touchend',e=>{
      const dx=e.changedTouches[0].clientX-sx;
      Math.abs(dx)>50&&this.go(dx>0?-1:1);
    });

    this.track.addEventListener('transitionend',()=>{
      this.moving=false;
      if(this.index<=2)                       this.jump(this.index+this.cards.length-6);
      else if(this.index>=this.cards.length-3)this.jump(this.index-(this.cards.length-6));
    });

    requestAnimationFrame(()=>{
      const c=this.cards[3],mr=parseFloat(getComputedStyle(c).marginRight);
      this.step=c.offsetWidth+mr;             // sempre inteiro
      this.jump(this.index);
      this.auto=setInterval(()=>this.go(1),CAROUSEL_INTERVAL);
    });

    addEventListener('resize',()=>{
      clearTimeout(this.rid);
      this.rid=setTimeout(()=>{
        clearInterval(this.auto);
        const fresh=this.root.cloneNode(true);
        this.root.replaceWith(fresh);
        new Carousel(fresh);
      },150);
    });
  }
  go(dir){if(this.moving)return;this.moving=true;this.index+=dir;this.move(true);}
  jump(i){this.index=i;this.move(false);}
  move(anim){
    this.track.style.transition=anim?'transform .6s ease':'none';
    this.track.style.transform=`translateX(-${this.step*this.index}px)`;
  }
}
const root=document.querySelector('#portfolio-carousel');
if(root)new Carousel(root);

const chatContainer = document.getElementById('chat-container');
const chatBtn       = document.getElementById('chat-button');
const chatClose     = document.getElementById('chat-close');
const chatSend      = document.getElementById('chat-send');
const chatInput     = document.getElementById('chat-input');
const chatBody      = document.querySelector('.chat-body');

// abre/fecha janela com animação de zoom
const iframe = document.getElementById('typebot-frame');
const botUrl = iframe.src;

chatBtn.addEventListener('click', () => {
  // recarrega o iframe ao abrir para reiniciar o bot
  iframe.src = botUrl;
  chatContainer.classList.add('open');
});

chatClose.addEventListener('click', () => {
  chatContainer.classList.remove('open');
});

// adiciona mensagem
function addMessage(text, sender='user') {
  const msg = document.createElement('div');
  msg.className = `chat-message ${sender}`;
  msg.textContent = text;
  chatBody.append(msg);
  chatBody.scrollTop = chatBody.scrollHeight;
}

// envia mensagem do usuário

// também ao pressionar Enter

/* ========= FAQ Accordion ========= */
document.querySelectorAll('.faq details').forEach((detail) => {
  detail.addEventListener('toggle', function () {
    if (this.open) {
      // Fecha todos os outros detalhes
      document.querySelectorAll('.faq details[open]').forEach((openDetail) => {
        if (openDetail !== this) {
          openDetail.removeAttribute('open');
        }
      });
    }
  });
});

/* ========= Video Play on View ========= */
document.addEventListener("DOMContentLoaded", () => {
  const video = document.querySelector(".case-video video");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          video.play(); // Reproduz o vídeo quando visível
        } else {
          video.pause(); // Pausa o vídeo quando não visível
        }
      });
    },
    { threshold: 0.5 } // O vídeo deve estar 50% visível para ser reproduzido
  );

  observer.observe(video);
});

const texts = ['personalizada', 'generativa', 'automatizada'];

let textIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typingSpeed = 40; // Velocidade de digitação mais rápida
const pauseBetween = 3000; // Pausa mais curta entre as palavras

function type() {
  const display = document.getElementById("typing-text");
  const currentText = texts[textIndex];

  if (isDeleting) {
    charIndex--;
  } else {
    charIndex++;
  }

  display.textContent = currentText.slice(0, charIndex);

  if (!isDeleting && charIndex === currentText.length) {
    isDeleting = true;
    setTimeout(type, pauseBetween);
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    textIndex = (textIndex + 1) % texts.length;
    setTimeout(type, 500);
  } else {
    setTimeout(type, isDeleting ? 30 : typingSpeed);
  }
}

document.addEventListener("DOMContentLoaded", type);

const hamburguer = document.getElementById("hamburguer");
const navLinks = document.querySelector(".nav-links");

hamburguer.addEventListener("click", () => {
  navLinks.classList.toggle("active");
});

