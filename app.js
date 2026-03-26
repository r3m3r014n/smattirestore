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
const RECENTLY_VIEWED_KEY = 'smattire_recently_viewed';
const SITE_TUTORIAL_KEY = 'smattire_site_tutorial_seen';
const EXTERNAL_LINK_CONSENT_KEY = 'smattire_external_link_consent';
const STICKY_BAR_DELAY_MS = 3500;
let cart = JSON.parse(localStorage.getItem('cart') || '[]');
let currentProduct = null;
let currentFilter = 'all';
let conversionPromptShown = false;
let seraVoiceName = null;
let seraVoiceReady = false;
let seraAssistantActivated = false;
let lastFocusedElement = null;

const navigationPsychologyMessages = {
    discover: 'Discover high-intent products first to reduce decision fatigue.',
    validate: 'Use social proof and recently viewed items to reinforce choices before checkout.',
    commit: 'Commit mode active: reduce checkout friction with clear next-best-action prompts.'
};

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
        avatar_mode: 'sera_ai_shopping_assistant',
        ts_utc: new Date().toISOString(),
        ...data
    };
    postNetlifyForm('product-interactions', payload);
}

function normalizeLocale(locale) {
    return (locale || '').toLowerCase().replace('_', '-');
}

function localePrefix(locale) {
    const normalized = normalizeLocale(locale);
    return normalized.split('-')[0];
}

function getUserLocaleCandidates() {
    const candidates = [];
    if (typeof navigator === 'undefined') return candidates;
    if (Array.isArray(navigator.languages)) candidates.push(...navigator.languages);
    if (navigator.language) candidates.push(navigator.language);

    const deduped = [];
    const seen = new Set();
    candidates.forEach(locale => {
        const normalized = normalizeLocale(locale);
        if (!normalized || seen.has(normalized)) return;
        deduped.push(normalized);
        seen.add(normalized);
    });
    return deduped;
}

function selectSeraVoice(preferredLocale) {
    const voices = window.speechSynthesis ? window.speechSynthesis.getVoices() : [];
    if (!voices.length) return null;

    const normalizedPreferredLocale = normalizeLocale(preferredLocale);
    const userLocales = normalizedPreferredLocale
        ? [normalizedPreferredLocale, ...getUserLocaleCandidates().filter(locale => locale !== normalizedPreferredLocale)]
        : getUserLocaleCandidates();

    const languagePreferences = [];
    const seenLanguages = new Set();
    userLocales.forEach(locale => {
        const prefix = localePrefix(locale);
        if (prefix && !seenLanguages.has(prefix)) {
            languagePreferences.push(prefix);
            seenLanguages.add(prefix);
        }
    });

    const voiceLocale = voice => normalizeLocale(voice.lang);
    const voiceLanguage = voice => localePrefix(voiceLocale(voice));

    let preferred = null;
    for (const locale of userLocales) {
        preferred = voices.find(voice => voiceLocale(voice) === locale);
        if (preferred) break;
    }

    if (!preferred) {
        for (const language of languagePreferences) {
            preferred = voices.find(voice => voiceLanguage(voice) === language);
            if (preferred) break;
        }
    }

    if (!preferred) {
        const englishVoices = voices.filter(voice => voiceLanguage(voice) === 'en');
        const africanEnglishLocales = new Set(['en-za', 'en-ng', 'en-ke', 'en-gh', 'en-tz', 'en-ug']);
        const africanEnglish = englishVoices.find(voice => {
            const locale = voiceLocale(voice);
            const normalizedVoiceName = String(voice.name || '').toLowerCase().replace(/[\s_-]+/g, '');
            return africanEnglishLocales.has(locale) || /(africa|nigeria|kenya|ghana|southafrica)/i.test(normalizedVoiceName);
        });
        preferred = africanEnglish || englishVoices[0] || voices[0];
    }

    seraVoiceName = preferred ? preferred.name : null;
    seraVoiceReady = true;
    return preferred;
}

function getSeraMessage() {
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartCount === 0) {
        return 'Hello, I am Sera. Welcome to SM ATTIRE. Start with top sellers and discover your best fit quickly.';
    }
    if (cartCount < 3) {
        return 'Hi, this is Sera. Great choice so far. Review recently viewed options, then continue to checkout.';
    }
    return 'Sera here. Your cart is ready. Open cart now and complete WhatsApp checkout in under a minute.';
}

function stopSeraVoice() {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
}

