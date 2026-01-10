// Navbar scroll effect
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
});

// Horizontal selector animation for navbar
function navbarAnimation() {
    const navbarSupportedContent = document.getElementById('navbarSupportedContent');
    if (!navbarSupportedContent) return;

    const activeItem = navbarSupportedContent.querySelector('.active') || navbarSupportedContent.querySelector('.nav-link:first-child');
    if (!activeItem) return;

    const activeItemLi = activeItem.querySelector('li');
    if (!activeItemLi) return;

    const activeWidth = activeItemLi.offsetHeight;
    const activeHeight = activeItemLi.offsetWidth;
    const itemPos = activeItemLi.getBoundingClientRect();
    const navbarRect = navbarSupportedContent.getBoundingClientRect();

    const horiSelector = document.querySelector('.hori-selector');
    if (horiSelector) {
        horiSelector.style.top = (itemPos.top - navbarRect.top) + 'px';
        horiSelector.style.left = (itemPos.left - navbarRect.left) + 'px';
        horiSelector.style.height = activeWidth + 'px';
        horiSelector.style.width = activeHeight + 'px';
    }
}

// Initialize navbar animation
document.addEventListener('DOMContentLoaded', function() {
    navbarAnimation();

    // Add click event listeners to nav links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            // Add active class to clicked link
            this.classList.add('active');
            // Update animation
            setTimeout(navbarAnimation, 100);
        });
    });
});

// Update animation on window resize
window.addEventListener('resize', function() {
    setTimeout(navbarAnimation, 500);
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.animate-charcter').forEach(el => {
    observer.observe(el);
});

// Card hover effects
document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px)';
    });

    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

// Button hover effects
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.05)';
    });

    btn.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
    });
});

// Mobile menu toggle
document.addEventListener('DOMContentLoaded', function() {
    const toggler = document.querySelector('.toggler');
    const navbarCollapse = document.getElementById('navbarSupportedContent');

    if (toggler && navbarCollapse) {
        toggler.addEventListener('click', function() {
            navbarCollapse.classList.toggle('show');
        });
    }
});

console.log('Great Step Flask App - Enhanced with navbar animations');