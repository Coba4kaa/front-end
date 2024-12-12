document.addEventListener('DOMContentLoaded', () => {
    const customKnifeButton = document.getElementById('customKnifeButton');
    const customKnifeForm = document.getElementById('customKnifeForm');

    customKnifeButton.addEventListener('click', () => {
        customKnifeForm.classList.toggle('hidden');
    });

    const pond = FilePond.create(document.querySelector('.filepond'));

    function fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }

    function generateOrderNumber() {
        const orders = JSON.parse(localStorage.getItem('customKnifeOrders')) || [];
        return orders.length ? Math.max(...orders.map(order => order.orderNumber || 0)) + 1 : 1;
    }

    function showNotification(message, isError = false) {
        const notification = document.getElementById('notification');
        notification.textContent = message;
        notification.classList.toggle('error', isError);
        notification.classList.add('show');
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }

    customKnifeForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const knifeType = document.getElementById('knifeType').value;
        const handleMaterial = document.getElementById('handleMaterial').value;
        const phone = document.getElementById('phone').value;

        const files = pond.getFiles();
        let fileData = null;

        if (files.length > 0) {
            const file = files[0].file;

            if (!file.type.startsWith('image/')) {
                showNotification('Файл должен быть изображением!', true);
                return;
            }

            try {
                fileData = await fileToBase64(file);
            } catch (error) {
                showNotification('Ошибка при загрузке файла', true);
                return;
            }
        }

        const orderData = {
            orderNumber: generateOrderNumber(),
            knifeType,
            handleMaterial,
            phone,
            fileData
        };

        let orders = JSON.parse(localStorage.getItem('customKnifeOrders')) || [];
        orders.push(orderData);
        localStorage.setItem('customKnifeOrders', JSON.stringify(orders));

        showNotification(`Ваш заказ #${orderData.orderNumber} сохранен.`);

        customKnifeForm.reset();
        pond.removeFiles();
        customKnifeForm.classList.add('hidden');
    });
});