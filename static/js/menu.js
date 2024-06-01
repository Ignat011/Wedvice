// menu
activateMenu();

function activateMenu() {
   const menu = document.getElementById('menu');
   const nav = document.getElementById('navbar');
   const secondaryNavs = nav.querySelectorAll('.nav-secondary');

   menu.addEventListener('click', function() {
      if (nav.classList.contains('show-nav')) {
         this.classList.remove('active');
         nav.classList.remove('show-nav');
         secondaryNavs.forEach((secNav) => {
            secNav.style = '';
         });
         
      } else {
         this.classList.add('active');
         nav.classList.add('show-nav');
         secondaryNavs.forEach((secNav) => {
            secNavHeight = secNav.scrollHeight + 'px';
            secNav.style.cssText = 'overflow: visible; max-height: ' + secNavHeight;
         });
      }
   });
}