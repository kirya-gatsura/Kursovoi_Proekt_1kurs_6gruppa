// СКРИПТ ДЛЯ ОФОРМЛЕНИЯ ЗАКАЗА
document.addEventListener('DOMContentLoaded', function() {
    
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const orderItems = document.getElementById('orderItems');
    const totalPriceElement = document.getElementById('totalPrice');
    
    // отображаем товары в заказе
    if (orderItems && cart.length > 0) {
        let total = 0;
        
        cart.forEach(function(item) {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'order-item';
            
            let itemTotal = 0;
            let seatsCount = 0;
            
            if (item.seats && Array.isArray(item.seats)) {
                seatsCount = item.seats.length;
                item.seats.forEach(function(seat) {
                    const seatPrice = parseInt(seat.price) || 0;
                    itemTotal += seatPrice;
                });
            } else {
                seatsCount = 1;
                itemTotal = parseInt(item.price) || 0;
            }
            
            total += itemTotal;
            
            itemDiv.innerHTML = `
                <div>
                    <strong>${item.showName}</strong><br>
                    <small>${seatsCount} билета(ов)</small>
                </div>
                <div>${formatPrice(itemTotal)}</div>
            `;
            
            orderItems.appendChild(itemDiv);
        });
        
        if (totalPriceElement) {
            totalPriceElement.textContent = formatPrice(total);
        }
    } else if (orderItems) {
        orderItems.innerHTML = '<p>Корзина пуста</p>';
        if (totalPriceElement) {
            totalPriceElement.textContent = formatPrice(0);
        }
    }
    
    const checkoutForm = document.getElementById('checkoutForm');
    
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const fullName = document.getElementById('fullName').value.trim();
            const email = document.getElementById('email').value.trim();
            const phone = document.getElementById('phone').value.trim();
            
            clearErrors();
            
            let isValid = true;
            
            if (!fullName) {
                showError('fullName', 'Введите имя и фамилию');
                isValid = false;
            }
            
            if (!email || !isValidEmail(email)) {
                showError('email', 'Введите корректный email');
                isValid = false;
            }
            
            if (!phone || !isValidPhone(phone)) {
                showError('phone', 'Введите корректный телефон');
                isValid = false;
            }
            
            if (isValid) {
                const order = {
                    fullName: fullName,
                    email: email,
                    phone: phone,
                    cart: cart,
                    date: new Date().toLocaleString('ru-RU')
                };
                
                localStorage.setItem('lastOrder', JSON.stringify(order));
                
                localStorage.removeItem('cart');
                localStorage.removeItem('cartCount');
                
                if (typeof updateCartCount === 'function') {
                    updateCartCount();
                }
                
                alert('Заказ оформлен! Билеты отправлены на ' + email);
                
                window.location.href = 'index.html';
            }
        });
    }
    
    function showError(fieldId, message) {
        const input = document.getElementById(fieldId);
        const errorSpan = document.getElementById(fieldId + 'Error');
        
        if (input) {
            input.classList.add('error');
        }
        
        if (errorSpan) {
            errorSpan.textContent = message;
        }
    }
    
    function clearErrors() {
        const inputs = document.querySelectorAll('.form-input');
        const errors = document.querySelectorAll('.form-error');
        
        inputs.forEach(function(input) {
            input.classList.remove('error');
        });
        
        errors.forEach(function(error) {
            error.textContent = '';
        });
    }
    
    function formatPrice(price) {
        return new Intl.NumberFormat('ru-RU').format(price) + ' Byn';
    }
    
    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    function isValidPhone(phone) {
        const re = /^\+?[0-9\s]{10,15}$/;
        return re.test(phone);
    }
});