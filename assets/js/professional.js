// Professional JavaScript for RoadSphere AI Government Website

// Initialize animations when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Initialize scroll animations
    initScrollAnimations();
    
    // Initialize any other professional features
    initProfessionalFeatures();
});

// Initialize scroll animations
function initScrollAnimations() {
    // Get all elements that should animate on scroll
    const animateElements = document.querySelectorAll('.animate-fade-in, .animate-fade-in-down, .animate-fade-in-up, .animate-slide-in-left, .animate-slide-in-right');
    
    // Create intersection observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add visible class when element is in viewport
                entry.target.classList.add('visible');
                
                // Unobserve to prevent re-triggering
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1, // Trigger when 10% of element is visible
        rootMargin: '0px 0px -50px 0px' // Trigger 50px before element enters viewport
    });
    
    // Observe each element
    animateElements.forEach(element => {
        observer.observe(element);
    });
}

// Initialize professional features
function initProfessionalFeatures() {
    // Add any additional professional features here
    console.log('Professional features initialized');
    
    // Initialize smooth scrolling for anchor links
    initSmoothScrolling();
    
    // Initialize mobile menu toggle
    initMobileMenu();
}

// Initialize smooth scrolling
function initSmoothScrolling() {
    // Get all anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    // Add click event to each anchor link
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Get target element
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            // If target element exists, scroll to it smoothly
            if (targetElement) {
                e.preventDefault();
                
                // Scroll to target element
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Initialize mobile menu
function initMobileMenu() {
    // Create mobile menu button
    const menuButton = document.createElement('button');
    menuButton.classList.add('mobile-menu-button');
    menuButton.innerHTML = '☰';
    menuButton.setAttribute('aria-label', 'Toggle navigation menu');
    
    // Add menu button to header
    const header = document.querySelector('.header-container');
    if (header) {
        header.appendChild(menuButton);
        
        // Get navigation element
        const nav = document.querySelector('.gov-nav');
        
        // Add click event to menu button
        menuButton.addEventListener('click', function() {
            nav.classList.toggle('mobile-open');
        });
    }
}

// Function to show notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.classList.add('notification', type);
    notification.textContent = message;
    
    // Add close button
    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '&times;';
    closeBtn.classList.add('notification-close');
    closeBtn.addEventListener('click', function() {
        notification.remove();
    });
    
    notification.appendChild(closeBtn);
    
    // Add to body
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

// Function to validate form
function validateForm(formId) {
    const form = document.getElementById(formId);
    if (!form) return false;
    
    let isValid = true;
    
    // Get all required fields
    const requiredFields = form.querySelectorAll('[required]');
    
    // Check each required field
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            isValid = false;
            field.classList.add('error');
            
            // Create error message
            const errorMsg = document.createElement('div');
            errorMsg.classList.add('error-message');
            errorMsg.textContent = 'This field is required';
            field.parentNode.appendChild(errorMsg);
        } else {
            field.classList.remove('error');
            // Remove existing error message
            const existingError = field.parentNode.querySelector('.error-message');
            if (existingError) {
                existingError.remove();
            }
        }
    });
    
    return isValid;
}

// Export functions for use in other modules
window.RoadSphereProfessional = {
    showNotification,
    validateForm
};