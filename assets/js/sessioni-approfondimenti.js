/* AstroSonico: i link Approfondisci aprono il relativo pannello nativo. */
(function(){
  function reveal(hash,scroll){
    if(!hash||!/^#approfondimento-[\w-]+$/.test(hash))return;
    const section=document.getElementById(hash.slice(1));
    if(!section||section.tagName!=='DETAILS'||!section.classList.contains('astro-depth-item'))return;
    section.open=true;
    if(scroll){requestAnimationFrame(function(){section.scrollIntoView({behavior:'auto',block:'start'});});}
  }
  document.querySelectorAll('a.astro-card-more[href^="#approfondimento-"]').forEach(function(link){
    link.addEventListener('click',function(){reveal(link.getAttribute('href'),false);});
  });
  window.addEventListener('hashchange',function(){reveal(location.hash,true);});
  if(location.hash){reveal(location.hash,true);}
})();
