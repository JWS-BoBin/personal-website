// readmore.js - Reusable Read More/Collapse functionality
class ReadMoreManager {
    constructor(options = {}) {
        this.defaultOptions = {
            maxHeight: 150,
            expandHeight: 2000,
            fadeHeight: 60,
            animationDuration: 500,
            buttonText: {
                more: 'Read More',
                less: 'Show Less'
            }
        };
        
        this.options = { ...this.defaultOptions, ...options };
        this.init();
    }
    
    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.setupSections();
            this.setupEventListeners();
        });
    }
    
    setupSections() {
        const sections = document.querySelectorAll('.read-more-section');
        
        sections.forEach(section => {
            const content = section.querySelector('.read-more-section > div:first-child');
            const contentHeight = content.scrollHeight;
            
            // Set initial max-height
            section.style.maxHeight = `${this.options.maxHeight}px`;
            
            // Create fade element if it doesn't exist
            if (!section.querySelector('.read-more-fade')) {
                const fade = document.createElement('div');
                fade.className = 'read-more-fade';
                fade.style.height = `${this.options.fadeHeight}px`;
                section.appendChild(fade);
            }
            
            // Find or create the button
            let button = section.nextElementSibling;
            if (!button || !button.classList.contains('read-more-btn')) {
                button = this.createButton(section.id);
                section.parentNode.insertBefore(button, section.nextSibling);
            }
            
            // Check if section needs read more functionality
            if (contentHeight <= this.options.maxHeight + 50) {
                button.style.display = 'none';
                section.style.maxHeight = 'none';
                section.querySelector('.read-more-fade').style.display = 'none';
            }
        });
    }
    
    createButton(targetId) {
        const button = document.createElement('button');
        button.className = 'read-more-btn';
        button.setAttribute('data-target', targetId);
        button.setAttribute('aria-expanded', 'false');
        button.setAttribute('role', 'button');
        button.setAttribute('tabindex', '0');
        
        const textSpan = document.createElement('span');
        textSpan.textContent = this.options.buttonText.more;
        
        const icon = document.createElement('i');
        icon.className = 'fas fa-chevron-down';
        
        button.appendChild(textSpan);
        button.appendChild(icon);
        
        return button;
    }
    
    setupEventListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('read-more-btn') || 
                e.target.closest('.read-more-btn')) {
                const button = e.target.classList.contains('read-more-btn') ? 
                    e.target : e.target.closest('.read-more-btn');
                this.toggleSection(button);
            }
        });
        
        // Keyboard support
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                const focused = document.activeElement;
                if (focused.classList.contains('read-more-btn')) {
                    e.preventDefault();
                    this.toggleSection(focused);
                }
            }
        });
    }
    
    toggleSection(button) {
        const targetId = button.getAttribute('data-target');
        const section = document.getElementById(targetId);
        const isExpanded = section.classList.contains('expanded');
        
        // Toggle classes
        section.classList.toggle('expanded');
        button.classList.toggle('expanded');
        
        // Update button text and aria
        const buttonText = button.querySelector('span');
        const icon = button.querySelector('i');
        
        if (isExpanded) {
            buttonText.textContent = this.options.buttonText.more;
            button.setAttribute('aria-expanded', 'false');
            section.style.maxHeight = `${this.options.maxHeight}px`;
        } else {
            buttonText.textContent = this.options.buttonText.less;
            button.setAttribute('aria-expanded', 'true');
            section.style.maxHeight = `${section.scrollHeight}px`;
            
            // After animation completes, set to auto for dynamic content
            setTimeout(() => {
                if (section.classList.contains('expanded')) {
                    section.style.maxHeight = 'none';
                }
            }, this.options.animationDuration);
        }
        
        // Smooth scroll if collapsing
        if (isExpanded) {
            const sectionTop = section.getBoundingClientRect().top + window.pageYOffset;
            window.scrollTo({
                top: sectionTop - 20,
                behavior: 'smooth'
            });
        }
    }
}

// Initialize automatically if script is included
if (typeof module !== 'object') {
    // Browser environment
    const readMoreManager = new ReadMoreManager();
}