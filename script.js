// Product Data
const products = [
    { id: 1, name: "Designer Cargo Set - Dior Tee", category: "Streetwear", price: 4500, image: "1.jpg", badge: "Bestseller", desc: "Premium streetwear set featuring authentic Dior tee paired with tactical cargo pants. Perfect for urban fashion statements." },
    { id: 2, name: "Elegant Off-Shoulder Two-Piece", category: "Formal Sets", price: 3800, image: "2.jpg", badge: "New", desc: "Sophisticated off-shoulder top with matching skirt. Ideal for cocktail parties and evening events." },
    { id: 3, name: "Abstract Print Lounge Set", category: "Loungewear", price: 3200, image: "3.jpg", badge: "", desc: "Comfortable yet stylish lounge set with contemporary abstract prints for the modern home." },
    { id: 4, name: "Premium Bodycon Collection", category: "Dresses", price: 2800, image: "4.jpg", badge: "Hot", desc: "Figure-hugging bodycon dress that accentuates your curves with premium stretch fabric." },
    { id: 5, name: "Embroidered Maxi Dress", category: "Evening Wear", price: 5500, image: "5.jpg", badge: "Luxury", desc: "Hand-embroidered maxi dress with intricate details. A showstopper for any formal occasion." },
    { id: 6, name: "Floral Milkmaid Dress", category: "Casual", price: 2500, image: "6.jpg", badge: "", desc: "Romantic milkmaid-style dress with delicate floral patterns. Perfect for brunches and daytime events." },
    { id: 7, name: "Monochrome Abstract Gown", category: "Evening", price: 6000, image: "7.jpg", badge: "Exclusive", desc: "Stunning monochrome gown featuring artistic abstract design. Limited edition piece." },
    { id: 8, name: "Street Style Bucket Hat Set", category: "Streetwear", price: 4200, image: "8.jpg", badge: "", desc: "Complete street style set including designer bucket hat, coordinated top and bottoms." },
    { id: 9, name: "Tie-Dye Coord Set Collection", category: "Trending", price: 3500, image: "9.jpg", badge: "Trending", desc: "Vibrant tie-dye coordinated set in premium cotton blend. Currently trending across Kenya." },
    { id: 10, name: "Athleisure Stussy Set", category: "Activewear", price: 4800, image: "10.jpg", badge: "", desc: "High-end athleisure set featuring Stussy branding. Gym-to-street versatility." },
    { id: 11, name: "Velvet Leopard Gown", category: "Luxury", price: 7500, image: "11.jpg", badge: "Premium", desc: "Opulent velvet gown with subtle leopard print. For those who dare to stand out." },
    { id: 12, name: "Executive Power Suit", category: "Business", price: 6800, image: "12.jpg", badge: "Professional", desc: "Sharp executive suit tailored for the modern businesswoman. Command the boardroom." },
    { id: 13, name: "Green Print Summer Dress", category: "Casual", price: 2900, image: "13.jpg", badge: "", desc: "Breezy summer dress with tropical green prints. Perfect for coastal getaways." },
    { id: 14, name: "Alo Yoga Active Set", category: "Fitness", price: 4200, image: "14.jpg", badge: "", desc: "Premium yoga and fitness set by Alo. High-performance fabric with luxury feel." },
    { id: 15, name: "Graphic Tee Cargo Combo", category: "Streetwear", price: 3800, image: "15.jpg", badge: "", desc: "Edgy graphic tee paired with utility cargo pants. Urban fashion at its finest." },
    { id: 16, name: "Satin Evening Collection", category: "Formal", price: 5800, image: "16.jpg", badge: "Elegant", desc: "Luxurious satin evening wear that drapes beautifully. Timeless elegance." },
    { id: 17, name: "Traditional Print Maxi", category: "Cultural", price: 4500, image: "17.jpg", badge: "", desc: "Maxi dress featuring traditional African prints with modern silhouette." },
    { id: 18, name: "Artistic Brushstroke Set", category: "Casual", price: 3400, image: "18.jpg", badge: "", desc: "Wearable art featuring bold brushstroke patterns. Unique and eye-catching." },
    { id: 19, name: "Neon Pink Street Set", category: "Urban", price: 3200, image: "19.jpg", badge: "", desc: "Bold neon pink set for the fashion-forward. Make a statement wherever you go." },
    { id: 20, name: "Corporate Sheath Dress", category: "Office", price: 3600, image: "20.jpg", badge: "", desc: "Classic sheath dress for professional settings. Polished and sophisticated." }
];