function speakSeraAssistant() {
    if (!('speechSynthesis' in window) || typeof window.SpeechSynthesisUtterance === 'undefined') return;
    seraAssistantActivated = true;
    updateJourneyAssistant();

    stopSeraVoice();
    const utterance = new SpeechSynthesisUtterance(getSeraMessage());
    const voice = selectSeraVoice();
    if (voice) {
        utterance.voice = voice;
        utterance.lang = voice.lang || 'en';
    } else {
        utterance.lang = normalizeLocale((typeof navigator !== 'undefined' && navigator.language) ? navigator.language : 'en') || 'en';
    }
    utterance.rate = 0.95;
    utterance.pitch = 1.05;
    utterance.volume = 1;

    if (!voice && seraVoiceName) {
        const selected = window.speechSynthesis.getVoices().find(item => item.name === seraVoiceName);
        if (selected) {
            utterance.voice = selected;
            utterance.lang = selected.lang || utterance.lang;
        }
    }

    window.speechSynthesis.speak(utterance);
    trackProductInteraction('sera_voice_play', { cta_text: 'Play Voice', voice_lang: utterance.lang });
}

function saveRecentlyViewed(productId) {
    const current = JSON.parse(localStorage.getItem(RECENTLY_VIEWED_KEY) || '[]');
    const next = [productId, ...current.filter(id => id !== productId)].slice(0, 8);
    localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(next));
}

function clearRecentlyViewed() {
    localStorage.removeItem(RECENTLY_VIEWED_KEY);
    renderRecentlyViewed();
    trackProductInteraction('recently_viewed_cleared');
}

function renderRecentlyViewed() {
    const container = document.getElementById('recentlyViewedGrid');
    if (!container) return;
    const ids = JSON.parse(localStorage.getItem(RECENTLY_VIEWED_KEY) || '[]');
    if (!ids.length) {
        container.innerHTML = '<p class="col-span-full text-white/60">No viewed products yet. Tap any product to start your journey.</p>';
        return;
    }
    const list = ids.map(id => products.find(item => item.id === id)).filter(Boolean);
    container.innerHTML = list.map(createProductCard).join('');
}

function updateJourneyAssistant() {
    const node = document.getElementById('journeyAssistantText');
    if (!node) return;
    if (!seraAssistantActivated) {
        node.textContent = 'Sera is on standby. Tap Discover, Cart, or Play Voice when you need help.';
        return;
    }
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartCount === 0) {
        node.textContent = navigationPsychologyMessages.discover;
    } else if (cartCount < 3) {
        node.textContent = navigationPsychologyMessages.validate;
    } else {
        node.textContent = navigationPsychologyMessages.commit;
    }
}

function announceToScreenReader(message) {
    const liveRegion = document.getElementById('srStatus');
    if (!liveRegion || !message) return;
    liveRegion.textContent = '';
    window.setTimeout(() => {
        liveRegion.textContent = String(message);
    }, 40);
}

function rememberFocus() {
    if (document.activeElement instanceof HTMLElement) {
        lastFocusedElement = document.activeElement;
    }
}

function restoreFocus() {
    if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
        lastFocusedElement.focus();
    }
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
    updateJourneyAssistant();

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
    const willOpen = sidebar.classList.contains('translate-x-full');
    if (willOpen) rememberFocus();
    seraAssistantActivated = true;
    updateJourneyAssistant();
    sidebar.classList.toggle('translate-x-full');
    const isOpen = !sidebar.classList.contains('translate-x-full');
    if (isOpen) {
        const closeButton = sidebar.querySelector('button[onclick="toggleCart()"]');
        if (closeButton instanceof HTMLElement) closeButton.focus();
        announceToScreenReader('Cart opened');
    } else {
        restoreFocus();
        announceToScreenReader('Cart closed');
    }
    trackProductInteraction('cart_toggle', { sidebar_open: String(isOpen) });
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

    rememberFocus();
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden';
    const closeButton = modal.querySelector('button[onclick="closeModal()"]');
    if (closeButton instanceof HTMLElement) closeButton.focus();
    saveRecentlyViewed(currentProduct.id);
    renderRecentlyViewed();
    announceToScreenReader(`${currentProduct.name} details opened`);
    trackProductInteraction('product_view', { product_id: String(currentProduct.id), product_name: currentProduct.name, product_category: currentProduct.category });
}

function closeModal() {
    const modal = document.getElementById('productModal');
    if (!modal) return;

    modal.classList.add('hidden');
    modal.classList.remove('flex');
    document.body.style.overflow = '';
    restoreFocus();
    announceToScreenReader('Product details closed');
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
    restoreFocus();
    announceToScreenReader('Prompt closed');
}

