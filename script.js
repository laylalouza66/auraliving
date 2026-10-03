/* ============================================================
   LuxeLiving Interiors — Interactive JavaScript
   script.js
   ============================================================ */

(function () {
    'use strict';

    /* ---------- Product Data ---------- */
    const PRODUCTS = [
        {
            id: 1,
            title: 'Halden Minimalist Sofa',
            category: 'sofas',
            categoryLabel: 'Sofas',
            price: 2890,
            oldPrice: 3400,
            badge: 'Sale',
            desc: 'Three-seat linen-blend sofa with solid oak base.',
            image: 'https://images.pexels.com/photos/11112731/pexels-photo-11112731.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'
        },
        {
            id: 2,
            title: 'Nordic Lounge Armchair',
            category: 'seating',
            categoryLabel: 'Seating',
            price: 1290,
            badge: 'New',
            desc: 'Ergonomic armchair with hand-stitched wool upholstery.',
            image: 'https://images.pexels.com/photos/35203822/pexels-photo-35203822.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'
        },
        {
            id: 3,
            title: 'Oslo Walnut Dining Table',
            category: 'tables',
            categoryLabel: 'Tables',
            price: 3450,
            desc: 'Solid walnut six-seater with natural live edge.',
            image: 'https://images.pexels.com/photos/11112739/pexels-photo-11112739.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'
        },
        {
            id: 4,
            title: 'Ridge Modern Coffee Table',
            category: 'tables',
            categoryLabel: 'Tables',
            price: 890,
            desc: 'Sculptural side table in Travertine stone.',
            image: 'https://images.pexels.com/photos/32246936/pexels-photo-32246936.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'
        },
        {
            id: 5,
            title: 'Aria Accent Lounge Chair',
            category: 'seating',
            categoryLabel: 'Seating',
            price: 1150,
            badge: 'New',
            desc: 'Woven cane backrest with powder-coated steel frame.',
            image: 'https://images.pexels.com/photos/31361660/pexels-photo-31361660.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'
        },
        {
            id: 6,
            title: 'Slate Platform Bed Frame',
            category: 'bedroom',
            categoryLabel: 'Bedroom',
            price: 2150,
            desc: 'Upholstered king bed with channel-tufted headboard.',
            image: 'https://images.pexels.com/photos/19672569/pexels-photo-19672569.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'
        },
        {
            id: 7,
            title: 'Lumen Arc Floor Lamp',
            category: 'lighting',
            categoryLabel: 'Lighting',
            price: 680,
            desc: 'Articulated brass arm with warm LED diffuser.',
            image: 'https://images.pexels.com/photos/38014632/pexels-photo-38014632.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'
        },
        {
            id: 8,
            title: 'Forma Oak Bookshelf',
            category: 'storage',
            categoryLabel: 'Storage',
            price: 1750,
            desc: 'Five-tier open shelving in solid white oak.',
            image: 'https://images.pexels.com/photos/31338030/pexels-photo-31338030.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'
        }
    ];

    /* ---------- DOM Refs ---------- */
    const $ = (sel) => document.querySelector(sel);
    const $$ = (sel) => document.querySelectorAll(sel);

    const header = $('#site-header');
    const productGrid = $('#product-grid');
    const noResults = $('#no-results');
    const searchInput = $('#search-input');
    const filterPills = $('#filter-pills');
    const modalBackdrop = $('#modal-backdrop');
    const modalClose = $('#modal-close');
    const modalOk = $('#modal-ok');
    const menuToggle = $('#menu-toggle');
    const navLinks = $('#nav-links');
    const cartBtn = $('#cart-btn');
    const cartBadge = $('#cart-badge');
    const cartBubble = $('#cart-bubble');
    const newsletterForm = $('#newsletter-form');

    let cartCount = 0;
    let activeCategory = 'all';
    let searchTerm = '';

    /* ---------- Format Currency ---------- */
    const formatPrice = (val) => '$' + val.toLocaleString('en-US');

    /* ---------- Render Products ---------- */
    function renderProducts() {
        const filtered = PRODUCTS.filter((p) => {
            const catMatch = activeCategory === 'all' || p.category === activeCategory;
            const term = searchTerm.toLowerCase().trim();
            const searchMatch =
                !term ||
                p.title.toLowerCase().includes(term) ||
                p.desc.toLowerCase().includes(term) ||
                p.categoryLabel.toLowerCase().includes(term);
            return catMatch && searchMatch;
        });

        if (filtered.length === 0) {
            productGrid.innerHTML = '';
            noResults.style.display = 'block';
            return;
        }

        noResults.style.display = 'none';

        productGrid.innerHTML = filtered
            .map((p, i) => {
                const badgeHTML = p.badge
                    ? `<span class="product-badge ${p.badge === 'New' ? 'new' : ''}">${p.badge}</span>`
                    : '';
                const oldPriceHTML = p.oldPrice
                    ? `<span class="old-price">${formatPrice(p.oldPrice)}</span>`
                    : '';

                return `
                    <article class="product-card" style="animation-delay:${i * 0.06}s">
                        <div class="product-image">
                            <img src="${p.image}" alt="${p.title}" loading="lazy" />
                            ${badgeHTML}
                            <div class="product-actions">
                                <button class="btn-add-cart" data-demo-link data-add-cart>Add to Cart</button>
                                <button class="btn-buy-now" data-demo-link>Buy Now</button>
                            </div>
                        </div>
                        <div class="product-info">
                            <span class="product-category">${p.categoryLabel}</span>
                            <h3 class="product-title">${p.title}</h3>
                            <p class="product-desc">${p.desc}</p>
                            <p class="product-price">${formatPrice(p.price)}${oldPriceHTML}</p>
                        </div>
                    </article>
                `;
            })
            .join('');
    }

    /* ---------- Demo Modal ---------- */
    function openModal() {
        modalBackdrop.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modalBackdrop.classList.remove('active');
        document.body.style.overflow = '';
    }

    function showCartBubble() {
        cartBubble.classList.add('show');
        clearTimeout(showCartBubble._timer);
        showCartBubble._timer = setTimeout(() => {
            cartBubble.classList.remove('show');
        }, 2500);
    }

    function incrementCart() {
        cartCount++;
        cartBadge.textContent = cartCount;
        cartBadge.classList.add('visible');
    }

    /* ---------- Event Delegation for Demo Links ---------- */
    document.addEventListener('click', function (e) {
        // Add to Cart — show bubble AND demo modal
        if (e.target.closest('[data-add-cart]')) {
            e.preventDefault();
            incrementCart();
            showCartBubble();
            openModal();
            return;
        }

        // Any demo link — show modal
        if (e.target.closest('[data-demo-link]')) {
            e.preventDefault();
            openModal();
            return;
        }
    });

    /* ---------- Modal Close Events ---------- */
    modalClose.addEventListener('click', closeModal);
    modalOk.addEventListener('click', closeModal);
    modalBackdrop.addEventListener('click', function (e) {
        if (e.target === modalBackdrop) closeModal();
    });
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && modalBackdrop.classList.contains('active')) closeModal();
    });

    /* ---------- Cart Button ---------- */
    cartBtn.addEventListener('click', openModal);

    /* ---------- Mobile Menu Toggle ---------- */
    menuToggle.addEventListener('click', function () {
        menuToggle.classList.toggle('open');
        navLinks.classList.toggle('open');
    });

    /* ---------- Close mobile menu on link click ---------- */
    navLinks.addEventListener('click', function (e) {
        if (e.target.classList.contains('nav-link')) {
            menuToggle.classList.remove('open');
            navLinks.classList.remove('open');
        }
    });

    /* ---------- Scroll: header background ---------- */
    let ticking = false;
    window.addEventListener('scroll', function () {
        if (!ticking) {
            requestAnimationFrame(function () {
                header.classList.toggle('scrolled', window.scrollY > 60);
                ticking = false;
            });
            ticking = true;
        }
    });

    /* ---------- Search ---------- */
    searchInput.addEventListener('input', function () {
        searchTerm = this.value;
        renderProducts();
    });

    /* ---------- Category Filter ---------- */
    filterPills.addEventListener('click', function (e) {
        if (!e.target.classList.contains('pill')) return;
        $$('.pill').forEach((p) => p.classList.remove('active'));
        e.target.classList.add('active');
        activeCategory = e.target.dataset.category;
        renderProducts();
    });

    /* ---------- Newsletter Form ---------- */
    newsletterForm.addEventListener('submit', function (e) {
        e.preventDefault();
        openModal();
        this.reset();
    });

    /* ---------- Footer Year ---------- */
    document.getElementById('year').textContent = new Date().getFullYear();

    /* ---------- Init ---------- */
    renderProducts();
})();
