(function() {
    const currentPage = document.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('.header__nav a');

    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href').split('/').pop();

        if (linkPage === currentPage) {
            link.classList.add('active');
        }
    });
})();
