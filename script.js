// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components in order of appearance
    initializeHeader();
    initializeHero();
    initializeNewReleases();
    initializeSpecialOffers();
    initializeMagazineSlider();
    initializeFeaturedBooks();
    initializeMainFooter();
    initializeCopyrightFooter();
});

// Cart functionality
function initializeCart() {
    let cartCount = 0;
    const cartBtn = document.querySelector('.cart-btn');
    const bookItems = document.querySelectorAll('.book-item, .book-card');

    // Initialize cart from localStorage if it exists
    if (localStorage.getItem('cartCount')) {
        cartCount = parseInt(localStorage.getItem('cartCount'));
        updateCartDisplay();
    }

    // Add click handlers to all book items
    bookItems.forEach(item => {
        item.addEventListener('click', function(e) {
            // Prevent adding to cart if clicking on the badge
            if (!e.target.classList.contains('badge') && !e.target.classList.contains('sale-badge')) {
                addToCart(this);
            }
        });
    });

    function addToCart(bookItem) {
        // Get book details
        const title = bookItem.querySelector('h3').textContent;
        const price = bookItem.querySelector('.price, .sale-price')?.textContent || '$0.00';
        
        // Create notification
        showNotification(`${title} added to cart!`);

        // Update cart count
        cartCount++;
        updateCartDisplay();
        localStorage.setItem('cartCount', cartCount);

        // Animate cart button
        cartBtn.classList.add('cart-bump');
        setTimeout(() => cartBtn.classList.remove('cart-bump'), 300);
    }

    function updateCartDisplay() {
        cartBtn.textContent = `Cart (${cartCount})`;
    }
}

// Magazine slider functionality
function initializeSlider() {
    const slider = document.querySelector('.magazine-slider');
    const prevBtn = slider.querySelector('.prev');
    const nextBtn = slider.querySelector('.next');
    let currentSlide = 0;
    const slides = [
        {
            image: 'assets/360-magazine.jpg',
            title: '360° Magazine',
            details: 'Mount Etna Special Edition'
        },
        // Add more slides as needed
    ];

    prevBtn.addEventListener('click', () => {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        updateSlide();
    });

    nextBtn.addEventListener('click', () => {
        currentSlide = (currentSlide + 1) % slides.length;
        updateSlide();
    });

    function updateSlide() {
        const slide = slides[currentSlide];
        const img = slider.querySelector('.magazine-cover');
        const title = slider.querySelector('h3');
        const details = slider.querySelector('.issue-details');

        // Add fade out animation
        img.style.opacity = '0';
        setTimeout(() => {
            img.src = slide.image;
            title.textContent = slide.title;
            details.textContent = slide.details;
            img.style.opacity = '1';
        }, 300);
    }
}

// Book cards hover effects
function initializeBookCards() {
    const bookCards = document.querySelectorAll('.book-card, .book-item');

    bookCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const cover = this.querySelector('.book-cover');
            cover.style.transform = 'scale(1.05) rotate(2deg)';
        });

        card.addEventListener('mouseleave', function() {
            const cover = this.querySelector('.book-cover');
            cover.style.transform = 'scale(1) rotate(0deg)';
        });
    });
}

// Navigation functionality
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-links a');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Smooth scroll to section
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Wishlist functionality
function initializeWishlist() {
    const wishlistBtn = document.querySelector('.wishlist-btn');
    const wishlistCount = wishlistBtn.querySelector('.wishlist-count');
    let wishlistItems = JSON.parse(localStorage.getItem('wishlistItems')) || [];

    // Initialize wishlist count
    updateWishlistCount();

    // Add click handler for wishlist button
    wishlistBtn.addEventListener('click', function(e) {
        e.preventDefault();
        this.classList.toggle('active');
        
        if (this.classList.contains('active')) {
            // Add animation class
            this.querySelector('.heart-icon').classList.add('pulse');
            showNotification('Item added to wishlist!', 'success');
            wishlistItems.push({ id: Date.now() }); // Add item with unique ID
        } else {
            this.querySelector('.heart-icon').classList.remove('pulse');
            showNotification('Item removed from wishlist!', 'info');
            wishlistItems.pop(); // Remove last item
        }

        // Update localStorage and count
        localStorage.setItem('wishlistItems', JSON.stringify(wishlistItems));
        updateWishlistCount();
    });

    function updateWishlistCount() {
        wishlistCount.textContent = wishlistItems.length;
        wishlistBtn.dataset.count = wishlistItems.length;
        
        // Toggle visibility of count
        if (wishlistItems.length > 0) {
            wishlistCount.style.display = 'flex';
        } else {
            wishlistCount.style.display = 'none';
        }
    }

    // Add animation keyframes
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.2); }
            100% { transform: scale(1); }
        }

        .heart-icon.pulse {
            animation: pulse 0.3s ease-out;
        }
    `;
    document.head.appendChild(style);
}

// Newsletter functionality
function initializeNewsletter() {
    const form = document.getElementById('newsletter-form');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = this.querySelector('#email').value;
        const subscribeChecked = this.querySelector('#subscribe').checked;
        
        if (email && subscribeChecked) {
            // Here you would typically send this to your backend
            console.log('Newsletter subscription:', { email });
            
            // Show success notification
            showNotification('Thanks for subscribing to our newsletter!');
            
            // Reset form
            this.reset();
        }
    });
}

// Utility function for notifications
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'add-to-cart-notification';
    notification.textContent = message;
    
    // Style the notification
    Object.assign(notification.style, {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        backgroundColor: '#000',
        color: '#fff',
        padding: '1rem 2rem',
        borderRadius: '5px',
        zIndex: '1000',
        animation: 'slideIn 0.3s ease-out'
    });

    document.body.appendChild(notification);

    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add required CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }

    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }

    .cart-bump {
        animation: bump 0.3s ease-out;
    }

    @keyframes bump {
        0% { transform: scale(1); }
        50% { transform: scale(1.2); }
        100% { transform: scale(1); }
    }
`;
document.head.appendChild(style);

// Add this to your initialization functions
function initializeCopyrightFooter() {
    const footerLogo = document.querySelector('.footer-logo');
    
    // Add hover animation
    footerLogo.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.1)';
        this.style.transition = 'transform 0.3s ease';
    });
    
    footerLogo.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
    });
}

// Organize your existing functions into logical groups
// Header Components
function initializeHeader() {
    initializeNavigation();
    initializeCart();
    initializeWishlist();
}

// Content Components
function initializeHero() {
    // Your hero section initialization code
}

function initializeNewReleases() {
    initializeBookCards('.new-releases .book-card');
}

function initializeSpecialOffers() {
    // Special offers initialization if needed
}

function initializeMagazineSlider() {
    // Your existing slider code
}

function initializeFeaturedBooks() {
    initializeBookCards('.featured-books .book-item');
}

// Footer Components
function initializeMainFooter() {
    initializeNewsletter();
}

// Utility Functions
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Style the notification
    Object.assign(notification.style, {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        backgroundColor: type === 'success' ? '#000' : '#ff0000',
        color: '#fff',
        padding: '1rem 2rem',
        borderRadius: '5px',
        zIndex: '1000',
        animation: 'slideIn 0.3s ease-out'
    });

    document.body.appendChild(notification);

    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Animation Styles
const animationStyles = document.createElement('style');
animationStyles.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }

    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }

    @keyframes bump {
        0% { transform: scale(1); }
        50% { transform: scale(1.2); }
        100% { transform: scale(1); }
    }

    .notification {
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .cart-bump {
        animation: bump 0.3s ease-out;
    }
`;
document.head.appendChild(animationStyles);
