document.addEventListener('DOMContentLoaded', () => {
    const customKnifeButton = document.getElementById('customKnifeButton');
    const customKnifeForm = document.getElementById('customKnifeForm');

    customKnifeButton.addEventListener('click', () => {
        customKnifeForm.classList.toggle('hidden');
    });

    const pond = FilePond.create(document.querySelector('.filepond'), {
        allowFileTypeValidation: true,
        acceptedFileTypes: ['image/*'],
        allowedFileTypes: ['image/*'],
        maxFileSize: '2MB',
    });

    setTimeout(() => {
        const input = document.querySelector('.filepond input');
        if (input) {
            input.setAttribute('accept', 'image/*');
        }
    }, 1000);

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

    function isLocalStorageOverflowed(limitMB = 5) {
        const totalSize = Object.keys(localStorage).reduce((total, key) => {
            const value = localStorage.getItem(key);
            return total + (value ? value.length : 0);
        }, 0);
        return (totalSize / (1024 * 1024)) > limitMB;
    }

    function isValidPhone(phone) {
        const phonePattern = /^\d{11}$/;
        return phonePattern.test(phone);
    }

    customKnifeForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const knifeType = document.getElementById('knifeType').value;
        const handleMaterial = document.getElementById('handleMaterial').value;
        const phone = document.getElementById('phone').value;

        if (!isValidPhone(phone)) {
            showNotification('Номер телефона должен содержать ровно 11 цифр!', true);
            return;
        }

        const files = pond.getFiles();
        let fileData = null;

        if (files.length > 0) {
            const file = files[0].file;

            if (!file.type.startsWith('image/')) {
                showNotification('Файл должен быть изображением!', true);
                return;
            }

            if (file.size > 2 * 1024 * 1024) {
                showNotification('Размер файла не должен превышать 2 МБ!', true);
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

        if (isLocalStorageOverflowed()) {
            showNotification('Недостаточно места для сохранения заказа. Очистите хранилище.', true);
            return;
        }

        try {
            let orders = JSON.parse(localStorage.getItem('customKnifeOrders')) || [];
            orders.push(orderData);
            localStorage.setItem('customKnifeOrders', JSON.stringify(orders));
            showNotification(`Ваш заказ #${orderData.orderNumber} сохранен.`);
        } catch (e) {
            if (e instanceof DOMException && e.name === 'QuotaExceededError') {
                showNotification('Переполнение хранилища. Очистите данные в браузере.', true);
            } else {
                console.error('Ошибка при записи в localStorage:', e);
            }
            return;
        }

        customKnifeForm.reset();
        pond.removeFiles();
        customKnifeForm.classList.add('hidden');
    });
});
