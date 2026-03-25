// Product Data - 20 Items
const products = [
    { id: 1, name: "Designer Cargo Set - Dior Tee", category: "Casual Streetwear", price: 4500, image: "1.jpg", badge: "Bestseller", desc: "Premium streetwear set featuring authentic Dior tee paired with tactical cargo pants. Perfect for urban fashion statements." },
    { id: 2, name: "Elegant Off-Shoulder Two-Piece", category: "Neatfit Collection", price: 3800, image: "2.jpg", badge: "New", desc: "Sophisticated off-shoulder top with matching skirt. Ideal for cocktail parties and evening events." },
    { id: 3, name: "Abstract Print Lounge Set", category: "Casual Streetwear", price: 3200, image: "3.jpg", badge: "", desc: "Comfortable yet stylish lounge set with contemporary abstract prints for the modern home." },
    { id: 4, name: "Premium Bodycon Collection", category: "Neatfit Collection", price: 2800, image: "4.jpg", badge: "Hot", desc: "Figure-hugging bodycon dress that accentuates your curves with premium stretch fabric." },
    { id: 5, name: "Embroidered Maxi Dress", category: "Neatfit Collection", price: 5500, image: "5.jpg", badge: "Luxury", desc: "Hand-embroidered maxi dress with intricate details. A showstopper for any formal occasion." },
    { id: 6, name: "Floral Milkmaid Dress", category: "Casual Streetwear", price: 2500, image: "6.jpg", badge: "", desc: "Romantic milkmaid-style dress with delicate floral patterns. Perfect for brunches and daytime events." },
    { id: 7, name: "Monochrome Abstract Gown", category: "Neatfit Collection", price: 6000, image: "7.jpg", badge: "Exclusive", desc: "Stunning monochrome gown featuring artistic abstract design. Limited edition piece." },
    { id: 8, name: "Street Style Bucket Hat Set", category: "Neatfit Collection", price: 4200, image: "8.jpg", badge: "", desc: "Complete street style set including designer bucket hat, coordinated top and bottoms." },
    { id: 9, name: "Tie-Dye Coord Set Collection", category: "Neatfit Collection", price: 3500, image: "9.jpg", badge: "Trending", desc: "Vibrant tie-dye coordinated set in premium cotton blend. Currently trending across Kenya." },
    { id: 10, name: "Athleisure Stussy Set", category: "Neatfit Collection", price: 4800, image: "10.jpg", badge: "", desc: "High-end athleisure set featuring Stussy branding. Gym-to-street versatility." },
    { id: 11, name: "Velvet Leopard Gown", category: "Neatfit Collection", price: 7500, image: "11.jpg", badge: "Premium", desc: "Opulent velvet gown with subtle leopard print. For those who dare to stand out." },
    { id: 12, name: "Executive Power Suit", category: "Neatfit Collection", price: 6800, image: "12.jpg", badge: "Professional", desc: "Sharp executive suit tailored for the modern businesswoman. Command the boardroom." },
    { id: 13, name: "Green Print Summer Dress", category: "Neatfit Collection", price: 2900, image: "13.jpg", badge: "", desc: "Breezy summer dress with tropical green prints. Perfect for coastal getaways." },
    { id: 14, name: "Alo Yoga Active Set", category: "Neatfit Collection", price: 4200, image: "14.jpg", badge: "", desc: "Premium yoga and fitness set by Alo. High-performance fabric with luxury feel." },
    { id: 15, name: "Graphic Tee Cargo Combo", category: "Casual Streetwear", price: 3800, image: "15.jpg", badge: "", desc: "Edgy graphic tee paired with utility cargo pants. Urban fashion at its finest." },
    { id: 16, name: "Satin Evening Collection", category: "Neatfit Collection", price: 5800, image: "16.jpg", badge: "Elegant", desc: "Luxurious satin evening wear that drapes beautifully. Timeless elegance." },
    { id: 17, name: "Traditional Print Maxi", category: "Neatfit Collection", price: 4500, image: "17.jpg", badge: "", desc: "Maxi dress featuring traditional African prints with modern silhouette." },
    { id: 18, name: "Artistic Brushstroke Set", category: "Casual Streetwear", price: 3400, image: "18.jpg", badge: "", desc: "Wearable art featuring bold brushstroke patterns. Unique and eye-catching." },
    { id: 19, name: "Neon Pink Street Set", category: "Casual Streetwear", price: 3200, image: "19.jpg", badge: "", desc: "Bold neon pink set for the fashion-forward. Make a statement wherever you go." },
    { id: 20, name: "Corporate Sheath Dress", category: "Neatfit Collection", price: 3600, image: "20.jpg", badge: "", desc: "Classic sheath dress for professional settings. Polished and sophisticated." }
];

