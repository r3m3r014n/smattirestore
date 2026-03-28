const products = [
    { id: 1, name: "Jacket & Cap", category: "Casual Streetwear", price: 3300, image: "/jacket-and-cap.jpg", badge: "Bestseller", desc: "Bundle deal: stylish jacket plus matching cap for an effortless streetwear fit." },
    { id: 2, name: "Cotton Sweaters", category: "Casual Streetwear", price: 1500, image: "/cotton-sweaters.jpg", badge: "Hot", desc: "Soft cotton sweaters priced for everyday wear. Cozy, breathable, and ready for layering." },
    { id: 3, name: "Air Force 1s, T-Shirt & Cap", category: "Neatfit Collection", price: 5300, image: "/air-force-tee-cap.jpg", badge: "Shoe Lover", desc: "Complete set featuring Air Force 1s, a clean tee, and a coordinating cap for a full look." },
    { id: 4, name: "T-Shirts", category: "Casual Streetwear", price: 1000, image: "/t-shirts.jpg", badge: "", desc: "Classic tees at a friendly price. Everyday essentials for easy styling." },
    { id: 5, name: "White Striped Shirts", category: "Casual Streetwear", price: 1000, image: "/white-striped-shirts.jpg", badge: "Trending", desc: "White striped shirts with a clean, minimalist vibe. Perfect for smart-casual fits." },
    { id: 6, name: "Cap & Chanel Bag", category: "Casual Streetwear", price: 5800, image: "/cap-and-chanel-bag.jpg", badge: "", desc: "Cap plus Chanel-inspired bag bundle. Statement accessories for an elevated finish.", keywords: "Nairobi Thrift, Streetwear Kenya, Chanel bag bundle, statement accessories" },
    { id: 7, name: "Pink \"Alo\" Graphic Tee with Matching Cap", category: "Casual Streetwear", price: 1500, image: "/pink-alo-tee-cap.jpg", badge: "Deal", desc: "Brand-new Pink \"Alo\" graphic tee paired with a matching cap for a clean coordinated aesthetic. Fresh streetwear set with fast delivery in Nairobi.", keywords: "Nairobi fashion, Streetwear Kenya, pink alo graphic tee, matching cap set" },
    { id: 8, name: "Shoes", category: "Casual Streetwear", price: 3500, image: "/shoes.jpg", badge: "", desc: "Versatile shoes prepped and ready to wear. Clean, dependable, and easy to style.", keywords: "Nairobi Thrift, Streetwear Kenya, everyday shoes" },
    { id: 9, name: "Pink New Balance", category: "Neatfit Collection", price: 3500, image: "/pink-new-balance.jpg", badge: "Exclusive", desc: "Pink New Balance sneakers with a sleek retro-runner aesthetic. Brand-new pair with fast delivery in Nairobi.", keywords: "Nairobi fashion, Streetwear Kenya, pink new balance sneakers, retro runner style" },
    { id: 10, name: "White New Balance", category: "Neatfit Collection", price: 3500, image: "/white-new-balance.jpg", badge: "Trending", desc: "White New Balance sneakers for a clean, versatile look. Brand-new pick for any fit.", keywords: "Nairobi fashion, Streetwear Kenya, white new balance sneakers" },
    { id: 11, name: "Bag, Cap & Shoes", category: "Casual Streetwear", price: 9300, image: "/bag-cap-shoes.jpg", badge: "", desc: "Premium bundle-only price for a curated bag, cap, and shoes set — a full head-to-toe upgrade." },
    { id: 12, name: "New Balance 9060", category: "Neatfit Collection", price: 3500, image: "/new-balance-9060.jpg", badge: "Quality", desc: "New Balance 9060 sneakers with a chunky futuristic aesthetic. A Quality Vintage sneaker pick with fast delivery in Nairobi.", keywords: "Nairobi Thrift, Streetwear Kenya, Quality Vintage, new balance 9060, chunky sneaker" },
    { id: 13, name: "Nike Air & Cap", category: "Casual Streetwear", price: 4300, image: "/nike-air-and-cap.jpg", badge: "", desc: "Bundle: Nike Air sneakers paired with a cap for an instant streetwear finish.", keywords: "Nairobi Thrift, Streetwear Kenya, Nike Air bundle, cap" },
    { id: 14, name: "Nike", category: "Neatfit Collection", price: 3500, image: "/nike.jpg", badge: "", desc: "Nike sneakers brand new, prepped, and ready to wear." }
];

