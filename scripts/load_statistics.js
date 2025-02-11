(function () {
    function logLoadTime() {
        const loadTime = performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart;
        const footer = document.querySelector('.footer');
        const loadTimeMessage = document.createElement('p');

        loadTimeMessage.textContent = `Время загрузки страницы: ${loadTime} мс`;
        footer.appendChild(loadTimeMessage);
    }

    window.addEventListener('load', logLoadTime);
})();
