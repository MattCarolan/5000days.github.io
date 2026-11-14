(() => {
"use strict";
const triggers=document.querySelectorAll('[data-support-form]');
if(!triggers.length)return;
const dialog=document.createElement('dialog');
dialog.className='support-dialog'; dialog.setAttribute('aria-labelledby','support-title');
dialog.innerHTML=`<button type="button" class="support-close" aria-label="Close support form">×</button><h2 id="support-title">Adapt support</h2><p>Have a question or a problem? Send Matt a message.</p><form><label>Your name<input name="name" autocomplete="name" required maxlength="100"></label><label>Email address<input type="email" name="email" autocomplete="email" required maxlength="254"></label><label>Your message<textarea name="message" required maxlength="5000" rows="5"></textarea></label><p class="support-hint">For technical problems, include your device and app version. Your message is sent to dev@mattcarolan.net through FormSubmit.</p><input name="_honey" class="support-trap" tabindex="-1" autocomplete="off" aria-hidden="true"><button class="support-send" type="submit">Send message</button><p class="support-status" role="status" aria-live="polite"></p></form>`;
document.body.append(dialog);
let opener;
triggers.forEach(t=>t.addEventListener('click',e=>{e.preventDefault();opener=t;dialog.showModal();}));
dialog.querySelector('.support-close').onclick=()=>dialog.close();
dialog.addEventListener('close',()=>opener?.focus());
const form=dialog.querySelector('form'),button=dialog.querySelector('.support-send'),status=dialog.querySelector('.support-status');
let sending=false;
form.addEventListener('submit',async e=>{
 e.preventDefault();if(sending||!form.reportValidity())return;
 if(form.elements._honey.value)return;
 for(const field of [form.elements.name,form.elements.message]){if(!field.value.trim()){status.textContent='Please enter your name and message.';field.focus();return;}}
 sending=true;button.disabled=true;button.textContent='Sending…';status.textContent='';
 try{
 const response=await fetch('https://formsubmit.co/ajax/dev@mattcarolan.net',{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify({name:form.elements.name.value.trim(),email:form.elements.email.value.trim(),message:form.elements.message.value.trim(),_subject:'Adapt support request',_template:'table',_honey:''}),signal:AbortSignal.timeout(25000)});
 const result=await response.json();
 if(!response.ok||!(result.success===true||result.success==='true'))throw new Error('Not accepted');
 status.textContent='Your message has been submitted. Thank you for getting in touch.';form.reset();
 }catch{status.textContent='We could not confirm your submission. Your message is still here; please try again shortly.';}
 finally{sending=false;button.disabled=false;button.textContent='Send message';}
});
})();