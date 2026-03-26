const products = [
    { id: 1, name: "Grade A Vintage Graphic Tee", category: "Casual Streetwear", price: 800, image: "1.jpg", badge: "Bestseller", desc: "Premium Grade A mitumba graphic t-shirt. Clean, trendy, and perfect for the Nairobi streetwear scene." },
    { id: 2, name: "Thrifted Cargo Pants - Olive", category: "Casual Streetwear", price: 1500, image: "2.jpg", badge: "Hot", desc: "Gently used tactical cargo pants. High-quality thrift wear for a rugged, casual look." },
    { id: 3, name: "Gently Used Air Force 1s", category: "Neatfit Collection", price: 3500, image: "3.jpg", badge: "Shoe Lover", desc: "Top-tier Neatfit Collection sneakers. Carefully cleaned and restored. Delivery within Nairobi." },
    { id: 4, name: "Oversized Flannel Shirt", category: "Casual Streetwear", price: 900, image: "4.jpg", badge: "", desc: "Classic thrifted flannel shirt. Perfect for layering during cold Nairobi mornings." },
    { id: 5, name: "Retro Running Sneakers", category: "Neatfit Collection", price: 2800, image: "5.jpg", badge: "Trending", desc: "Affordable, high-quality mitumba running shoes. Grade A condition with plenty of life left." },
    { id: 6, name: "Classic Denim Jacket", category: "Casual Streetwear", price: 1800, image: "6.jpg", badge: "", desc: "Vintage mitumba denim jacket. A timeless casual staple handpicked for quality." },
    { id: 7, name: "High-Top Canvas Shoes", category: "Neatfit Collection", price: 1800, image: "7.jpg", badge: "Deal", desc: "Clean Neatfit Collection canvas shoes. A budget-friendly addition to your sneaker rotation." },
    { id: 8, name: "Thrifted Streetwear Hoodie", category: "Casual Streetwear", price: 1300, image: "8.jpg", badge: "", desc: "Heavyweight Grade A hoodie. Stay warm and stylish without breaking the bank." },
    { id: 9, name: "Premium Neatfit Jordans", category: "Neatfit Collection", price: 4200, image: "9.jpg", badge: "Exclusive", desc: "Rare find! Highly sought-after mitumba sneakers for true Nairobi shoe lovers." },
    { id: 10, name: "Y2K Baggy Jeans", category: "Casual Streetwear", price: 1400, image: "10.jpg", badge: "Trending", desc: "Authentic vintage baggy denim. The ultimate thrift find for casual streetwear fans." },
    { id: 11, name: "Vintage Windbreaker", category: "Casual Streetwear", price: 1600, image: "11.jpg", badge: "", desc: "Lightweight retro windbreaker jacket. Grade A mitumba perfect for the rainy season." },
    { id: 12, name: "Mitumba Chelsea Boots", category: "Neatfit Collection", price: 2500, image: "12.jpg", badge: "Quality", desc: "Gently used leather Chelsea boots. Look sharp on a budget." },
    { id: 13, name: "Casual Summer Shorts", category: "Casual Streetwear", price: 700, image: "13.jpg", badge: "", desc: "Comfortable thrifted shorts for weekend wear. Affordable and high quality." },
    { id: 14, name: "Slip-On Casual Vans", category: "Neatfit Collection", price: 1900, image: "14.jpg", badge: "", desc: "Easy, everyday Neatfit Collection slip-on sneakers. Cleaned, prepped, and ready to wear." }
];

const WHATSAPP_NUMBER = '254701226084';
const CONSENT_KEY = 'smattire_cookie_choice';
const LANG_KEY = 'smattire_lang';
let cart = JSON.parse(localStorage.getItem('cart') || '[]');
let currentProduct = null;
let currentFilter = 'all';
let conversionPromptShown = false;

const copyDictionary = {
    en: {
        heroTagline: 'Classy, Elegant, Style',
        heroSubtitle: 'Your Ultimate Fashion Guide for elegant looks, smart pricing, and premium thrift confidence.',
        shopNow: 'Shop Now',
        viewCollection: 'View Collection'
    },
    sw: {
        heroTagline: 'Mtindo wa Kifahari, Elegance, Style',
        heroSubtitle: 'Mwongozo wako kamili wa mitindo ya kifahari kwa bei rafiki na confidence ya thrift premium.',
        shopNow: 'Nunua Sasa',
        viewCollection: 'Tazama Mkusanyiko'
    }
};