function initializeConversionPrompts() {
    const sticky = document.getElementById('stickyBuyBar');
    const closeSticky = document.getElementById('closeStickyBuyBar');
    const modal = document.getElementById('exitIntentModal');

    if (sticky) {
        setTimeout(() => sticky.classList.remove('hidden'), STICKY_BAR_DELAY_MS);
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
    window.addEventListener('pagehide', () => {
        trackProductInteraction('pagehide');
    });
}

function initializeSiteTutorial() {
    const modal = document.getElementById('siteTutorialModal');
    const titleNode = document.getElementById('siteTutorialTitle');
    const bodyNode = document.getElementById('siteTutorialBody');
    const progressNode = document.getElementById('siteTutorialProgress');
    const nextBtn = document.getElementById('siteTutorialNext');
    const skipBtn = document.getElementById('siteTutorialSkip');
    const doneBtn = document.getElementById('siteTutorialDone');
    if (!modal || !titleNode || !bodyNode || !progressNode || !nextBtn || !skipBtn || !doneBtn) return;

    const slides = [
        {
            title: 'Welcome to SM ATTIRE',
            body: 'Browse Featured Drops, shop by category, and use quick cart actions for faster checkout.'
        },
        {
            title: 'Smart Shopping Features',
            body: 'Use social feed highlights, recently viewed products, and top sellers to compare quickly.'
        },
        {
            title: 'Sera Assistant + Fast Checkout',
            body: 'Sera stays on standby until you tap Discover, Cart, or Play Voice. Checkout completes via WhatsApp + M-Pesa.'
        }
    ];

    let index = 0;
    const closeTutorial = (markSeen = true) => {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        if (markSeen) localStorage.setItem(SITE_TUTORIAL_KEY, 'yes');
        restoreFocus();
        announceToScreenReader('Site tutorial closed');
    };
    const render = () => {
        const step = slides[index];
        titleNode.textContent = step.title;
        bodyNode.textContent = step.body;
        progressNode.textContent = `${index + 1}/${slides.length}`;
        nextBtn.classList.toggle('hidden', index >= slides.length - 1);
        doneBtn.classList.toggle('hidden', index < slides.length - 1);
    };

    nextBtn.addEventListener('click', () => {
        index = Math.min(index + 1, slides.length - 1);
        render();
    });
    doneBtn.addEventListener('click', () => closeTutorial(true));
    skipBtn.addEventListener('click', () => closeTutorial(true));
    modal.addEventListener('click', event => {
        if (event.target === modal) closeTutorial(true);
    });

    const seen = localStorage.getItem(SITE_TUTORIAL_KEY) === 'yes';
    if (seen) return;
    rememberFocus();
    render();
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    nextBtn.focus();
    announceToScreenReader('Site tutorial opened');
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
        const parsed = new URL(url);
        if (!['https:', 'http:'].includes(parsed.protocol)) return url;
        const host = parsed.hostname.toLowerCase();
        const hostParts = host.split('.').filter(Boolean);
        const isTikTokHost = (host === 'tiktok.com' || host === 'www.tiktok.com' || host.endsWith('.tiktok.com')) && hostParts.slice(-2).join('.') === 'tiktok.com';
        const isInstagramHost = (host === 'instagram.com' || host === 'www.instagram.com' || host.endsWith('.instagram.com')) && hostParts.slice(-2).join('.') === 'instagram.com';
        const isExternal = parsed.origin !== window.location.origin;

        if (isExternal && (isTikTokHost || isInstagramHost)) {
            localStorage.setItem(EXTERNAL_LINK_CONSENT_KEY, 'yes');
            console.info('Auto-granted consent for social link per user preference to prioritize content.');
        } else if (isExternal) {
            const proceed = window.confirm(`You are opening an external link to ${host}. Continue?`);
            if (!proceed) return url;
        }
        return parsed.href;
    } catch (error) {
        return url;
    }
    return url;
}

function mountFacadeIframe(card) {
    if (!card) return;
    const postUrl = card.dataset.postUrl;
    if (!postUrl) return;
    window.open(postUrl, '_blank', 'noopener,noreferrer');
}

let socialFacadesInitialized = false;

