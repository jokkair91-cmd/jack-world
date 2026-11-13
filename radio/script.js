const modal=document.querySelector('#modal');
document.querySelectorAll('[data-listen]').forEach(button=>button.addEventListener('click',()=>{modal.classList.add('open');modal.setAttribute('aria-hidden','false')}));
document.querySelectorAll('.close,.close-modal').forEach(button=>button.addEventListener('click',()=>{modal.classList.remove('open');modal.setAttribute('aria-hidden','true')}));
modal.addEventListener('click',event=>{if(event.target===modal){modal.classList.remove('open');modal.setAttribute('aria-hidden','true')}});