function createProductCard(product) {
    return `
        <article class="bg-charcoal/80 border border-gold/30 rounded-2xl overflow-hidden backdrop-blur-sm hover:border-gold hover:-translate-y-1 transition-all duration-300 cursor-pointer content-visibility-auto" onclick="openModal(${product.id})">
            <div class="relative h-72 overflow-hidden bg-dark">
                ${product.badge ? `<span class="absolute top-3 left-3 z-10 bg-gold text-dark text-xs font-bold uppercase px-3 py-1 rounded-full">${product.badge}</span>` : ''}
                <img src="${product.image}" alt="${product.name}" loading="lazy" class="w-full h-full object-cover transition-transform duration-500 hover:scale-110" onerror="this.onerror=null;this.src='https://via.placeholder.com/400x500/1a1a1a/d4af37?text=SM+ATTIRE';">
            </div>
            <div class="p-5">
                <p class="text-gold text-xs uppercase tracking-[0.18em] mb-2">${product.category}</p>
                <h3 class="font-playfair text-xl mb-3 leading-tight">${product.name}</h3>
                <p class="text-gold font-bold text-2xl">KES ${product.price.toLocaleString()}</p>
                <button onclick="quickAddToCartById(${product.id}, event)" class="mt-4 w-full bg-gold text-dark py-2.5 rounded-full text-xs uppercase tracking-[0.12em] font-bold hover:bg-gold-light transition-colors">Quick Add to Cart</button>
            </div>
        </article>
    `;
}



/**
 * Updates ItemList JSON-LD for currently rendered products to improve indexing of dynamic grids.
 * @param {Array<{name:string,image:string,category:string,desc:string,price:number}>} list
 * @param {string} pageName
 */
function updateProductListSchema(list, pageName = 'Product Listing') {
    const schemaNode = document.getElementById('productListSchema');
    if (!schemaNode) return;

    const itemListElement = list.map((product, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
            '@type': 'Product',
            name: product.name,
            image: `https://smattirestore.com/${product.image}`,
            category: product.category,
            description: product.desc,
            offers: {
                '@type': 'Offer',
                priceCurrency: 'KES',
                price: product.price,
                availability: 'https://schema.org/InStock',
                url: 'https://smattirestore.com/shop.html'
            }
        }
    }));

    const schema = {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: pageName,
        itemListElement
    };

    schemaNode.textContent = JSON.stringify(schema);
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function postNetlifyForm(formName, payload) {
    const data = new URLSearchParams({
        'form-name': formName,
        ...payload
    });
    return fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: data.toString()
    }).catch(() => {});
}

function trackProductInteraction(eventName, data = {}) {
    const payload = {
        event_name: eventName,
        page_path: window.location.pathname,
        page_title: document.title,
        cart_count: String(cart.reduce((sum, item) => sum + item.quantity, 0)),
        ts_utc: new Date().toISOString(),
        ...data
    };
    postNetlifyForm('product-interactions', payload);
}

