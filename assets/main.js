// Shared site behaviour: mobile menu toggle, footer year, header shadow on scroll.
document.addEventListener('DOMContentLoaded', function () {
    var toggle = document.getElementById('menu-toggle');
    var menu = document.getElementById('mobile-menu');

    function setMenu(open) {
        menu.classList.toggle('is-open', open);
        toggle.setAttribute('aria-expanded', open);
        toggle.querySelector('i').className = open ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
    }

    if (toggle && menu) {
        toggle.addEventListener('click', function () {
            setMenu(!menu.classList.contains('is-open'));
        });

        // Close the menu after tapping a link (useful for same-page anchors).
        menu.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                setMenu(false);
            });
        });
    }

    document.querySelectorAll('[data-year]').forEach(function (el) {
        el.textContent = new Date().getFullYear();
    });

    var header = document.getElementById('site-header');
    if (header) {
        var onScroll = function () {
            header.classList.toggle('is-scrolled', window.scrollY > 10);
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }
});