// State
let cart = [];
let currentModalProduct = null;
const WHATSAPP_NUMBER = '254111636725';

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    
    // Hide loader after 1.5s
    setTimeout(() => {
        const loader = document.getElementById('loader');
        loader.classList.add('opacity-0', 'pointer-events-none');
    }, 1500);

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        const nav = document.getElementById('navbar');
        if (window.scrollY > 50) {
            nav.classList.add('bg-dark/98', 'shadow-[0_5px_30px_rgba(0,0,0,0.5)]');
            nav.classList.remove('bg-dark/90');
        } else {
            nav.classList.remove('bg-dark/98', 'shadow-[0_5px_30px_rgba(0,0,0,0.5)]');
            nav.classList.add('bg-dark/90');
        }
    });

    // Close cart when clicking outside
    document.addEventListener('click', (e) => {
        const cartContainer = document.getElementById('cartContainer');
        const cartToggle = document.querySelector('.fixed.bottom-4');
        const cartIcon = document.querySelector('nav button[onclick="toggleCart()"]');
        
        if (cartContainer.classList.contains('translate-x-0') && 
            !cartContainer.contains(e.target) && 
            !cartToggle.contains(e.target) &&
            !cartIcon.contains(e.target)) {
            toggleCart();
        }
    });

    // Close modal on outside click
    document.getElementById('productModal').addEventListener('click', (e) => {
        if (e.target === e.currentTarget) closeModal();
    });
});

// Render Products
function renderProducts() {
    const grid = document.getElementById('productGrid');
    
    grid.innerHTML = products.map(product => `
        <div class="product-card bg-charcoal/90 border border-gold/30 rounded-2xl overflow-hidden backdrop-blur-sm group cursor-pointer" onclick="showProductModal(${product.id})">
            <div class="relative h-64 overflow-hidden bg-gradient-to-br from-gold/10 to-black/30">
                ${product.badge ? `<div class="absolute top-3 left-3 bg-gold text-dark px-3 py-1 text-xs font-bold uppercase tracking-wider rounded shadow-lg z-10">${product.badge}</div>` : ''}
                <img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:brightness-110" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22400%22><rect width=%22400%22 height=%22400%22 fill=%22%231a1a1a%22/><text x=%2250%%22 y=%2250%%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22%23d4af37%22 font-family=%22serif%22 font-size=%2224%22>${product.id}</text></svg>'">
            </div>
            <div class="p-5">
                <div class="text-gold text-xs font-semibold uppercase tracking-widest mb-2">${product.category}</div>
                <h3 class="font-playfair text-lg text-white mb-2 leading-tight">${product.name}</h3>
                <div class="text-gold text-xl font-bold mb-4 drop-shadow-[0_0_10px_rgba(212,175,55,0.3)]">KES ${product.price.toLocaleString()}</div>
                <button class="w-full py-3 border-2 border-gold text-gold font-semibold uppercase tracking-wider text-sm hover:bg-gold hover:text-dark transition-all duration-300 rounded-lg relative overflow-hidden group/btn">
                    <span class="relative z-10">View Details</span>
                </button>
            </div>
        </div>
    `).join('');
}

// Modal Functions
function showProductModal(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    currentModalProduct = product;

    document.getElementById('modalProductImage').src = product.image;
    document.getElementById('modalProductName').textContent = product.name;
    document.getElementById('modalProductPrice').textContent = `KES ${product.price.toLocaleString()}`;
    document.getElementById('modalProductDesc').textContent = product.desc;

    const modal = document.getElementById('productModal');
    modal.classList.remove('hidden');
    // Trigger reflow
    void modal.offsetWidth;
    modal.classList.add('flex', 'opacity-100');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.getElementById('productModal');
    modal.classList.remove('opacity-100');
    setTimeout(() => {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        document.body.style.overflow = 'auto';
        currentModalProduct = null;
    }, 400);
}

function addToCartFromModal() {
    if (currentModalProduct) {
        addToCart(currentModalProduct);
        closeModal();
        toggleCart();
    }
}

// Cart Functions
function addToCart(product) {
    const existingItem = cart.find(item => item.id === product.id);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    updateCart();
    animateCartButton();
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
}

