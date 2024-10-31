(function() {
    const currentPage = document.location.href;
    const navLinks = document.querySelectorAll('.header__nav a');

    navLinks.forEach(link => {
        const linkPage = link.href;

        if (linkPage === currentPage) {
            link.classList.add('active');
        }
    });
})();
