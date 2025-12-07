// js/include.js
document.addEventListener('DOMContentLoaded', function() {
    // Load navbar from multiple possible locations
    loadNavbar();
    
    // Load footer
    loadFooter();
});

function loadNavbar() {
    const possibleNavbarPaths = [
        '/navbar.html',
        'navbar.html',
        '../navbar.html',
        '/classactivities/navbar.html',
        'classactivities/navbar.html'
    ];
    
    function tryLoadNavbar(paths, index = 0) {
        if (index >= paths.length) {
            console.error('Could not find navbar at any location');
            return;
        }
        
        fetch(paths[index])
            .then(response => {
                if (!response.ok) {
                    throw new Error('Not found');
                }
                return response.text();
            })
            .then(data => {
                document.getElementById('navbar-container').innerHTML = data;
                
                // Re-initialize Bootstrap dropdowns
                var dropdownElementList = [].slice.call(document.querySelectorAll('.dropdown-toggle'))
                var dropdownList = dropdownElementList.map(function (dropdownToggleEl) {
                    return new bootstrap.Dropdown(dropdownToggleEl)
                });
                
                console.log('Navbar loaded from:', paths[index]);
                
                // Also initialize navbar toggle functionality
                initializeNavbar();
            })
            .catch(error => {
                console.log(`Trying next location... (failed: ${paths[index]})`);
                tryLoadNavbar(paths, index + 1);
            });
    }
    
    tryLoadNavbar(possibleNavbarPaths);
}

function loadFooter() {
    const possibleFooterPaths = [
        '/footer.html',
        'footer.html',
        '../footer.html',
        '/classactivities/footer.html',
        'classactivities/footer.html'
    ];
    
    function tryLoadFooter(paths, index = 0) {
        if (index >= paths.length) {
            console.error('Could not find footer at any location');
            return;
        }
        
        fetch(paths[index])
            .then(response => {
                if (!response.ok) {
                    throw new Error('Not found');
                }
                return response.text();
            })
            .then(data => {
                // Create or get footer container
                let footerContainer = document.getElementById('footer-container');
                if (!footerContainer) {
                    footerContainer = document.createElement('div');
                    footerContainer.id = 'footer-container';
                    document.body.appendChild(footerContainer);
                }
                footerContainer.innerHTML = data;
                
                // Set current year in footer
                setCurrentYear();
                
                console.log('Footer loaded from:', paths[index]);
            })
            .catch(error => {
                console.log(`Trying next location... (failed: ${paths[index]})`);
                tryLoadFooter(paths, index + 1);
            });
    }
    
    tryLoadFooter(possibleFooterPaths);
}

function initializeNavbar() {
    // Initialize navbar toggler for mobile view
    const navToggler = document.querySelector('.navbar-toggler');
    if (navToggler) {
        navToggler.addEventListener('click', function() {
            const target = this.getAttribute('data-bs-target');
            const navbarCollapse = document.querySelector(target);
            navbarCollapse.classList.toggle('show');
        });
    }
}

function setCurrentYear() {
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}