const WHATSAPP_NUMBER = '254701226084';
const CONSENT_KEY = 'smattire_cookie_choice';
const LANG_KEY = 'smattire_lang';
const RECENTLY_VIEWED_KEY = 'smattire_recently_viewed';
const SITE_TUTORIAL_KEY = 'smattire_site_tutorial_seen';
const EXTERNAL_LINK_CONSENT_KEY = 'smattire_external_link_consent';
const STICKY_BAR_DELAY_MS = 3500;
const notificationFeed = [
    {
        id: 'limited-stock',
        title: 'Limited Stock Momentum',
        body: 'Top picks are moving fast. Add your favorite now and finish checkout via WhatsApp while STK push rolls out.',
        cta: { label: 'View Products', href: '#featured' }
    },
    {
        id: 'mpesa-whatsapp',
        title: 'Checkout Options',
        body: 'The store is live. Complete your order through WhatsApp checkout and pay with M-Pesa (PayBill 303030, Account 2048379985).',
        cta: { label: 'Open Cart', action: 'cart' }
    }
];
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

// Grok-inspired AI: witty Sera responses
const seraWittyResponses = {
    greet: [
        "Heyyy! Sera online. Ready to make your wardrobe legendary? 👑",
        "Sup! I'm Sera — part AI, part fashion oracle. Let's find your fit!",
        "Sera here. Fueled by good taste and zero budget shame. What are you hunting?"
    ],
    recommend: [
        "Hot take: the {name} is literally flying off the shelves. Grab it before I do. 😅",
        "Trend alert 🔥 — {name} is what everyone in Nairobi is rocking right now.",
        "If style had a face it'd be {name}. Just saying."
    ],
    cart: [
        "Your cart is looking *chef's kiss*. Finish the checkout before someone else does! 🚀",
        "Nice haul! That's {count} items of pure drip. Time to seal the deal via WhatsApp.",
        "Ooh, {count} items in cart? You have taste. Let's make it official — checkout awaits!"
    ],
    voice: [
        "Try asking me: 'Show me shoes under 2000' or 'What's trending?' 🎙️",
        "Voice mode activated. Speak to me like I'm your personal stylist — I'm listening!",
        "Go ahead, ask me anything fashion. I'm unfiltered and opinionated. 😎"
    ],
    notFound: [
        "Hmm, I couldn't decode that. Try: 'shoes', 'trending', or 'under 1500'. I'm good, not psychic. 😂",
        "That stumped me! But hey — try 'cheap hoodies' or 'casual streetwear'. I'll nail it.",
        "I understood zero of that. Let's try again: ask about a category, price, or vibe!"
    ]
};

// Mock real-time social trends (simulated live feed)
const mockSocialTrends = [
    { tag: "#NairobiThrift", count: "12.4K posts", hot: true },
    { tag: "#CityStyle", count: "8.1K posts", hot: true },
    { tag: "#StreetWearKE", count: "6.7K posts", hot: false },
    { tag: "#GradeAFinds", count: "5.3K posts", hot: true },
    { tag: "#ThriftFlips", count: "4.9K posts", hot: false },
    { tag: "#NeatfitVibes", count: "3.8K posts", hot: false }
];

let seraChatHistory = [];
let seraVoiceSearchActive = false;
let seraSpeechRecognition = null;

function getSeraWitty(key, data = {}) {
    const pool = seraWittyResponses[key] || seraWittyResponses.notFound;
    let msg = pool[Math.floor(Math.random() * pool.length)];
    Object.keys(data).forEach(k => { msg = msg.replace(new RegExp(`\\{${k}\\}`, 'g'), data[k]); });
    return msg;
}

function getPersonalizedRecommendations() {
    const viewed = JSON.parse(localStorage.getItem(RECENTLY_VIEWED_KEY) || '[]');
    if (!viewed.length) return products.slice(0, 3);
    const viewedCategories = viewed.map(id => {
        const p = products.find(item => item.id === id);
        return p ? p.category : null;
    }).filter(Boolean);
    const topCategory = viewedCategories.sort((a, b) =>
        viewedCategories.filter(c => c === b).length - viewedCategories.filter(c => c === a).length
    )[0];
    return products.filter(p => p.category === topCategory).slice(0, 3);
}