function updateCart() {
    const cartItems = document.getElementById('cartItems');
    const cartCount = document.getElementById('cartCount');
    const cartTotal = document.getElementById('cartTotal');
    const checkoutBtn = document.getElementById('checkoutBtn');

    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    if (cartCount) cartCount.textContent = String(count);
    if (cartTotal) cartTotal.textContent = `KES ${total.toLocaleString()}`;
    if (checkoutBtn) checkoutBtn.disabled = cart.length === 0;

    if (!cartItems) return;

    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="text-white/60 text-center mt-8">Your cart is empty.</p>';
        return;
    }

    cartItems.innerHTML = cart.map(item => `
        <div class="border border-gold/20 rounded-xl p-3 bg-dark/60">
            <div class="flex gap-3">
                <img src="${item.image}" alt="${item.name}" class="w-16 h-16 object-cover rounded-lg" loading="lazy" onerror="this.onerror=null;this.src='https://via.placeholder.com/120x120/1a1a1a/d4af37?text=SM';">
                <div class="flex-1 min-w-0">
                    <p class="font-playfair truncate">${item.name}</p>
                    <p class="text-gold font-bold">KES ${item.price.toLocaleString()}</p>
                    <div class="flex items-center gap-2 mt-2">
                        <button onclick="updateQuantity(${item.id}, -1)" class="w-7 h-7 border border-gold text-gold rounded">-</button>
                        <span class="w-6 text-center">${item.quantity}</span>
                        <button onclick="updateQuantity(${item.id}, 1)" class="w-7 h-7 border border-gold text-gold rounded">+</button>
                        <button onclick="removeFromCart(${item.id})" class="ml-auto text-red-400 text-sm">Remove</button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

function addToCart(product) {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    saveCart();
    updateCart();
    trackProductInteraction('add_to_cart', { product_id: String(product.id), product_name: product.name, product_category: product.category });
}

function quickAddToCartById(id, event) {
    if (event) event.stopPropagation();
    const product = products.find(item => item.id === id);
    if (!product) return;
    addToCart(product);
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    saveCart();
    updateCart();
}

function updateQuantity(id, change) {
    const item = cart.find(entry => entry.id === id);
    if (!item) return;

    item.quantity += change;
    if (item.quantity <= 0) {
        cart = cart.filter(entry => entry.id !== id);
    }

    saveCart();
    updateCart();
}

function toggleCart() {
    const sidebar = document.getElementById('cartSidebar');
    if (!sidebar) return;
    sidebar.classList.toggle('translate-x-full');
    trackProductInteraction('cart_toggle', { sidebar_open: String(!sidebar.classList.contains('translate-x-full')) });
}

function openModal(id) {
    currentProduct = products.find(product => product.id === id) || null;
    if (!currentProduct) return;

    const modal = document.getElementById('productModal');
    if (!modal) return;

    const modalImg = document.getElementById('modalImg');
    const modalName = document.getElementById('modalName');
    const modalPrice = document.getElementById('modalPrice');
    const modalDesc = document.getElementById('modalDesc');
    const modalBadge = document.getElementById('modalBadge');
    const modalCategory = document.getElementById('modalCategory');

    if (modalImg) modalImg.src = currentProduct.image;
    if (modalName) modalName.textContent = currentProduct.name;
    if (modalPrice) modalPrice.textContent = `KES ${currentProduct.price.toLocaleString()}`;
    if (modalDesc) modalDesc.textContent = currentProduct.desc;
    if (modalCategory) modalCategory.textContent = currentProduct.category;

    if (modalBadge) {
        if (currentProduct.badge) {
            modalBadge.textContent = currentProduct.badge;
            modalBadge.classList.remove('hidden');
        } else {
            modalBadge.classList.add('hidden');
        }
    }

    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden';
    trackProductInteraction('product_view', { product_id: String(currentProduct.id), product_name: currentProduct.name, product_category: currentProduct.category });
}

function closeModal() {
    const modal = document.getElementById('productModal');
    if (!modal) return;

    modal.classList.add('hidden');
    modal.classList.remove('flex');
    document.body.style.overflow = '';
    currentProduct = null;
}

function addFromModal() {
    if (!currentProduct) return;
    addToCart(currentProduct);
    closeModal();
    toggleCart();
}

function renderProducts(list) {
    const productGrid = document.getElementById('productGrid');
    if (!productGrid) return;

    if (!list.length) {
        productGrid.innerHTML = '<p class="col-span-full text-center text-white/60 py-14">No products found in this category.</p>';
        return;
    }

    productGrid.innerHTML = list.map(createProductCard).join('');
}

function filterProducts(category) {
    currentFilter = category;

    document.querySelectorAll('.filter-btn').forEach(button => {
        const isActive = button.dataset.filter === category;
        button.classList.toggle('text-gold', !isActive);
        button.classList.toggle('bg-gold', isActive);
        button.classList.toggle('text-dark', isActive);
        button.classList.toggle('border-gold', true);
    });

    if (category === 'all') {
        renderProducts(products);
        updateProductListSchema(products, 'All SM ATTIRE Products');
        trackProductInteraction('filter_products', { category: 'all', result_count: String(products.length) });
        return;
    }

    const filtered = products.filter(product => product.category === category);
    renderProducts(filtered);
    updateProductListSchema(filtered, `${category} - SM ATTIRE`);
    trackProductInteraction('filter_products', { category, result_count: String(filtered.length) });
}

function applyHashFilter() {
    const hash = window.location.hash.toLowerCase();
    if (hash === '#casual-streetwear') {
        filterProducts('Casual Streetwear');
    } else if (hash === '#neatfit-collection') {
        filterProducts('Neatfit Collection');
    } else {
        filterProducts('all');
    }
}

function checkout() {
    if (!cart.length) return;

    let total = 0;
    let lines = ['SM ATTIRE Order Request', '', 'Items:'];

    cart.forEach(item => {
        const subtotal = item.price * item.quantity;
        total += subtotal;
        lines.push(`• ${item.name} x${item.quantity} - KES ${subtotal.toLocaleString()}`);
    });

    lines.push('');
    lines.push(`Total: KES ${total.toLocaleString()}`);
    lines.push('Payment: M-Pesa');
    lines.push('Delivery Location: Nairobi / Kenya');

    const message = encodeURIComponent(lines.join('\n'));
    trackProductInteraction('checkout_intent', {
        total_kes: String(total),
        items_count: String(cart.reduce((sum, item) => sum + item.quantity, 0))
    });
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank');
}

function showExitIntentPrompt() {
    const modal = document.getElementById('exitIntentModal');
    if (!modal || conversionPromptShown) return;
    conversionPromptShown = true;
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    trackProductInteraction('exit_intent_prompt_shown');
}

function closeExitIntentPrompt() {
    const modal = document.getElementById('exitIntentModal');
    if (!modal) return;
    modal.classList.add('hidden');
    modal.classList.remove('flex');
}

function initializeConversionPrompts() {
    const sticky = document.getElementById('stickyBuyBar');
    const closeSticky = document.getElementById('closeStickyBuyBar');
    const modal = document.getElementById('exitIntentModal');

    if (sticky) {
        setTimeout(() => sticky.classList.remove('hidden'), 3500);
    }
    if (closeSticky && sticky) {
        closeSticky.addEventListener('click', () => {
            sticky.classList.add('hidden');
            trackProductInteraction('sticky_bar_closed');
        });
    }

    if (modal) {
        modal.addEventListener('click', event => {
            if (event.target === modal) closeExitIntentPrompt();
        });
    }

    document.addEventListener('mouseout', event => {
        if (event.clientY <= 0) showExitIntentPrompt();
    });
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') {
            trackProductInteraction('tab_hidden');
        }
    });
}

function setLanguage(lang) {
    const selected = copyDictionary[lang] ? lang : 'en';
    localStorage.setItem(LANG_KEY, selected);
    document.querySelectorAll('[data-i18n]').forEach(node => {
        const key = node.dataset.i18n;
        const copy = copyDictionary[selected][key];
        if (copy) node.textContent = copy;
    });
    const langToggle = document.getElementById('langToggle');
    if (langToggle) langToggle.textContent = selected === 'en' ? 'SW' : 'EN';
}

function openOptimizedSocialLink(url) {
    try {
        const allowMirror = localStorage.getItem('smattire_fast_link_optin') === 'yes';
        if (!allowMirror) return url;
        const parsed = new URL(url);
        const host = parsed.hostname.toLowerCase();
        const isTikTokHost = host === 'tiktok.com' || host === 'www.tiktok.com' || host.endsWith('.tiktok.com');
        const isInstagramHost = host === 'instagram.com' || host === 'www.instagram.com' || host.endsWith('.instagram.com');

        if (isTikTokHost) {
            const path = `${parsed.pathname}${parsed.search || ''}`;
            return `https://tiktokez.com${path}`;
        }
        if (isInstagramHost) {
            const path = `${parsed.pathname}${parsed.search || ''}`;
            return `https://xeezz.com${path}`;
        }
    } catch (error) {
        return url;
    }
    return url;
}

