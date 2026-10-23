/* AstroSonico · invio moduli Web3Forms: conferma solo dopo risposta API. */
(function(){
  const forms=document.querySelectorAll('form[data-astrosonico-form]');
  if(!forms.length)return;
  const style=document.createElement('style');
  style.textContent='.astro-send-status{display:block;margin:12px 0 16px;padding:12px 15px;border-radius:11px;font-size:13px;line-height:1.6;border:1px solid #d9cbd9;background:#f7f2f7;color:#514654}.astro-send-status[hidden]{display:none}.astro-send-status[data-kind="error"]{color:#842f3c;background:#fff1f2;border-color:#b94b5d}.astro-send-status[data-kind="success"]{color:#22583c;background:#edfaf1;border-color:#8dbfa2}form[data-astrosonico-form] [aria-busy="true"]{cursor:wait;opacity:.7}';
  document.head.appendChild(style);
  forms.forEach(function(form){
    const submit=form.querySelector('button[type="submit"],input[type="submit"]');
    if(!submit)return;
    const status=document.createElement('p');
    status.className='astro-send-status';status.setAttribute('role','status');status.setAttribute('aria-live','polite');status.hidden=true;
    submit.insertAdjacentElement('beforebegin',status);
    const baseText=submit.textContent;
    let busy=false;
    function message(text,kind){status.hidden=false;status.dataset.kind=kind;status.textContent=text}
    submit.addEventListener('click',function(){
      if(!form.checkValidity()){
        message('Controlla i campi obbligatori e la casella relativa alla privacy prima di inviare.','error');
        form.reportValidity();
      }
    });
    form.addEventListener('submit',async function(e){
      e.preventDefault();
      if(busy)return;
      if(!form.reportValidity()){message('Completa tutti i campi obbligatori.','error');return}
      const payload=Object.fromEntries(new FormData(form).entries());
      if(payload.botcheck)return;
      delete payload.redirect;
      delete payload.botcheck;
      payload.name=[payload.Nome,payload.Cognome].filter(Boolean).join(' ').trim()||'Cliente AstroSonico';
      busy=true;submit.disabled=true;submit.setAttribute('aria-busy','true');submit.textContent='INVIO IN CORSO…';
      message('Invio della richiesta in corso…','pending');
      const controller=new AbortController();
      const timeout=setTimeout(function(){controller.abort()},16000);
      try{
        const response=await fetch('https://api.web3forms.com/submit',{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify(payload),signal:controller.signal});
        let result={};
        try{result=await response.json()}catch(_ignored){}
        if(!response.ok||result.success!==true)throw new Error('WEB3FORMS_'+response.status);
        message('Richiesta inviata correttamente. Stiamo aprendo la pagina di conferma…','success');
        form.reset();
        const next=form.dataset.successUrl;
        const isEmbedded=window.self!==window.top&&new URLSearchParams(window.location.search).get('embed')==='1';
        if(isEmbedded){
          const done=document.createElement('div');
          done.setAttribute('role','status');done.setAttribute('tabindex','-1');
          done.style.cssText='padding:35px 15px;text-align:center;max-width:640px;margin:auto';
          const title=document.createElement('h2');title.textContent='Richiesta inviata';title.style.cssText='font-family:Georgia,serif;font-size:42px;font-weight:400;letter-spacing:-.04em;margin:0 0 18px';
          const copy=document.createElement('p');copy.textContent='Grazie! La tua richiesta è stata inviata. Riceverai una risposta personale via email per la conferma e le indicazioni sul pagamento.';
          done.append(title,copy);form.replaceWith(done);done.focus();
        }else if(next){window.location.assign(next)}
        else {submit.textContent='RICHIESTA INVIATA';}
      }catch(err){
        message('L’invio non è riuscito: non considerare la richiesta confermata. Riprova o scrivi a cibosupersonico@gmail.com.','error');
      }finally{
        clearTimeout(timeout);busy=false;submit.disabled=false;submit.removeAttribute('aria-busy');
        if(submit.textContent==='INVIO IN CORSO…')submit.textContent=baseText;
      }
    });
  });
})();
