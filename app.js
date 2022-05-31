const menu = document.querySelector('#mobile-menu');
const menuLinks = document.querySelector('.navbar_menu');
const navLogo = document.querySelector('#navbar_logo');

const mobileMenu = () => {
    menu.classList.toggle('is-active');
    menuLinks.classList.toggle('active');
};

menu.addEventListener('click', mobileMenu);

menuLinks.addEventListener('click', (e) => {
    menu.classList.remove('is-active');
    menuLinks.classList.remove('active');
});

const homeButton = document.querySelector('#home-link');

homeButton.addEventListener('click', (e) => {
    window.scrollTo({top: 0, behavior:'smooth'});
})



const sections = document.querySelectorAll('section');
const navbarLinks = document.querySelectorAll('.navbar_menu li');

window.addEventListener('scroll', (e) => {
    let current = '';

    // console.log('yoffset: '+pageYOffset);

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= (sectionTop - sectionHeight / 3)){
            current = section.getAttribute('id');
        }
    })

    // console.log('current: '+current);

    navbarLinks.forEach( li => {
        li.classList.remove('active');
        if (li.classList.contains(current)){
            li.classList.add('active');
        }
    })

});