function handleSeraChat(userMessage) {
    const msg = String(userMessage || '').trim().toLowerCase();
    if (!msg) return '';

    seraChatHistory.push({ role: 'user', text: userMessage });

    let response = '';
    const priceMatch = msg.match(/under\s+(\d+)/);
    const keywordShoes = /shoe|sneaker|boot|jordan|vans|air force/i.test(msg);
    const keywordHoodie = /hoodie|hooky/i.test(msg);
    const keywordJeans = /jean|denim|pant|cargo/i.test(msg);
    const keywordTrend = /trend|hot|popular|what.s new|viral/i.test(msg);
    const keywordPrice = /cheap|affordable|budget|price/i.test(msg);
    const keywordCart = /cart|checkout|buy|order/i.test(msg);
    const keywordGreet = /hi|hello|hey|sup|yo/i.test(msg);

    if (keywordGreet) {
        response = getSeraWitty('greet');
    } else if (keywordTrend) {
        const trend = mockSocialTrends.find(t => t.hot);
        response = `Trending right now: ${trend ? trend.tag + ' (' + trend.count + ')' : '#NairobiThrift'}. Check out our Casual Streetwear section — it's lit! 🔥`;
    } else if (keywordCart) {
        const count = cart.reduce((s, i) => s + i.quantity, 0);
        response = count > 0 ? getSeraWitty('cart', { count }) : "Your cart is empty. Let me fix that! Try 'show me shoes' or 'what's trending'. 😏";
    } else if (priceMatch) {
        const maxPrice = parseInt(priceMatch[1], 10);
        const affordable = products.filter(p => p.price <= maxPrice);
        response = affordable.length
            ? `Found ${affordable.length} items under KES ${maxPrice.toLocaleString()}: ${affordable.slice(0, 2).map(p => p.name).join(', ')}. Tap any to view! 🎯`
            : `Nothing under KES ${maxPrice.toLocaleString()} right now. Try 'under 1500' — plenty of fire finds! 🔥`;
    } else if (keywordShoes) {
        const shoes = products.filter(p => p.category === 'Neatfit Collection');
        const pick = shoes[Math.floor(Math.random() * shoes.length)];
        response = pick ? getSeraWitty('recommend', { name: pick.name }) : "Check the Neatfit Collection for premium kicks!";
    } else if (keywordHoodie) {
        const hoodie = products.find(p => /hoodie/i.test(p.name));
        response = hoodie ? getSeraWitty('recommend', { name: hoodie.name }) : "We've got hoodies in Casual Streetwear — super cozy and budget-friendly! 🧥";
    } else if (keywordJeans) {
        const jeans = products.find(p => /jean|cargo|pant/i.test(p.name));
        response = jeans ? getSeraWitty('recommend', { name: jeans.name }) : "Baggy jeans alert in Casual Streetwear — Y2K vibes are back! 👖";
    } else if (keywordPrice) {
        response = "Budget king energy! We have fits from KES 700. Try asking 'under 1000' or 'cheapest shoes'. 💸";
    } else {
        const recs = getPersonalizedRecommendations();
        const pick = recs[Math.floor(Math.random() * recs.length)];
        response = pick ? getSeraWitty('recommend', { name: pick.name }) : getSeraWitty('notFound')[0];
    }

    seraChatHistory.push({ role: 'sera', text: response });
    return response;
}

function renderSeraChatMessage(role, text) {
    const chatLog = document.getElementById('seraChatLog');
    if (!chatLog) return;
    const el = document.createElement('div');
    el.className = role === 'user'
        ? 'text-right text-white/80 text-xs mb-2'
        : 'text-left text-gold text-xs mb-2';
    const bubble = document.createElement('span');
    bubble.className = role === 'user'
        ? 'inline-block bg-white/10 rounded-2xl rounded-tr-sm px-3 py-1.5 max-w-[90%]'
        : 'inline-block bg-gold/10 border border-gold/20 rounded-2xl rounded-tl-sm px-3 py-1.5 max-w-[90%]';
    bubble.textContent = text;
    el.appendChild(bubble);
    chatLog.appendChild(el);
    chatLog.scrollTop = chatLog.scrollHeight;
}