function mountFacadeIframe(card) {
    if (!card || card.dataset.loaded === 'true') return;
    const target = card.querySelector('.facade-frame');
    if (!target) return;

    const embedUrl = card.dataset.embedUrl;
    if (!embedUrl) return;

    const iframe = document.createElement('iframe');
    iframe.src = embedUrl;
    iframe.loading = 'lazy';
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    iframe.referrerPolicy = 'strict-origin-when-cross-origin';
    iframe.title = `${card.dataset.platform || 'social'} embed`;

    target.classList.remove('hidden');
    target.innerHTML = '';
    target.appendChild(iframe);
    card.dataset.loaded = 'true';
}

function initializeSocialFacades() {
    const cards = Array.from(document.querySelectorAll('.social-facade')).slice(0, 6);
    if (!cards.length) return;
    const allowAutoload = localStorage.getItem(CONSENT_KEY) === 'allow';

    cards.forEach(card => {
        const trigger = card.querySelector('.facade-trigger');
        if (trigger) {
            trigger.addEventListener('click', () => mountFacadeIframe(card));
        }
    });

    if (!allowAutoload) return;
    if (!('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const card = entry.target;
            if (card.dataset.autoload === 'visible') mountFacadeIframe(card);
            observer.unobserve(card);
        });
    }, { rootMargin: '120px 0px', threshold: 0.15 });

    cards.forEach(card => observer.observe(card));
}