function initializeSeraAssistant() {
    const toggleBtn = document.getElementById('seraToggleBtn');
    const panel = document.getElementById('seraPanel');
    const closeBtn = document.getElementById('seraPanelClose');
    if (!toggleBtn || !panel) return;

    toggleBtn.addEventListener('click', () => {
        const isOpen = !panel.hidden;
        panel.hidden = isOpen;
        toggleBtn.setAttribute('aria-expanded', String(!isOpen));
        if (!isOpen) {
            seraAssistantActivated = true;
            updateJourneyAssistant();
        }
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            panel.hidden = true;
            toggleBtn.setAttribute('aria-expanded', 'false');
            toggleBtn.focus();
        });
    }
}

function initializeSocialFacades() {
    if (socialFacadesInitialized) return;
    socialFacadesInitialized = true;
    const cards = Array.from(document.querySelectorAll('.social-facade')).slice(0, 6);
    if (!cards.length) return;

    cards.forEach(card => {
        const trigger = card.querySelector('.facade-trigger');
        if (trigger) {
            trigger.addEventListener('click', () => mountFacadeIframe(card));
        }
    });
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
    const isAllowedSocialUrl = url => {
        try {
            const parsed = new URL(url);
            const host = parsed.hostname.toLowerCase();
            const isInstagram = host === 'instagram.com' || host === 'www.instagram.com' || host.endsWith('.instagram.com');
            const isTikTok = host === 'tiktok.com' || host === 'www.tiktok.com' || host.endsWith('.tiktok.com');
            return isInstagram || isTikTok;
        } catch (error) {
            return false;
        }
    };

    document.querySelectorAll('a[data-optimize-link="true"]').forEach(anchor => {
        anchor.addEventListener('click', event => {
            const href = anchor.getAttribute('href');
            if (!href) return;
            event.preventDefault();
            const optimized = openOptimizedSocialLink(href);
            if (!isAllowedSocialUrl(optimized)) {
                console.warn('Blocked external navigation: unrecognized social host.');
                return;
            }
            const popup = window.open(optimized, '_blank', 'noopener,noreferrer');
            if (popup) {
                popup.opener = null;
                return;
            }
            // Second attempt with minimal features to improve chances when stricter popup settings block the first attempt.
            const fallbackPopup = window.open(optimized, '_blank');
            if (fallbackPopup) {
                fallbackPopup.opener = null;
                return;
            }
            const existingConsent = localStorage.getItem(EXTERNAL_LINK_CONSENT_KEY);
            if (existingConsent !== 'yes') {
                // Auto-grant consent during fallback navigation to keep social links visible as prioritized by user instruction.
                localStorage.setItem(EXTERNAL_LINK_CONSENT_KEY, 'yes');
            }
            window.location.assign(optimized);
        });
    });
}

document.addEventListener('click', event => {
    const modal = document.getElementById('productModal');
    if (modal && event.target === modal) closeModal();
});

document.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    const modal = document.getElementById('productModal');
    const exitIntentModal = document.getElementById('exitIntentModal');
    const tutorialModal = document.getElementById('siteTutorialModal');
    const cartSidebar = document.getElementById('cartSidebar');
    if (modal && !modal.classList.contains('hidden')) {
        closeModal();
        return;
    }
    if (exitIntentModal && !exitIntentModal.classList.contains('hidden')) {
        closeExitIntentPrompt();
        return;
    }
    if (tutorialModal && !tutorialModal.classList.contains('hidden')) {
        const doneBtn = document.getElementById('siteTutorialDone');
        if (doneBtn instanceof HTMLElement && !doneBtn.classList.contains('hidden')) {
            doneBtn.click();
        } else {
            const skipBtn = document.getElementById('siteTutorialSkip');
            if (skipBtn instanceof HTMLElement) skipBtn.click();
        }
        return;
    }
    if (cartSidebar && !cartSidebar.classList.contains('translate-x-full')) {
        toggleCart();
    }
});

document.addEventListener('DOMContentLoaded', () => {
    updateCart();
    initializeLangToggle();
    initializeOptimizedLinks();
    syncFeedbackForms();
    initializeSocialFacades();
    initializeCookieConsent();
    initializeConversionPrompts();
    initializeSiteTutorial();
    initializeSeraAssistant();
    renderRecentlyViewed();
    updateJourneyAssistant();

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
            if (anchor.dataset.track === 'assistant_discover') {
                seraAssistantActivated = true;
                updateJourneyAssistant();
            }
            trackProductInteraction(anchor.dataset.track || 'cta_click', { cta_text: anchor.textContent.trim() });
        });
    });

    if ('speechSynthesis' in window) {
        selectSeraVoice();
        window.speechSynthesis.onvoiceschanged = selectSeraVoice;
    }
});
