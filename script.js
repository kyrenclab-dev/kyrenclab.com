
// KYREN CREATIVE LAB — interactive behaviours
(function(){
  const $ = (q,ctx=document)=>ctx.querySelector(q);
  const $$ = (q,ctx=document)=>Array.from(ctx.querySelectorAll(q));

  // Mouse spotlight variables
  window.addEventListener('pointermove', (e)=>{
    document.body.style.setProperty('--mx', `${(e.clientX / innerWidth) * 100}%`);
    document.body.style.setProperty('--my', `${(e.clientY / innerHeight) * 100}%`);
  }, {passive:true});

  // Header scroll state
  const header = $('#header');
  const onScroll = () => header && header.classList.toggle('scrolled', window.scrollY > 20);
  onScroll(); window.addEventListener('scroll', onScroll, {passive:true});

  // Mobile nav
  const hamburger = $('#hamburger');
  const nav = $('#nav');
  hamburger?.addEventListener('click', ()=>{
    hamburger.classList.toggle('open');
    nav?.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', hamburger.classList.contains('open') ? 'true' : 'false');
  });
  $$('.nav-link').forEach(a=>a.addEventListener('click',()=>{hamburger?.classList.remove('open');nav?.classList.remove('open')}));

  // Reveal animation
  const revealEls = $$('.reveal');
  if('IntersectionObserver' in window){
    const io = new IntersectionObserver((entries)=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){ entry.target.classList.add('visible'); io.unobserve(entry.target); }
      });
    }, {threshold:.12});
    revealEls.forEach(el=>io.observe(el));
  } else revealEls.forEach(el=>el.classList.add('visible'));

  // Card glow follows cursor
  $$('.lab-card').forEach(card=>{
    card.addEventListener('pointermove', e=>{
      const r = card.getBoundingClientRect();
      card.style.setProperty('--card-x', `${e.clientX - r.left}px`);
      card.style.setProperty('--card-y', `${e.clientY - r.top}px`);
    });
  });

  // Portfolio filters
  const filterBtns = $$('.filter-btn');
  const portfolioCards = $$('.portfolio-card[data-category]');
  filterBtns.forEach(btn=>btn.addEventListener('click',()=>{
    filterBtns.forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    portfolioCards.forEach(card=>{
      const show = filter === 'all' || card.dataset.category === filter;
      card.style.display = show ? '' : 'none';
    });
  }));

  // Blog accordion — title expands/minimizes in same page
  const articles = $$('.blog-article');
  function setArticle(article, open){
    article.classList.toggle('open', open);
    const btn = $('.blog-summary', article);
    if(btn) btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  }
  articles.forEach((article, index)=>{
    const btn = $('.blog-summary', article);
    btn?.addEventListener('click',()=>{
      setArticle(article, !article.classList.contains('open'));
    });
    if(index === 0) setArticle(article, true);
  });
  $('#expandAllBlogs')?.addEventListener('click',()=>articles.forEach(a=>setArticle(a,true)));
  $('#collapseAllBlogs')?.addEventListener('click',()=>articles.forEach(a=>setArticle(a,false)));

  // Idea generator
  const ideas = [
    'Add a WhatsApp-first booking funnel with one-tap enquiry buttons.',
    'Create a scroll-stopping homepage hero with a clear RM350 starter offer.',
    'Use a Google Maps + review section to make local customers trust you faster.',
    'Turn your service list into cards with prices, outcomes and before/after proof.',
    'Build a landing page for one offer instead of sending ads to a boring profile.'
  ];
  const ideaBtn = $('#ideaBtn');
  const ideaText = $('#ideaText');
  ideaBtn?.addEventListener('click',()=>{
    if(!ideaText) return;
    const idea = ideas[Math.floor(Math.random()*ideas.length)];
    ideaText.textContent = idea;
    ideaText.animate([{transform:'translateY(8px)',opacity:.2},{transform:'translateY(0)',opacity:1}],{duration:260,easing:'ease-out'});
  });

  // Contact form creates an email in user's email app
  const contactForm = $('#contactForm');
  contactForm?.addEventListener('submit', (e)=>{
    e.preventDefault();
    const data = new FormData(contactForm);
    const name = (data.get('name') || '').trim();
    const business = (data.get('business') || '').trim();
    const email = (data.get('email') || '').trim();
    const message = (data.get('message') || '').trim();
    if(!name || !business || !email || !message){
      alert('Please fill in your name, business name, email and message.');
      return;
    }
    const service = data.get('service') || 'Not selected';
    const phone = data.get('phone') || 'Not provided';
    const subject = encodeURIComponent(`Website enquiry from ${business}`);
    const body = encodeURIComponent(`Hi Kyren Creative Lab,\n\nMy name: ${name}\nBusiness name: ${business}\nEmail: ${email}\nPhone / WhatsApp: ${phone}\nService needed: ${service}\n\nMessage:\n${message}\n\nThank you.`);
    window.location.href = `mailto:kyrenclab@gmail.com?subject=${subject}&body=${body}`;
    const success = $('#formSuccess');
    if(success) success.style.display = 'block';
  });

  // Year
  $$('.year').forEach(el=>el.textContent = new Date().getFullYear());
})();