function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCart();
        }
    }
}

function updateCart() {
    const cartItems = document.getElementById('cartItems');
    const cartCount = document.getElementById('cartCount');
    const cartToggleCount = document.getElementById('cartToggleCount');
    const cartTotal = document.getElementById('cartTotal');
    const checkoutBtn = document.getElementById('checkoutBtn');

    let total = 0;
    let count = 0;

    cart.forEach(item => {
        total += item.price * item.quantity;
        count += item.quantity;
    });

    cartCount.textContent = count;
    cartToggleCount.textContent = count;
    cartTotal.textContent = `KES ${total.toLocaleString()}`;
    checkoutBtn.disabled = cart.length === 0;

    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="text-center text-white/50 mt-12 italic">Your cart is empty</p>';
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="flex gap-4 items-center bg-white/5 border border-gold/30 rounded-xl p-4 hover:border-gold hover:shadow-[0_0_20px_rgba(212,175,55,0.1)] transition-all duration-300">
                <img src="${item.image}" alt="${item.name}" class="w-16 h-16 object-cover rounded-lg border-2 border-gold" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2264%22 height=%2264%22><rect width=%2264%22 height=%2264%22 fill=%22%231a1a1a%22/><text x=%2250%%22 y=%2250%%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22%23d4af37%22 font-size=%2220%22>${item.id}</text></svg>'">
                <div class="flex-1 min-w-0">
                    <div class="font-playfair text-white truncate">${item.name}</div>
                    <div class="text-gold font-semibold">KES ${item.price.toLocaleString()}</div>
                    <div class="flex items-center gap-2 mt-1">
                        <button onclick="updateQuantity(${item.id}, -1)" class="w-7 h-7 border border-gold text-gold rounded hover:bg-gold hover:text-dark transition-colors text-sm font-bold">-</button>
                        <span class="text-white w-6 text-center">${item.quantity}</span>
                        <button onclick="updateQuantity(${item.id}, 1)" class="w-7 h-7 border border-gold text-gold rounded hover:bg-gold hover:text-dark transition-colors text-sm font-bold">+</button>
                    </div>
                </div>
                <button onclick="removeFromCart(${item.id})" class="text-white/50 hover:text-red-500 transition-colors text-xl">🗑</button>
            </div>
        `).join('');
    }
}

function animateCartButton() {
    const btn = document.querySelector('.fixed.bottom-4');
    btn.style.transform = 'scale(1.2)';
    setTimeout(() => {
        btn.style.transform = 'scale(1)';
    }, 200);
}

function toggleCart() {
    const cart = document.getElementById('cartContainer');
    cart.classList.toggle('translate-x-full');
    cart.classList.toggle('translate-x-0');
}

function toggleMobileMenu() {
    const menu = document.getElementById('mobileMenu');
    menu.classList.toggle('hidden');
    menu.classList.toggle('flex');
}

// Checkout
function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty! Add some luxury pieces first.');
        return;
    }

    let message = '👑 THE REALONES STORE - Order Request 👑%0A%0A';
    message += '━━━━━━━━━━━━━━━━━━━━━%0A%0A';
    message += '🛍️ My Selection:%0A%0A';

    let total = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        message += `• ${item.name}%0A`;
        message += `  Quantity: ${item.quantity}%0A`;
        message += `  Price: KES ${item.price.toLocaleString()} each%0A`;
        message += `  Subtotal: KES ${itemTotal.toLocaleString()}%0A%0A`;
    });

    message += '━━━━━━━━━━━━━━━━━━━━━%0A%0A';
    message += `💰 TOTAL: KES ${total.toLocaleString()}%0A%0A`;
    message += '📍 Delivery Location: [Please fill in]%0A';
    message += '💳 Payment: M-Pesa%0A%0A';
    message += 'Please confirm availability and provide payment details.';

    const whatsappURL = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
    
    const btn = document.getElementById('checkoutBtn');
    const originalText = btn.textContent;
    btn.textContent = 'Connecting...';
    btn.classList.add('bg-gradient-to-r', 'from-gold', 'via-gold-light', 'to-gold', 'text-dark');
    
    setTimeout(() => {
        window.open(whatsappURL, '_blank');
        btn.textContent = originalText;
        btn.classList.remove('bg-gradient-to-r', 'from-gold', 'via-gold-light', 'to-gold', 'text-dark');
    }, 1000);
}

