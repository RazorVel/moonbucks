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
const logoButton = document.querySelector('#navbar_logo');

const scrollToTop = () => {
    window.scrollTo({top: 0, behavior: 'smooth'});
};

homeButton.addEventListener('click', scrollToTop);
logoButton.addEventListener('click', scrollToTop);


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
    });

    // console.log('current: '+current);

    navbarLinks.forEach( li => {
        li.classList.remove('active');
        if (li.classList.contains(current)){
            li.classList.add('active');
        }
    });

});

const menuNavbarLinks = document.querySelectorAll('.menu_link');
const documentDivs = document.querySelectorAll('.menu_document');

menuNavbarLinks.forEach( menu_link => {
    menu_link.addEventListener('click', (e) => {
        const current = menu_link.getAttribute('id');
        const documentId = current + '-' +'docs'
        menuNavbarLinks.forEach(link => {
            link.classList.remove('active');
        });
        menu_link.classList.add('active');

        documentDivs.forEach(div => {
            div.classList.add('closed');
        });

        const activeDocs = document.querySelector('#'+documentId);
        activeDocs.classList.remove('closed');
    });
})