// State
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let currentProduct = null;
const WHATSAPP_NUMBER = '254701226084';

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    updateCart();
    initNavbar();
    
    // Initialize shop page if product grid exists
    const productGrid = document.getElementById('productGrid');
    if (productGrid && typeof renderAllProducts === 'function') {
        applyHashFilter();
    }
    
    // Initialize featured products on homepage
    const featuredGrid = document.getElementById('featuredGrid');
    if (featuredGrid) {
        const featured = products.slice(0, 4);
        featuredGrid.innerHTML = featured.map(product => createProductCard(product)).join('');
    }
});

// Create Product Card HTML
function createProductCard(product) {
    return `
        <div class="product-card bg-charcoal/80 backdrop-blur-sm border border-gold/30 rounded-2xl overflow-hidden cursor-pointer group" onclick="openModal(${product.id})">
            <div class="relative h-72 overflow-hidden bg-gradient-to-br from-gold/10 to-dark">
                ${product.badge ? `<div class="absolute top-3 left-3 bg-gold text-dark px-3 py-1 text-xs font-bold uppercase tracking-wider rounded shadow-lg z-10">${product.badge}</div>` : ''}
                <img src="${product.image}" alt="${product.name}" loading="lazy" class="w-full h-full object-cover transition-all duration-500 group-hover:scale-110" onerror="this.onerror=null; this.src='https://via.placeholder.com/400x400/1a1a1a/d4af37?text=${product.id}';">
                <div class="absolute inset-0 bg-gradient-to-t from-dark/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div class="p-5">
                <div class="text-gold text-xs font-semibold uppercase tracking-widest mb-2">${product.category}</div>
                <h3 class="font-playfair text-white text-lg mb-3 leading-tight group-hover:text-gold transition-colors">${product.name}</h3>
                <div class="text-gold font-bold text-xl drop-shadow-[0_0_10px_rgba(212,175,55,0.3)]">KES ${product.price.toLocaleString()}</div>
            </div>
        </div>
    `;
}

// Modal Functions
function openModal(id) {
    currentProduct = products.find(p => p.id === id);
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
        modalImg.onerror = function() {
            this.onerror = null;
            this.src = `https://via.placeholder.com/400x400/1a1a1a/d4af37?text=${currentProduct.id}`;
        };
    }
    if (modalName) modalName.textContent = currentProduct.name;
    if (modalPrice) modalPrice.textContent = `KES ${currentProduct.price.toLocaleString()}`;
    if (modalDesc) modalDesc.textContent = currentProduct.desc;
    
    if (modalBadge) {
        if (currentProduct.badge) {
            modalBadge.textContent = currentProduct.badge;
            modalBadge.classList.remove('hidden');
        } else {
            modalBadge.classList.add('hidden');
        }
    }
    
    if (modalCategory) modalCategory.textContent = currentProduct.category;
    
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.getElementById('productModal');
    if (!modal) return;
    
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    document.body.style.overflow = 'auto';
    currentProduct = null;
}

function addFromModal() {
    if (currentProduct) {
        addToCart(currentProduct);
        closeModal();
        toggleCart();
    }
}

// Cart Functions
function addToCart(product) {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
        existing.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    saveCart();
    updateCart();
    animateCartButton();
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    saveCart();
    updateCart();
}

