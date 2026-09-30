// ---------------------------------------------------------------------------
// IGSM Alumni gallery
//
// HOW TO ADD PHOTOS
//   1. Copy the image files into the album's folder, e.g. assets/gallery/IGSM Christmas party/
//   2. Add each file name to that album's `photos` list below, e.g.
//        photos: range(41, 48)   // 41.jpg ... 48.jpg
//   (A website cannot read a folder by itself, so the list is required.)
//
// To rename an album, change its `title`. If you also rename the folder on
// disk, update `folder` to match. `icon` is any Font Awesome solid icon name.
// ---------------------------------------------------------------------------
// Builds a list of numbered file names, e.g. range(1, 3) -> ['1.jpg', '2.jpg', '3.jpg'].
function range(from, to) {
    var files = [];
    for (var n = from; n <= to; n++) files.push(n + '.jpg');
    return files;
}

var IGSM_GALLERY = [
    {
        folder: 'IGSM 10th Commencement', title: 'IGSM 10th Commencement',
        icon: 'fa-graduation-cap', photos: range(1, 20)
    },
    {
        folder: '2025 ATGSM Convocation and General Association', title: '2025 ATGSM Convocation and General Association',
        icon: 'fa-people-group', photos: range(21, 30)
    },
    {
        folder: 'IGSM 45th Founding Anniversary', title: 'IGSM 45th Founding Anniversary',
        icon: 'fa-cake-candles', photos: range(31, 40)
    },
    {
        folder: 'IGSM Christmas party', title: 'IGSM Christmas Party',
        icon: 'fa-gift', photos: range(41, 48)
    },
    {
        folder: 'IGSM new building', title: 'IGSM New Building',
        icon: 'fa-building', photos: range(51, 60)
    }
];


// Photos shown at first, and added by each "View More" click (3 rows of 5).
// In "All Photos", empty spots are filled with placeholders if there are fewer photos than this.
var GALLERY_PAGE_SIZE = 15;

document.addEventListener('DOMContentLoaded', function () {
    var albumsEl = document.getElementById('gallery-albums');
    var gridEl = document.getElementById('gallery-grid');
    var titleEl = document.getElementById('gallery-title');
    var resetEl = document.getElementById('gallery-reset');
    var moreEl = document.getElementById('gallery-more');
    if (!albumsEl || !gridEl) return;

    var active = null; // index of the selected album, or null for all photos
    var photos = [];   // every photo in the current view
    var shownCount = 0; // how many of them are on the page

    // Folder and file names may contain spaces, so encode them for the URL.
    function photoUrl(album, file) {
        return 'assets/gallery/' + encodeURIComponent(album.folder) + '/' + encodeURIComponent(file);
    }

    function photosOf(album) {
        return album.photos.map(function (file) {
            return { src: photoUrl(album, file), album: album.title };
        });
    }

    // Take photos from each album in turn so "All Photos" mixes every album.
    function mixAll() {
        var lists = IGSM_GALLERY.map(photosOf);
        var longest = Math.max.apply(null, lists.map(function (l) { return l.length; }));
        var mixed = [];
        for (var i = 0; i < longest; i++) {
            lists.forEach(function (list) {
                if (list[i]) mixed.push(list[i]);
            });
        }
        return mixed;
    }

    function renderAlbums() {
        albumsEl.innerHTML = IGSM_GALLERY.map(function (album, i) {
            var count = album.photos.length;
            var cover = count
                ? '<img src="' + photoUrl(album, album.photos[0]) + '" alt="">'
                : '<i class="fa-solid fa-folder' + (active === i ? '-open' : '') + ' album-card__folder"></i>';
            return '<button type="button" data-album="' + i + '" class="album-card' + (active === i ? ' is-active' : '') + '">' +
                '<span class="album-card__cover">' + cover +
                '<span class="album-card__count">' + count + (count === 1 ? ' photo' : ' photos') + '</span>' +
                '</span>' +
                '<span class="album-card__meta">' +
                '<span class="album-card__icon"><i class="fa-solid ' + album.icon + '"></i></span>' +
                '<span class="album-card__title">' + album.title + '</span>' +
                '</span>' +
                '</button>';
        }).join('');
    }

    function photoTile(p, i) {
        return '<button type="button" data-photo="' + i + '" class="photo-tile">' +
            '<img src="' + p.src + '" alt="' + p.album + ' photo" loading="lazy">' +
            '<span class="photo-tile__zoom"><i class="fa-solid fa-magnifying-glass-plus"></i></span>' +
            '</button>';
    }

    function placeholderTile(n) {
        return '<div class="photo-placeholder">' +
            '<i class="fa-regular fa-image"></i>' +
            '<span>Photo ' + n + '</span></div>';
    }

    // Adds the next batch of photos to the grid.
    function showMore() {
        var next = photos.slice(shownCount, shownCount + GALLERY_PAGE_SIZE);
        gridEl.insertAdjacentHTML('beforeend', next.map(function (p, i) {
            return photoTile(p, shownCount + i);
        }).join(''));
        shownCount += next.length;
        moreEl.classList.toggle('is-hidden', shownCount >= photos.length);
    }

    function renderGrid() {
        photos = active === null ? mixAll() : photosOf(IGSM_GALLERY[active]);
        shownCount = 0;
        gridEl.innerHTML = '';
        showMore();

        // Placeholders only fill "All Photos"; an opened album shows just its own photos.
        if (active === null) {
            var empty = '';
            for (var n = photos.length; n < GALLERY_PAGE_SIZE; n++) empty += placeholderTile(n + 1);
            gridEl.insertAdjacentHTML('beforeend', empty);
        }

        titleEl.textContent = active === null ? 'All Photos' : IGSM_GALLERY[active].title;
        resetEl.classList.toggle('is-hidden', active === null);
    }

    function select(i) {
        active = i;
        renderAlbums();
        renderGrid();
    }

    albumsEl.addEventListener('click', function (e) {
        var btn = e.target.closest('[data-album]');
        if (!btn) return;
        var i = Number(btn.getAttribute('data-album'));
        select(active === i ? null : i);
    });

    resetEl.addEventListener('click', function () { select(null); });
    moreEl.addEventListener('click', showMore);

    // Lightbox: browses the photos currently on the page.
    var box = document.getElementById('lightbox');
    var boxImg = document.getElementById('lightbox-img');
    var current = 0;

    function open(i) {
        current = (i + shownCount) % shownCount;
        boxImg.src = photos[current].src;
        box.classList.add('is-open');
    }

    function close() {
        box.classList.remove('is-open');
    }

    gridEl.addEventListener('click', function (e) {
        var btn = e.target.closest('[data-photo]');
        if (btn) open(Number(btn.getAttribute('data-photo')));
    });
    document.getElementById('lightbox-prev').addEventListener('click', function (e) { e.stopPropagation(); open(current - 1); });
    document.getElementById('lightbox-next').addEventListener('click', function (e) { e.stopPropagation(); open(current + 1); });
    box.addEventListener('click', function (e) { if (e.target === box || e.target.closest('#lightbox-close')) close(); });
    document.addEventListener('keydown', function (e) {
        if (!box.classList.contains('is-open')) return;
        if (e.key === 'Escape') close();
        if (e.key === 'ArrowLeft') open(current - 1);
        if (e.key === 'ArrowRight') open(current + 1);
    });

    renderAlbums();
    renderGrid();
});
