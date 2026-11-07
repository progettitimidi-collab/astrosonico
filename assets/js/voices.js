/* AstroSonico — testimonianze; scrolling manuale e dialog nativi accessibili. */
(function(){
  const widgets=document.querySelectorAll('[data-voices-carousel]');
  widgets.forEach(function(widget){
    const track=widget.querySelector('[data-voices-track]');
    const prev=widget.querySelector('[data-voices-prev]');
    const next=widget.querySelector('[data-voices-next]');
    if(!track||!prev||!next)return;
    function update(){
      const left=track.scrollLeft;
      const max=track.scrollWidth-track.clientWidth;
      prev.disabled=left<=3;
      next.disabled=left>=max-3;
    }
    function advance(direction){
      const card=track.querySelector('.voices-card');
      if(!card)return;
      const gap=parseFloat(getComputedStyle(track).columnGap)||0;
      const motion=window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth';
      track.scrollBy({left:direction*(card.getBoundingClientRect().width+gap),behavior:motion});
    }
    prev.addEventListener('click',function(){advance(-1)});
    next.addEventListener('click',function(){advance(1)});
    track.addEventListener('scroll',update,{passive:true});
    window.addEventListener('resize',update,{passive:true});
    update();
    const dialogs=widget.querySelectorAll('dialog.voices-dialog');
    widget.querySelectorAll('[data-voices-open]').forEach(function(button){
      button.addEventListener('click',function(){
        const dialog=widget.querySelector('#'+button.getAttribute('data-voices-open'));
        if(dialog&&typeof dialog.showModal==='function')dialog.showModal();
      });
    });
    dialogs.forEach(function(dialog){
      const close=dialog.querySelector('[data-voices-close]');
      if(close)close.addEventListener('click',function(){dialog.close()});
      dialog.addEventListener('click',function(event){if(event.target===dialog)dialog.close()});
    });
  });
})();