function submitSeraChat() {
    const input = document.getElementById('seraChatInput');
    if (!input) return;
    const val = input.value.trim();
    if (!val) return;
    renderSeraChatMessage('user', val);
    input.value = '';
    const reply = handleSeraChat(val);
    setTimeout(() => {
        renderSeraChatMessage('sera', reply);
        announceToScreenReader(reply);
    }, 320);
    trackProductInteraction('sera_chat_message', { query: val });
}

function initSeraVoiceSearch() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return null;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-KE';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = event => {
        const transcript = event.results[0][0].transcript;
        const input = document.getElementById('seraChatInput');
        if (input) input.value = transcript;
        submitSeraChat();
        seraVoiceSearchActive = false;
        updateVoiceSearchBtn(false);
    };
    recognition.onerror = () => {
        seraVoiceSearchActive = false;
        updateVoiceSearchBtn(false);
    };
    recognition.onend = () => {
        seraVoiceSearchActive = false;
        updateVoiceSearchBtn(false);
    };
    return recognition;
}

function updateVoiceSearchBtn(active) {
    const btn = document.getElementById('seraVoiceSearchBtn');
    if (!btn) return;
    btn.setAttribute('aria-pressed', String(active));
    btn.classList.toggle('text-gold', active);
    btn.classList.toggle('text-white/60', !active);
    btn.title = active ? 'Listening...' : 'Voice search';
}

function toggleSeraVoiceSearch() {
    if (!seraSpeechRecognition) {
        seraSpeechRecognition = initSeraVoiceSearch();
    }
    if (!seraSpeechRecognition) {
        renderSeraChatMessage('sera', "Voice search isn't supported in your browser. Try Chrome! 🎙️");
        return;
    }
    if (seraVoiceSearchActive) {
        seraSpeechRecognition.stop();
        seraVoiceSearchActive = false;
        updateVoiceSearchBtn(false);
    } else {
        seraVoiceSearchActive = true;
        updateVoiceSearchBtn(true);
        renderSeraChatMessage('sera', getSeraWitty('voice'));
        seraSpeechRecognition.start();
    }
    trackProductInteraction('sera_voice_search_toggle', { active: String(seraVoiceSearchActive) });
}

function renderSocialTrends() {
    const container = document.getElementById('seraTrendsContainer');
    if (!container) return;
    container.innerHTML = mockSocialTrends.map(t =>
        `<span class="inline-flex items-center gap-1 px-2 py-1 rounded-full border ${t.hot ? 'border-gold/60 text-gold' : 'border-white/20 text-white/60'} text-[10px] cursor-default" title="${t.count}">${t.hot ? '🔥' : ''}${t.tag}</span>`
    ).join('');
}

function toggleDarkMode() {
    const isDark = document.documentElement.classList.toggle('light-mode');
    localStorage.setItem('smattire_theme', isDark ? 'light' : 'dark');
    const btn = document.getElementById('darkModeBtn');
    if (btn) btn.textContent = isDark ? '☀️' : '🌙';
    announceToScreenReader(isDark ? 'Light mode enabled' : 'Dark mode enabled');
}

function initDarkMode() {
    const saved = localStorage.getItem('smattire_theme');
    if (saved === 'light') {
        document.documentElement.classList.add('light-mode');
        const btn = document.getElementById('darkModeBtn');
        if (btn) btn.textContent = '☀️';
    }
}

const copyDictionary = {
    en: {
        heroTagline: 'Classy, Elegant, Style',
        heroSubtitle: 'Your Ultimate Fashion Guide for elegant looks, smart pricing, and premium new-arrival confidence.',
        shopNow: 'Shop Now',
        viewCollection: 'View Collection'
    },
    sw: {
        heroTagline: 'Mtindo wa Kifahari, Elegance, Style',
        heroSubtitle: 'Mwongozo wako kamili wa mitindo ya kifahari kwa bei rafiki na confidence ya bidhaa mpya premium.',
        shopNow: 'Nunua Sasa',
        viewCollection: 'Tazama Mkusanyiko'
    }
};