function updateQuantity(id, change) {
    const item = cart.find(item => item.id === id);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(id);
        } else {
            saveCart();
            updateCart();
        }
    }
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCart() {
    const cartItems = document.getElementById('cartItems');
    const cartCount = document.getElementById('cartCount');
    const cartTotal = document.getElementById('cartTotal');
    const checkoutBtn = document.getElementById('checkoutBtn');
    
    if (!cartItems) return;
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    if (cartCount) cartCount.textContent = count;
    if (cartTotal) cartTotal.textContent = `KES ${total.toLocaleString()}`;
    if (checkoutBtn) checkoutBtn.disabled = cart.length === 0;
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="text-white/50 text-center italic mt-8">Your cart is empty</p>';
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="flex gap-4 items-center bg-dark/50 border border-gold/20 p-4 rounded-xl hover:border-gold/50 transition-colors">
                <img src="${item.image}" alt="" class="w-16 h-16 object-cover rounded-lg border border-gold/50" loading="lazy" onerror="this.onerror=null; this.src='https://via.placeholder.com/64x64/1a1a1a/d4af37?text=${item.id}';">
                <div class="flex-1 min-w-0">
                    <h4 class="font-playfair text-white text-sm truncate">${item.name}</h4>
                    <p class="text-gold font-bold text-sm">KES ${item.price.toLocaleString()}</p>
                    <div class="flex items-center gap-3 mt-2">
                        <button onclick="updateQuantity(${item.id}, -1)" class="w-7 h-7 border border-gold text-gold rounded hover:bg-gold hover:text-dark transition-all text-sm font-bold">-</button>
                        <span class="text-white font-semibold w-4 text-center">${item.quantity}</span>
                        <button onclick="updateQuantity(${item.id}, 1)" class="w-7 h-7 border border-gold text-gold rounded hover:bg-gold hover:text-dark transition-all text-sm font-bold">+</button>
                    </div>
                </div>
                <button onclick="removeFromCart(${item.id})" class="text-red-500 hover:text-red-400 hover:scale-110 transition-all text-xl">🗑</button>
            </div>
        `).join('');
    }
}

function animateCartButton() {
    const btn = document.querySelector('nav button[onclick="toggleCart()"]');
    if (btn) {
        btn.style.transform = 'scale(1.2)';
        setTimeout(() => btn.style.transform = 'scale(1)', 200);
    }
}

function toggleCart() {
    const sidebar = document.getElementById('cartSidebar');
    if (sidebar) sidebar.classList.toggle('translate-x-full');
}

function toggleMobileMenu() {
    const menu = document.getElementById('mobileMenu');
    if (menu) menu.classList.toggle('hidden');
}

function checkout() {
    if (cart.length === 0) return;
    
    let message = `✨ SM ATTIRE - Order Request ✨%0A%0A`;
    let total = 0;
    
    cart.forEach(item => {
        const subtotal = item.price * item.quantity;
        total += subtotal;
        message += `• ${item.name}%0A  Qty: ${item.quantity} × KES ${item.price.toLocaleString()} = KES ${subtotal.toLocaleString()}%0A%0A`;
    });
    
    message += `━━━━━━━━━━━━━━━━━━━━━%0A`;
    message += `💰 TOTAL: KES ${total.toLocaleString()}%0A%0A`;
    message += `📍 Delivery Location: [Please fill in]%0A`;
    message += `💳 Payment: M-Pesa%0A%0A`;
    message += `Please confirm availability and provide payment details.`;
    
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank');
}

// Navbar Scroll Effect
function initNavbar() {
    const nav = document.getElementById('navbar');
    if (!nav) return;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;
        if (currentScroll > 50) {
            nav.classList.add('shadow-lg');
        } else {
            nav.classList.remove('shadow-lg');
        }
    }, { passive: true });
}

// Close modal on outside click
document.addEventListener('click', (e) => {
    const modal = document.getElementById('productModal');
    if (modal && e.target === modal) closeModal();
});

// Shop page functions
function renderAllProducts() {
    const grid = document.getElementById('productGrid');
    if (!grid) return;
    
    const filtered = currentFilter === 'all' 
        ? products 
        : products.filter(p => p.category === currentFilter);
    
    grid.innerHTML = filtered.map(product => createProductCard(product)).join('');
}

let currentFilter = 'all';

function filterProducts(category) {
    currentFilter = category;
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active', 'bg-gold', 'text-dark');
        if (btn.dataset.filter === category) {
            btn.classList.add('active', 'bg-gold', 'text-dark');
        }
    });
    renderAllProducts();
}

// Apply hash-based filter on shop page load
function applyHashFilter() {
    const hash = window.location.hash;
    if (hash === '#casual-streetwear') {
        filterProducts('Casual Streetwear');
    } else if (hash === '#neatfit-collection') {
        filterProducts('Neatfit Collection');
    } else {
        filterProducts('all');
    }
}