function syncFeedbackForms() {
    const forms = Array.from(document.querySelectorAll('form'));
    if (!forms.length) return;

    const seoTopic = document.title.toLowerCase().replace(/[^a-z0-9\s]/gi, ' ').trim();
    const marketSignal = navigator.language || 'en';
    const sourcePath = window.location.pathname;
    const sourceRef = document.referrer || 'direct';
    const utcTimestamp = new Date().toISOString();

    forms.forEach(form => {
        [
            ['seo_topic', seoTopic],
            ['market_signal', marketSignal],
            ['source_path', sourcePath],
            ['source_referrer', sourceRef],
            ['captured_at_utc', utcTimestamp]
        ].forEach(([name, value]) => {
            let field = form.querySelector(`input[name="${name}"]`);
            if (!field) {
                field = document.createElement('input');
                field.type = 'hidden';
                field.name = name;
                form.appendChild(field);
            }
            field.value = value;
        });
    });
}

function initializeCookieConsent() {
    const banner = document.getElementById('cookieConsent');
    const accept = document.getElementById('acceptCookies');
    const decline = document.getElementById('declineCookies');
    if (!banner || !accept || !decline) return;

    const saved = localStorage.getItem(CONSENT_KEY);
    if (!saved) banner.classList.remove('hidden');

    const applyChoice = choice => {
        localStorage.setItem(CONSENT_KEY, choice);
        banner.classList.add('hidden');
        if (choice === 'allow') {
            initializeSocialFacades();
            const apiFeed = document.getElementById('officialApiFeed');
            if (apiFeed) {
                apiFeed.innerHTML = '<p class="text-white/70 text-sm">Optional media integrations enabled. Add provider script settings to activate live API feed.</p>';
            }
        }
    };

    accept.addEventListener('click', () => applyChoice('allow'));
    decline.addEventListener('click', () => applyChoice('essential'));

    if (saved === 'allow') initializeSocialFacades();
}

function initializeLangToggle() {
    const toggle = document.getElementById('langToggle');
    const initial = localStorage.getItem(LANG_KEY) || 'en';
    setLanguage(initial);
    if (!toggle) return;
    toggle.addEventListener('click', () => {
        const next = (localStorage.getItem(LANG_KEY) || 'en') === 'en' ? 'sw' : 'en';
        setLanguage(next);
    });
}

function initializeOptimizedLinks() {
    document.querySelectorAll('a[data-optimize-link="true"]').forEach(anchor => {
        anchor.addEventListener('click', event => {
            const href = anchor.getAttribute('href');
            if (!href) return;
            event.preventDefault();
            const optimized = openOptimizedSocialLink(href);
            window.open(optimized, '_blank', 'noopener');
        });
    });
}

document.addEventListener('click', event => {
    const modal = document.getElementById('productModal');
    if (modal && event.target === modal) closeModal();
});

document.addEventListener('DOMContentLoaded', () => {
    updateCart();
    initializeLangToggle();
    initializeOptimizedLinks();
    syncFeedbackForms();
    initializeSocialFacades();
    initializeCookieConsent();
    initializeConversionPrompts();

    const productGrid = document.getElementById('productGrid');
    if (productGrid) {
        applyHashFilter();
    }

    const featuredGrid = document.getElementById('featuredGrid');
    if (featuredGrid) {
        const featured = products.slice(0, 4);
        featuredGrid.innerHTML = featured.map(createProductCard).join('');
        updateProductListSchema(featured, 'Featured SM ATTIRE Drops');
    }

    const bestsellerGrid = document.getElementById('bestsellerGrid');
    if (bestsellerGrid) {
        const bestsellers = products.filter(product => Boolean(product.badge)).slice(0, 6);
        bestsellerGrid.innerHTML = bestsellers.map(createProductCard).join('');
    }

    window.addEventListener('hashchange', () => {
        const shopGrid = document.getElementById('productGrid');
        if (shopGrid) applyHashFilter();
    });

    document.querySelectorAll('a[data-track]').forEach(anchor => {
        anchor.addEventListener('click', () => {
            trackProductInteraction(anchor.dataset.track || 'cta_click', { cta_text: anchor.textContent.trim() });
        });
    });
});