function productAltText(product) {
    return `${product.name} — ${product.category}, KES ${product.price.toLocaleString()} | Brand New, SM ATTIRE Nairobi`;
}

function createProductCard(product) {
    const isNeatfitShoe = product.category === 'Neatfit Collection';
    return `
        <article class="bg-charcoal/80 border border-gold/30 rounded-2xl overflow-hidden backdrop-blur-sm hover:border-gold hover:-translate-y-1 transition-all duration-300 cursor-pointer content-visibility-auto" onclick="openModal(${product.id})" itemscope itemtype="https://schema.org/Product">
            <meta itemprop="name" content="${product.name}">
            <meta itemprop="description" content="${product.desc}">
            ${product.keywords ? `<meta itemprop="keywords" content="${product.keywords}">` : ''}
            <meta itemprop="sku" content="SM-${String(product.id).padStart(3, '0')}">
            <div class="relative h-72 overflow-hidden bg-dark">
                ${product.badge ? `<span class="absolute top-3 left-3 z-10 bg-gold text-dark text-xs font-bold uppercase px-3 py-1 rounded-full">${product.badge}</span>` : ''}
                <div class="absolute top-3 right-3 z-10 flex items-center gap-2">
                    <img src="/sm-attire-logo.png" alt="SM ATTIRE brand mark" class="w-8 h-8 rounded-full object-cover border border-gold/60 bg-dark/80" loading="lazy">
                    ${isNeatfitShoe ? '<img src="/neatfit-logo.jpg" alt="Neatfit logo" class="h-7 w-auto rounded-md object-contain border border-gold/40 bg-dark/80 px-1" loading="lazy">' : ''}
                </div>
                <img src="${product.image}" alt="${productAltText(product)}" loading="lazy" itemprop="image" class="w-full h-full object-cover transition-transform duration-500 hover:scale-110" onerror="this.onerror=null;this.src='https://via.placeholder.com/400x500/1a1a1a/d4af37?text=SM+ATTIRE';">
            </div>
            <div class="p-5">
                <p class="text-gold text-xs uppercase tracking-[0.18em] mb-2" itemprop="category">${product.category}</p>
                <h3 class="font-playfair text-xl mb-3 leading-tight" itemprop="name">${product.name}</h3>
                <div itemprop="offers" itemscope itemtype="https://schema.org/Offer">
                    <meta itemprop="priceCurrency" content="KES">
                    <meta itemprop="price" content="${product.price}">
                    <meta itemprop="availability" content="https://schema.org/InStock">
                    <meta itemprop="itemCondition" content="https://schema.org/UsedCondition">
                    <meta itemprop="url" content="https://smattirestore.com/shop.html">
                    <p class="text-gold font-bold text-2xl">KES ${product.price.toLocaleString()}</p>
                </div>
                <button onclick="quickAddToCartById(${product.id}, event)" class="mt-4 w-full bg-gold text-dark py-2.5 rounded-full text-xs uppercase tracking-[0.12em] font-bold hover:bg-gold-light transition-colors">Quick Add to Cart</button>
            </div>
        </article>
    `;
}



/**
 * Builds a complete Product JSON-LD object for a single product.
 * Includes all Google Shopping-required fields: itemCondition, brand, sku,
 * seller, ImageObject, and potentialAction BuyAction.
 * @param {{id:number,name:string,image:string,category:string,desc:string,price:number,badge:string}} product
 * @returns {Object}
 */
