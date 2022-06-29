const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { join } = require('node:path');
const { test } = require('node:test');
const vm = require('node:vm');

const source = readFileSync(join(__dirname, '..', 'app.js'), 'utf8');

function element(id = '', classes = []) {
    const values = new Set(classes);
    return {
        id,
        attributes: {},
        events: {},
        classList: {
            contains: (value) => values.has(value),
            add: (value) => values.add(value),
            remove: (value) => values.delete(value),
            toggle(value, enabled = !values.has(value)) {
                if (enabled) values.add(value);
                else values.delete(value);
            },
        },
        addEventListener(event, handler) { this.events[event] = handler; },
        setAttribute(name, value) { this.attributes[name] = value; },
        focus() { this.focused = true; },
    };
}

function initialize() {
    const toggle = element('mobile-menu');
    const navigation = element();
    const sections = ['home', 'promo', 'menu', 'about', 'sign-up'].map((id, index) => ({
        id, offsetTop: index * 1000, clientHeight: 900,
    }));
    const navigationItems = sections.map(({ id }) => element('', [id]));
    const categories = [element('coffee', ['active']), element('snacks')];
    const panels = [element('coffee-docs'), element('snacks-docs', ['closed'])];
    const coffee = element('coffee-banner');
    const snacks = element('snacks-banner');
    const intervals = [];
    const timeouts = [];
    const document = {
        events: {},
        addEventListener(event, handler) { this.events[event] = handler; },
        querySelector(selector) {
            return {
                '#mobile-menu': toggle, '.navbar_menu': navigation,
                '#coffee-banner': coffee, '#snacks-banner': snacks,
            }[selector];
        },
        querySelectorAll(selector) {
            return {
                section: sections, '.navbar_menu li': navigationItems,
                '.menu_link': categories, '.menu_document': panels,
            }[selector];
        },
    };
    const window = {
        scrollY: 0,
        events: {},
        addEventListener(event, handler) { this.events[event] = handler; },
        setInterval(callback, delay) { intervals.push({ callback, delay }); },
        setTimeout(callback, delay) { timeouts.push({ callback, delay }); },
    };
    vm.runInNewContext(source, { document, window });
    return { toggle, navigation, sections, navigationItems, categories, panels,
        coffee, snacks, intervals, timeouts, document, window };
}

test('mobile navigation toggles and exposes its expanded state', () => {
    const { toggle, navigation } = initialize();
    toggle.events.click();
    assert.equal(toggle.attributes['aria-expanded'], 'true');
    assert.equal(toggle.classList.contains('is-active'), true);
    assert.equal(navigation.classList.contains('active'), true);
    toggle.events.click();
    assert.equal(toggle.attributes['aria-expanded'], 'false');
    assert.equal(navigation.classList.contains('active'), false);
});

test('only navigation links dismiss the mobile menu', () => {
    const { toggle, navigation } = initialize();
    toggle.events.click();
    navigation.events.click({ target: { closest: () => null } });
    assert.equal(navigation.classList.contains('active'), true);
    navigation.events.click({ target: { closest: () => ({}) } });
    assert.equal(navigation.classList.contains('active'), false);
    assert.equal(toggle.attributes['aria-expanded'], 'false');
});

test('Escape dismisses an open menu and restores focus', () => {
    const { toggle, navigation, document } = initialize();
    document.events.keydown({ key: 'Escape' });
    assert.equal(toggle.focused, undefined);
    toggle.events.click();
    document.events.keydown({ key: 'Enter' });
    assert.equal(navigation.classList.contains('active'), true);
    document.events.keydown({ key: 'Escape' });
    assert.equal(navigation.classList.contains('active'), false);
    assert.equal(toggle.focused, true);
});

test('section highlighting initializes and follows scrolling and resizing', () => {
    const { window, sections, navigationItems } = initialize();
    const active = () => navigationItems.map((item) => item.classList.contains('active'));
    assert.deepEqual(active(), [true, false, false, false, false]);
    window.scrollY = 1800;
    window.events.scroll();
    assert.deepEqual(active(), [false, false, true, false, false]);
    sections[2].offsetTop = 2500;
    window.events.resize();
    assert.deepEqual(active(), [false, true, false, false, false]);
    window.scrollY = 4000;
    window.events.load();
    assert.deepEqual(active(), [false, false, false, false, true]);
});

test('categories switch panels exclusively and can switch back', () => {
    const { categories, panels } = initialize();
    for (const selected of [1, 0, 0, 1]) {
        categories[selected].events.click();
        categories.forEach((category, index) => {
            assert.equal(category.classList.contains('active'), index === selected);
            assert.equal(category.attributes['aria-pressed'], String(index === selected));
            assert.equal(panels[index].classList.contains('closed'), index !== selected);
        });
    }
});

test('slideshows use callback timers, fade before replacing images, and wrap independently', () => {
    const { intervals, timeouts, coffee, snacks } = initialize();
    assert.equal(intervals.length, 2);
    intervals.forEach(({ callback, delay }) => {
        assert.equal(typeof callback, 'function');
        assert.equal(delay, 5000);
    });
    const advance = (slideshow, banner) => {
        const previous = banner.attributes.src;
        intervals[slideshow].callback();
        assert.equal(banner.classList.contains('fadeOut'), true);
        assert.equal(banner.attributes.src, previous);
        const timeout = timeouts.shift();
        assert.equal(timeout.delay, 1000);
        timeout.callback();
        assert.equal(banner.classList.contains('fadeOut'), false);
        return banner.attributes.src;
    };
    const firstCoffee = advance(0, coffee);
    assert.equal(firstCoffee, './assets/images/coffee/caffe-americano.jpg');
    assert.equal(snacks.attributes.src, undefined);
    for (let i = 0; i < 11; i++) advance(0, coffee);
    assert.equal(advance(0, coffee), firstCoffee);
    const firstSnack = advance(1, snacks);
    assert.equal(firstSnack, './assets/images/snacks/7-seeds-cookie.jpg');
    for (let i = 0; i < 18; i++) advance(1, snacks);
    assert.equal(advance(1, snacks), firstSnack);
});
