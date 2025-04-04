// Preserve existing functionality
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Enhanced Intersection Observer
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.animate-on-scroll').forEach(el => {
    observer.observe(el);
});

// Shopping Cart Functionality
const cart = {
    items: [],
    addItem: function(item) {
        const existingItem = this.items.find(i => i.id === item.id);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.items.push({...item, quantity: 1});
        }
        this.updateCart();
    },
    removeItem: function(id) {
        this.items = this.items.filter(item => item.id !== id);
        this.updateCart();
    },
    updateCart: function() {
        localStorage.setItem('devburgerCart', JSON.stringify(this.items));
        this.updateCartUI();
    },
    updateCartUI: function() {
        if (document.querySelector('.checkout-container')) {
            const cartList = document.querySelector('.list-group');
            const totalElement = document.querySelector('.mb-3 h4');
            
            if (cartList) {
                cartList.innerHTML = '';
                let total = 0;
                
                this.items.forEach(item => {
                    const itemTotal = item.price * item.quantity;
                    total += itemTotal;
                    
                    const li = document.createElement('li');
                    li.className = 'list-group-item d-flex justify-content-between align-items-center';
                    li.innerHTML = `
                        ${item.name} - Quantidade: ${item.quantity} - R$ ${itemTotal.toFixed(2)}
                        <button class="btn btn-sm btn-danger remove-item" data-id="${item.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    `;
                    cartList.appendChild(li);
                });
                
                if (totalElement) {
                    totalElement.textContent = `Total: R$ ${total.toFixed(2)}`;
                }
            }
        }
    },
    init: function() {
        const savedCart = localStorage.getItem('devburgerCart');
        if (savedCart) {
            this.items = JSON.parse(savedCart);
        }
        this.updateCartUI();
        
        // Handle remove item clicks
        document.addEventListener('click', (e) => {
            if (e.target.closest('.remove-item')) {
                const id = e.target.closest('.remove-item').dataset.id;
                this.removeItem(id);
            }
        });
    }
};

// Menu Item Click Handler
document.addEventListener('DOMContentLoaded', () => {
    cart.init();
    
    // Handle order buttons
    document.querySelectorAll('.btn-order').forEach(btn => {
        if (!btn.closest('.checkout-container')) {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const menuItem = btn.closest('.menu-item');
                if (menuItem) {
                    const item = {
                        id: menuItem.querySelector('h2').textContent.trim().toLowerCase().replace(/\s+/g, '-'),
                        name: menuItem.querySelector('h2').textContent.trim(),
                        price: 25.00, // Default price, should be set in data attribute
                        description: menuItem.querySelector('p').textContent.trim()
                    };
                    cart.addItem(item);
                    
                    // Show confirmation
                    const confirmation = document.createElement('div');
                    confirmation.className = 'alert alert-success position-fixed top-0 start-50 translate-middle-x mt-3';
                    confirmation.textContent = `${item.name} adicionado ao carrinho!`;
                    document.body.appendChild(confirmation);
                    
                    setTimeout(() => {
                        confirmation.remove();
                    }, 3000);
                }
            });
        }
    });
    
    // Form Validation
    const contactForm = document.querySelector('#contato form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let isValid = true;
            
            // Validate name
            const nameInput = document.getElementById('nome');
            if (!nameInput.value.trim()) {
                isValid = false;
                nameInput.classList.add('is-invalid');
            } else {
                nameInput.classList.remove('is-invalid');
            }
            
            // Validate phone
            const phoneInput = document.getElementById('telefone');
            const phoneRegex = /^\(\d{2}\) \d{5}-\d{4}$/;
            if (!phoneRegex.test(phoneInput.value)) {
                isValid = false;
                phoneInput.classList.add('is-invalid');
            } else {
                phoneInput.classList.remove('is-invalid');
            }
            
            // Validate email
            const emailInput = document.getElementById('email');
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailInput.value)) {
                isValid = false;
                emailInput.classList.add('is-invalid');
            } else {
                emailInput.classList.remove('is-invalid');
            }
            
            if (isValid) {
                // Form is valid - could send to server here
                alert('Formulário enviado com sucesso! Entraremos em contato em breve.');
                contactForm.reset();
            }
        });
    }
    
    // WhatsApp Button Enhancement
    const whatsappButton = document.querySelector('.whatsapp-button');
    if (whatsappButton) {
        whatsappButton.addEventListener('click', (e) => {
            if (cart.items.length > 0) {
                e.preventDefault();
                let message = 'Olá, gostaria de fazer um pedido:\n\n';
                let total = 0;
                
                cart.items.forEach(item => {
                    const itemTotal = item.price * item.quantity;
                    total += itemTotal;
                    message += `- ${item.name} (${item.quantity}x) - R$ ${itemTotal.toFixed(2)}\n`;
                });
                
                message += `\nTotal: R$ ${total.toFixed(2)}`;
                const encodedMessage = encodeURIComponent(message);
                window.open(`https://wa.me/11912757601?text=${encodedMessage}`, '_blank');
            }
        });
    }
});

// Menu Filtering
document.addEventListener('DOMContentLoaded', () => {
    const menuFilter = document.createElement('div');
    menuFilter.className = 'container mb-4 text-center';
    menuFilter.innerHTML = `
        <div class="btn-group" role="group">
            <button type="button" class="btn btn-outline-warning active" data-filter="all">Todos</button>
            <button type="button" class="btn btn-outline-warning" data-filter="burgers">Burgers</button>
            <button type="button" class="btn btn-outline-warning" data-filter="drinks">Bebidas</button>
            <button type="button" class="btn btn-outline-warning" data-filter="desserts">Sobremesas</button>
        </div>
    `;
    
    const menuContainer = document.querySelector('#menu');
    if (menuContainer) {
        menuContainer.insertAdjacentElement('afterend', menuFilter);
        
        menuFilter.querySelectorAll('button').forEach(btn => {
            btn.addEventListener('click', () => {
                menuFilter.querySelector('.active').classList.remove('active');
                btn.classList.add('active');
                
                const filter = btn.dataset.filter;
                document.querySelectorAll('.menu-item').forEach(item => {
                    if (filter === 'all' || item.closest(`#${filter}`)) {
                        item.style.display = '';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
    }
});

// Mobile touch optimization
if ('ontouchstart' in window) {
    document.documentElement.classList.add('touch-device');
    
    // Add touch feedback for buttons
    document.querySelectorAll('.btn, .nav-link, .menu-item').forEach(el => {
        el.addEventListener('touchstart', () => {
            el.style.transform = 'scale(0.95)';
            setTimeout(() => {
                el.style.transform = '';
            }, 200);
        });
    });
}

// Subtle hover effects for interactive elements
document.querySelectorAll('.nav-link, .menu-item, .btn').forEach(el => {
    el.addEventListener('mouseenter', () => {
        el.style.transition = 'all 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)';
    });
});