function buildProductSchema(product) {
    const productUrl = `https://smattirestore.com/shop.html#product-${product.id}`;
    const imageUrl = `https://smattirestore.com/${product.image}`;
    return {
        '@context': 'https://schema.org',
        '@type': 'Product',
        '@id': productUrl,
        name: product.name,
        keywords: product.keywords || undefined,
        description: `${product.desc} Available at SM ATTIRE — brand-new stock in Nairobi, Kenya. M-Pesa checkout via WhatsApp.`,
        sku: `SM-${String(product.id).padStart(3, '0')}`,
        productID: `SM-${String(product.id).padStart(3, '0')}`,
        category: product.category,
        brand: {
            '@type': 'Brand',
            name: 'SM ATTIRE'
        },
        image: {
            '@type': 'ImageObject',
            '@id': imageUrl,
            contentUrl: imageUrl,
            url: imageUrl,
            name: productAltText(product),
            description: `${product.name} — ${product.category} available at SM ATTIRE Nairobi. KES ${product.price.toLocaleString()}.`,
            width: { '@type': 'QuantitativeValue', value: 800, unitCode: 'E37' },
            height: { '@type': 'QuantitativeValue', value: 1000, unitCode: 'E37' }
        },
        offers: {
            '@type': 'Offer',
            '@id': `${productUrl}#offer`,
            url: 'https://smattirestore.com/shop.html',
            priceCurrency: 'KES',
            price: product.price,
            priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            availability: 'https://schema.org/InStock',
            itemCondition: 'https://schema.org/UsedCondition',
            seller: {
                '@type': 'Organization',
                name: 'SM ATTIRE',
                url: 'https://smattirestore.com',
                telephone: '+254701226084',
                areaServed: 'Nairobi, Kenya'
            },
            shippingDetails: {
                '@type': 'OfferShippingDetails',
                shippingRate: {
                    '@type': 'MonetaryAmount',
                    value: 0,
                    currency: 'KES'
                },
                deliveryTime: {
                    '@type': 'ShippingDeliveryTime',
                    handlingTime: {
                        '@type': 'QuantitativeValue',
                        minValue: 0,
                        maxValue: 1,
                        unitCode: 'DAY'
                    },
                    transitTime: {
                        '@type': 'QuantitativeValue',
                        minValue: 0,
                        maxValue: 2,
                        unitCode: 'DAY'
                    }
                },
                shippingDestination: {
                    '@type': 'DefinedRegion',
                    addressCountry: 'KE',
                    addressRegion: 'Nairobi'
                }
            },
            hasMerchantReturnPolicy: {
                '@type': 'MerchantReturnPolicy',
                applicableCountry: 'KE',
                returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
                merchantReturnDays: 3,
                returnMethod: 'https://schema.org/ReturnByMail',
                returnFees: 'https://schema.org/FreeReturn'
            }
        },
        potentialAction: {
            '@type': 'BuyAction',
            target: {
                '@type': 'EntryPoint',
                urlTemplate: `https://wa.me/254701226084?text=${encodeURIComponent(`Hi, I want to order: ${product.name} (KES ${product.price.toLocaleString()})`)}`
            }
        }
    };
}

/**
 * Injects individual Product JSON-LD scripts for all products into the page.
 * Called once on DOMContentLoaded so Googlebot can index every product.
 */
function injectAllProductSchemas() {
    const container = document.getElementById('allProductsSchema');
    if (!container) return;
    const schemas = products.map(buildProductSchema);
    container.textContent = JSON.stringify(schemas.length === 1 ? schemas[0] : {
        '@context': 'https://schema.org',
        '@graph': schemas
    });
}

/**
 * Updates ItemList JSON-LD for currently rendered products to improve indexing of dynamic grids.
 * Also refreshes individual Product schemas for the visible subset.
 * @param {Array<{name:string,image:string,category:string,desc:string,price:number}>} list
 * @param {string} pageName
 */
