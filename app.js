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

const sections = document.querySelectorAll('section');
const navbar = document.querySelector('.navbar');

const adjustScrollMarginTop = () => {
    sections.forEach(section => {
        section.style.scrollMarginTop = navbar.clientHeight + 'px';
    });
};

window.addEventListener('resize', adjustScrollMarginTop);

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

const coffeeImages = ['caffe-americano.jpg', 'caffe-latte.jpg', 'capuccino.jpg', 'caramel-macchiato.jpg', 'cocoa-cappucino.jpg', 'cold-foam.webp', 'double-shot-iced-shaken-espresso.jpg', 'espresso-con-panna.jpg', 'espresso-macchiato.gif', 'flat-white.png', 'ice-espresso-macha-fusion.jpg', 'ristretto-bianco-nedir-nasil-yapilir-icinde-ne-var-2.jpg'];

const snackImages = ['7-seeds-cookie.jpg', 'almond-croissant.jpg', 'bagel-bites.jpg', 'beef-sausage-and-cheese-croisant.webp', 'cheese-bagels.jpg', 'chocolate-croissant.jpg', 'cinnamon-chocolate-marble-cake.webp', 'cinnamon-rolls.jpg', 'espresso-brownie.jpg', 'nutella-bombolone.jpg', 'old-fashioned-blueberry-muffin.jpg', 'peanut-butter-cornflakes-cookie.jpg', 'pillow-glazed-doughnut.webp', 'raisin-oatmeal-scones.jpg', 'spicy-tuna-bread.jpg', 'srikaya-swirl-danish.jpg', 'sumatra-chocolate-eclair.jpg', 'triple-chocolate-muffin.jpg', 'tuna-puff.jpg'];

var coffeeIndex=0;
var snacksIndex=0;

const coffeeBanner = document.querySelector('#coffee-banner');
const snacksBanner = document.querySelector('#snacks-banner');

const rotateImages = (banner, dir, current_item) => {
    banner.classList.add('fadeOut');
    setTimeout(function(){
        banner.setAttribute('src', dir+'/'+current_item);
        banner.classList.remove('fadeOut');
    }, 1000);
};

const rotateCoffee = () => {
    if (coffeeIndex >= coffeeImages.length) coffeeIndex=0;

    rotateImages(coffeeBanner, './assets/images/coffee/', coffeeImages[coffeeIndex++]);
};

const rotateSnacks = () => {
    if (snacksIndex >= snackImages.length) snacksIndex=0;

    rotateImages(snacksBanner, './assets/images/snacks/', snackImages[snacksIndex++]);
};

const resizeFrame = () => {
    promoFrame.forEach(frame => {
        let width = frame.clientWidth;
        let height = width / 57 * 35;
        frame.style.height=height+'px';
    });
}

var promoFrame = document.querySelectorAll('.promo_frame');

window.addEventListener('resize', resizeFrame)

window.onload=function(){
    setInterval('rotateCoffee()', 5000);
    setInterval('rotateSnacks()', 5000);

    resizeFrame();

    adjustScrollMarginTop();
}