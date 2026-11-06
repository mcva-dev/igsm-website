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

    // Poster lightbox: any [data-poster-src] button opens its image full size.
    var posterBox = document.getElementById('poster-lightbox');
    var posterImg = document.getElementById('poster-lightbox-img');
    var posterTrigger = null;

    if (posterBox && posterImg) {
        var closePoster = function () {
            posterBox.classList.remove('is-open');
            document.body.style.overflow = '';
            if (posterTrigger) posterTrigger.focus();
        };

        document.querySelectorAll('[data-poster-src]').forEach(function (btn) {
            btn.addEventListener('click', function () {
                posterTrigger = btn;
                posterImg.src = btn.getAttribute('data-poster-src');
                posterImg.alt = btn.getAttribute('data-poster-alt') || '';
                posterBox.classList.add('is-open');
                document.body.style.overflow = 'hidden';
                document.getElementById('poster-lightbox-close').focus();
            });
        });

        posterBox.addEventListener('click', function (e) {
            if (e.target === posterBox || e.target.closest('#poster-lightbox-close')) closePoster();
        });
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && posterBox.classList.contains('is-open')) closePoster();
        });
    }

    var header = document.getElementById('site-header');
    if (header) {
        var onScroll = function () {
            header.classList.toggle('is-scrolled', window.scrollY > 10);
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }
});