function updateProductListSchema(list, pageName = 'Product Listing') {
    const schemaNode = document.getElementById('productListSchema');
    if (!schemaNode) return;

    const itemListElement = list.map((product, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: `https://smattirestore.com/shop.html#product-${product.id}`,
        item: buildProductSchema(product)
    }));

    const schema = {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: pageName,
        description: `${pageName} — Brand-new clothing from SM ATTIRE Nairobi`,
        numberOfItems: list.length,
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
    document.querySelectorAll('.floating-whatsapp-chat').forEach(button => {
        button.classList.toggle('hidden', isOpen);
        button.setAttribute('aria-hidden', isOpen ? 'true' : 'false');
    });
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

    if (modalImg) {
        modalImg.src = currentProduct.image;
        modalImg.alt = productAltText(currentProduct);
    }
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

    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
    const openWhatsAppFallback = () => {
        // Prefer a new tab to keep the cart page open; fall back to same-tab navigation if blocked
        const win = window.open(whatsappUrl, '_blank');
        if (!win) window.location.href = whatsappUrl;
    };
    const phoneInput = window.prompt('Enter your M-Pesa phone (07XXXXXXXX, 01XXXXXXXX, +2547XXXXXXXX, or +2541XXXXXXXX). Click Cancel to use WhatsApp instead.', '');
    if (!phoneInput) {
        openWhatsAppFallback();
        return;
    }

    const requestBody = {
        amount: total,
        phone: phoneInput,
        accountReference: '2048379985',
        transactionDesc: 'SM ATTIRE Order'
    };

    fetch('/.netlify/functions/daraja-stk-push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
    })
        .then(async response => {
            const data = await response.json().catch(() => ({}));
            if (!response.ok || !data.ok) {
                const reason = (data && (data.error || data.detail)) ? `${data.error || data.detail}` : 'Daraja request failed';
                const proceed = window.confirm(`${reason}. Open WhatsApp chat to finish the order?`);
                if (proceed) openWhatsAppFallback();
                return;
            }
            const customerMessage = data.customerMessage || 'Check your phone to complete M-Pesa payment.';
            const openChat = window.confirm(`${customerMessage} Open WhatsApp chat to confirm order details now?`);
            if (openChat) openWhatsAppFallback();
        })
        .catch(() => {
            const proceed = window.confirm('Unable to reach Daraja service right now. Open WhatsApp chat to finish the order?');
            if (proceed) openWhatsAppFallback();
        });
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
    const modal = document.getElementById('exitIntentModal');

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

