/* AstroSonico · finestra prenotazione nello stile dei moduli dal vivo. */
(function(){
 const anchors=document.querySelectorAll('a[data-astro-booking-modal]');
 if(!anchors.length||!('HTMLDialogElement' in window))return;
 const css=document.createElement('style');css.textContent='.astro-booking-dialog{width:min(760px,calc(100vw - 24px));height:min(850px,calc(100dvh - 34px));max-width:none;max-height:none;padding:0;border:0;border-radius:24px;background:#fcfaf9;color:#302536;box-shadow:0 18px 70px rgba(28,18,36,.25);overflow:hidden}.astro-booking-dialog::backdrop{background:rgba(32,20,35,.63);backdrop-filter:blur(5px)}.astro-booking-dialog iframe{display:block;width:100%;height:calc(100% - 62px);border:0;background:#fcfaf9}.astro-booking-bar{height:62px;display:flex;justify-content:space-between;align-items:center;gap:16px;border-bottom:1px solid rgba(43,36,50,.12);padding:10px 18px 10px 24px}.astro-booking-bar span{font-size:11px;text-transform:uppercase;font-weight:800;letter-spacing:.14em;color:#6e5a74}.astro-booking-x{cursor:pointer;font:inherit;border:1px solid rgba(43,36,50,.25);background:white;color:#302536;border-radius:100px;padding:7px 13px}.astro-booking-dialog:not([open]){display:none}@media(max-width:570px){.astro-booking-dialog{width:calc(100vw - 12px);height:calc(100dvh - 16px);border-radius:14px}.astro-booking-bar{padding-inline:15px}}';document.head.appendChild(css);
 const dialog=document.createElement('dialog');dialog.className='astro-booking-dialog';dialog.setAttribute('aria-label','Modulo di prenotazione AstroSonico');
 const bar=document.createElement('div');bar.className='astro-booking-bar';
 const title=document.createElement('span');title.textContent='AstroSonico · Prenotazione';
 const close=document.createElement('button');close.type='button';close.className='astro-booking-x';close.textContent='Chiudi ✕';
 const frame=document.createElement('iframe');frame.title='Modulo di prenotazione';frame.setAttribute('loading','eager');
 bar.append(title,close);dialog.append(bar,frame);document.body.appendChild(dialog);
 close.addEventListener('click',()=>dialog.close());
 dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close()});
 dialog.addEventListener('close',()=>{frame.src='about:blank'});
 anchors.forEach(a=>a.addEventListener('click',function(e){
  if(e.defaultPrevented||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
  const href=a.getAttribute('href');if(!href)return;
  e.preventDefault();
  const url=new URL(href,window.location.href);url.searchParams.set('embed','1');
  frame.src=url.href;
  dialog.showModal();
  close.focus();
 }));
})();
