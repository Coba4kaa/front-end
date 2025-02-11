document.addEventListener('DOMContentLoaded', () => {
    const ordersContainer = document.getElementById('ordersContainer');

    const orders = JSON.parse(localStorage.getItem('customKnifeOrders')) || [];

    if (orders.length === 0) {
        const emptyMessage = document.createElement('p');
        emptyMessage.textContent = 'У вас пока нет заказов.';
        ordersContainer.appendChild(emptyMessage);
    } else {
        orders.forEach((order, index) => {
            const orderItem = document.createElement('li');
            orderItem.className = 'order-item';

            const orderNumber = document.createElement('p');
            orderNumber.textContent = `Заказ #${order.orderNumber}`;

            const knifeInfo = document.createElement('p');
            knifeInfo.textContent = `Тип ножа: ${order.knifeType}, Материал рукояти: ${order.handleMaterial}, Телефон: ${order.phone}`;

            const image = document.createElement('img');
            image.src = order.fileData || '';
            image.alt = 'Дизайн ножа';
            image.style.maxWidth = '200px';
            image.style.maxHeight = '200px';

            const cancelButton = document.createElement('button');
            cancelButton.textContent = 'Отменить заказ';
            cancelButton.className = 'cancel-button';
            cancelButton.addEventListener('click', () => cancelOrder(index));

            orderItem.appendChild(orderNumber);
            orderItem.appendChild(knifeInfo);
            if (order.fileData) {
                orderItem.appendChild(image);
            }
            orderItem.appendChild(cancelButton);
            ordersContainer.appendChild(orderItem);
        });
    }

    function cancelOrder(orderIndex) {
        const updatedOrders = [...orders];
        updatedOrders.splice(orderIndex, 1);

        localStorage.setItem('customKnifeOrders', JSON.stringify(updatedOrders));
        location.reload();
    }
});