function initializeNotificationPanel() {
    const toggle = document.getElementById('notificationToggle');
    const panel = document.getElementById('notificationPanel');
    const list = document.getElementById('notificationList');
    const badge = document.getElementById('notificationBadge');
    const closeBtn = document.getElementById('notificationClose');
    if (!toggle || !panel || !list || !badge || !closeBtn) return;

    const AUTO_CLOSE_MS = 5000;
    let autoCloseTimer = null;

    const render = () => {
        list.innerHTML = '';
        notificationFeed.forEach(item => {
            const li = document.createElement('li');
            li.className = 'glass-panel bg-dark/40 border border-gold/20 rounded-xl p-3';

            const title = document.createElement('p');
            title.className = 'text-white font-semibold mb-1';
            title.textContent = item.title;
            li.appendChild(title);

            const body = document.createElement('p');
            body.className = 'text-white/70 text-sm mb-2';
            body.textContent = item.body;
            li.appendChild(body);

            if (item.cta) {
                if (item.cta.href) {
                    const link = document.createElement('a');
                    link.href = item.cta.href;
                    link.className = 'inline-flex items-center gap-2 text-gold font-semibold hover:text-gold-light transition-colors text-sm';
                    link.textContent = `${item.cta.label} →`;
                    link.rel = 'noopener';
                    li.appendChild(link);
                } else {
                    const button = document.createElement('button');
                    button.dataset.action = item.cta.action;
                    button.className = 'inline-flex items-center gap-2 text-gold font-semibold hover:text-gold-light transition-colors text-sm';
                    button.textContent = `${item.cta.label} →`;
                    li.appendChild(button);
                }
            }

            list.appendChild(li);
        });
    };

    const setOpen = (isOpen) => {
        panel.hidden = !isOpen;
        toggle.setAttribute('aria-expanded', String(isOpen));
        if (autoCloseTimer) {
            clearTimeout(autoCloseTimer);
            autoCloseTimer = null;
        }
        if (isOpen) {
            badge.classList.add('hidden');
            autoCloseTimer = setTimeout(() => {
                panel.hidden = true;
                toggle.setAttribute('aria-expanded', 'false');
            }, AUTO_CLOSE_MS);
        }
    };

    list.addEventListener('click', (event) => {
        const actionBtn = event.target.closest('button[data-action]');
        if (!actionBtn) return;
        if (actionBtn.dataset.action === 'cart') {
            toggleCart();
        }
    });

    toggle.addEventListener('click', () => {
        const isOpen = panel.hidden;
        setOpen(isOpen);
    });
    closeBtn.addEventListener('click', () => setOpen(false));

    render();
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
        }
        return parsed.href;
    } catch (error) {
        return url;
    }
}


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
            renderSocialTrends();
            // Greet on first open
            if (seraChatHistory.length === 0) {
                setTimeout(() => renderSeraChatMessage('sera', getSeraWitty('greet')), 200);
            }
        }
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            panel.hidden = true;
            toggleBtn.setAttribute('aria-expanded', 'false');
            toggleBtn.focus();
        });
    }

    // Chat input enter key
    const chatInput = document.getElementById('seraChatInput');
    if (chatInput) {
        chatInput.addEventListener('keydown', event => {
            if (event.key === 'Enter') {
                event.preventDefault();
                submitSeraChat();
            }
        });
    }

    // Chat submit button
    const chatSubmit = document.getElementById('seraChatSubmit');
    if (chatSubmit) {
        chatSubmit.addEventListener('click', submitSeraChat);
    }

    // Voice search button
    const voiceBtn = document.getElementById('seraVoiceSearchBtn');
    if (voiceBtn) {
        voiceBtn.addEventListener('click', toggleSeraVoiceSearch);
    }
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
    const authModal = document.getElementById('cookieAuthModal');
    const confirmAuth = document.getElementById('confirmCookieAuth');
    const cancelAuth = document.getElementById('cancelCookieAuth');
    const authEmail = document.getElementById('cookieAuthEmail');
    let cookieModalTrigger = null;
    if (!banner || !accept || !decline) return;

    const dismissBanner = () => {
        banner.classList.add('hidden');
        banner.setAttribute('aria-hidden', 'true');
        banner.style.display = 'none';
    };

    const saved = localStorage.getItem(CONSENT_KEY);
    if (!saved) {
        banner.classList.remove('hidden');
        banner.style.display = '';
        banner.removeAttribute('aria-hidden');
    } else {
        dismissBanner();
    }

    const hideAuthModal = () => {
        if (!authModal) return;
        authModal.classList.add('hidden');
        authModal.classList.remove('flex');
        authModal.setAttribute('aria-hidden', 'true');
        if (cookieModalTrigger && typeof cookieModalTrigger.focus === 'function') {
            cookieModalTrigger.focus();
        }
    };

    const applyChoice = choice => {
        localStorage.setItem(CONSENT_KEY, choice);
        dismissBanner();
        hideAuthModal();
        if (choice === 'allow') {
            if (authEmail && authEmail.value) {
                localStorage.setItem('smattire_cookie_auth_email', authEmail.value.trim());
            }
        }
    };

    const showAuthModal = () => {
        if (!authModal) {
            applyChoice('allow');
            return;
        }
        cookieModalTrigger = document.activeElement instanceof HTMLElement ? document.activeElement : accept;
        authModal.classList.remove('hidden');
        authModal.classList.add('flex');
        authModal.removeAttribute('aria-hidden');
        const emailValue = localStorage.getItem('smattire_cookie_auth_email');
        if (authEmail && emailValue) authEmail.value = emailValue;
        if (authEmail) authEmail.focus();
    };

    accept.addEventListener('click', showAuthModal);
    decline.addEventListener('click', () => applyChoice('essential'));
    if (confirmAuth) confirmAuth.addEventListener('click', () => applyChoice('allow'));
    if (cancelAuth) cancelAuth.addEventListener('click', hideAuthModal);
    if (authModal) {
        const getFocusable = () => Array.from(authModal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'))
            .filter(node => !node.hasAttribute('disabled') && node.getAttribute('aria-hidden') !== 'true');
        authModal.addEventListener('click', event => {
            if (event.target === authModal) hideAuthModal();
        });
        document.addEventListener('keydown', event => {
            if (authModal.classList.contains('hidden')) return;
            if (event.key === 'Tab') {
                const focusable = getFocusable();
                if (!focusable.length) return;
                const first = focusable[0];
                const last = focusable[focusable.length - 1];
                const active = document.activeElement;
                if (event.shiftKey && active === first) {
                    event.preventDefault();
                    last.focus();
                } else if (!event.shiftKey && active === last) {
                    event.preventDefault();
                    first.focus();
                }
                return;
            }
            if (event.key === 'Escape') hideAuthModal();
        });
    }

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
    const productModal = document.getElementById('productModal');
    if (productModal && event.target === productModal) closeModal();
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
    injectAllProductSchemas();
    initializeCookieConsent();
    initializeNotificationPanel();
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
