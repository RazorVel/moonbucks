(() => {
    'use strict';

    const ROTATION_INTERVAL = 5000;
    const FADE_DURATION = 1000;

    const coffeeImages = [
        'caffe-americano.jpg',
        'caffe-latte.jpg',
        'capuccino.jpg',
        'caramel-macchiato.jpg',
        'cocoa-cappucino.jpg',
        'cold-foam.webp',
        'double-shot-iced-shaken-espresso.jpg',
        'espresso-con-panna.jpg',
        'espresso-macchiato.gif',
        'flat-white.png',
        'ice-espresso-macha-fusion.jpg',
        'ristretto-bianco-nedir-nasil-yapilir-icinde-ne-var-2.jpg',
    ];

    const snackImages = [
        '7-seeds-cookie.jpg',
        'almond-croissant.jpg',
        'bagel-bites.jpg',
        'beef-sausage-and-cheese-croisant.webp',
        'cheese-bagels.jpg',
        'chocolate-croissant.jpg',
        'cinnamon-chocolate-marble-cake.webp',
        'cinnamon-rolls.jpg',
        'espresso-brownie.jpg',
        'nutella-bombolone.jpg',
        'old-fashioned-blueberry-muffin.jpg',
        'peanut-butter-cornflakes-cookie.jpg',
        'pillow-glazed-doughnut.webp',
        'raisin-oatmeal-scones.jpg',
        'spicy-tuna-bread.jpg',
        'srikaya-swirl-danish.jpg',
        'sumatra-chocolate-eclair.jpg',
        'triple-chocolate-muffin.jpg',
        'tuna-puff.jpg',
    ];

    const initializeNavigation = () => {
        const toggle = document.querySelector('#mobile-menu');
        const links = document.querySelector('.navbar_menu');
        const sections = document.querySelectorAll('section');
        const navbarLinks = document.querySelectorAll('.navbar_menu li');

        const setMenuOpen = (isOpen) => {
            toggle.classList.toggle('is-active', isOpen);
            links.classList.toggle('active', isOpen);
            toggle.setAttribute('aria-expanded', String(isOpen));
        };

        toggle.addEventListener('click', () => {
            setMenuOpen(!links.classList.contains('active'));
        });
        links.addEventListener('click', (event) => {
            if (event.target.closest('a')) setMenuOpen(false);
        });
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && links.classList.contains('active')) {
                setMenuOpen(false);
                toggle.focus();
            }
        });

        const updateActiveSection = () => {
            let currentSection = '';

            sections.forEach((section) => {
                const threshold = section.offsetTop - section.clientHeight / 3;
                if (window.scrollY >= threshold) currentSection = section.id;
            });

            navbarLinks.forEach((link) => {
                link.classList.toggle('active', link.classList.contains(currentSection));
            });
        };

        window.addEventListener('scroll', updateActiveSection, { passive: true });
        window.addEventListener('resize', updateActiveSection);
        window.addEventListener('load', updateActiveSection);
        updateActiveSection();
    };

    const initializeMenu = () => {
        const links = document.querySelectorAll('.menu_link');
        const documents = document.querySelectorAll('.menu_document');

        links.forEach((link) => {
            link.addEventListener('click', () => {
                links.forEach((item) => {
                    const isActive = item === link;
                    item.classList.toggle('active', isActive);
                    item.setAttribute('aria-pressed', String(isActive));
                });

                documents.forEach((panel) => {
                    panel.classList.toggle('closed', panel.id !== `${link.id}-docs`);
                });
            });
        });
    };

    const startSlideshow = (selector, directory, images) => {
        const banner = document.querySelector(selector);
        let index = 0;

        window.setInterval(() => {
            banner.classList.add('fadeOut');

            window.setTimeout(() => {
                banner.setAttribute('src', `${directory}/${images[index]}`);
                banner.classList.remove('fadeOut');
                index = (index + 1) % images.length;
            }, FADE_DURATION);
        }, ROTATION_INTERVAL);
    };

    initializeNavigation();
    initializeMenu();
    startSlideshow('#coffee-banner', './assets/images/coffee', coffeeImages);
    startSlideshow('#snacks-banner', './assets/images/snacks', snackImages);
})();
