// ГЛАВНЫЙ СКРИПТ (общие функции) ========================
document.addEventListener('DOMContentLoaded', function() {   

    updateCartCount();
    
    // загрузка карточек
    const showsGrid = document.getElementById('showsGrid');
    if (showsGrid) {
        loadShows(showsGrid);
    }
});

// ФУНКЦИИ КОРЗИНЫ ========================
function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        const count = localStorage.getItem('cartCount') || 0;
        cartCount.textContent = count;
    }
}

function addToCart(showId, showName, price, seats) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    const order = {
        id: Date.now(),  // число милисекунд которое...
        showId: showId,
        showName: showName,
        price: price,
        seats: seats,
        date: new Date().toLocaleString('ru-RU') // ...превращается здесь в дату ("21.03.2026 13:27:44")
    };
    
    cart.push(order); // добавл.в конец массива
    
    localStorage.setItem('cart', JSON.stringify(cart));
    
    const newCount = (parseInt(localStorage.getItem('cartCount')) || 0) + seats.length;
    localStorage.setItem('cartCount', newCount);
    updateCartCount();
    
    alert('Билеты добавлены в корзину!');
}

function clearCart() {
    localStorage.removeItem('cart');
    localStorage.removeItem('cartCount');
    updateCartCount();
}

// ЗАГРУЗКА СПЕКТАКЛЕЙ (из XML) ========================
async function loadShows(container) { // асинхронные методы позволяют выполнять действия параллельно (не влияя на работу сайта) - длит.действ. без блокировки основного потока выполн.
    const response = await fetch('shows.xml'); // заставляет оставшиеся операции в функции ждать завершения async операции
    const xmlText = await response.text();
    const parser = new DOMParser(); // встроенный объект браузера для парсинга XML(HTML) строк в DOM-дерево
    const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
    const shows = xmlDoc.getElementsByTagName('show');
    
    container.innerHTML = ''; // чтобы при повторном вызове функции не дублировались карточки
    
    for (let i = 0; i < shows.length; i++) {
        const show = shows[i];
        
        const title = show.getElementsByTagName('title')[0].textContent;
        const genre = show.getElementsByTagName('genre')[0].textContent;
        const description = show.getElementsByTagName('description')[0].textContent;
        const duration = show.getElementsByTagName('duration')[0].textContent;
        const image = show.getElementsByTagName('image')[0].textContent;
        const id = show.getAttribute('id');
        
        const card = document.createElement('article');
        card.className = 'show-card';
        card.innerHTML = `
            <div class="show-card-image">
                <img src="${image}" alt="${title}">
                <span class="show-card-tag">${genre}</span>
            </div>
            <div class="show-card-content">
                <h3 class="show-card-title">${title}</h3>
                <p class="show-card-description">${description}</p>
                <div class="show-card-meta">
                    <i class="fas fa-clock"></i>
                    <span>${duration} мин</span>
                </div>
            </div>
        `;
        
        card.addEventListener('click', function() {
            localStorage.setItem('selectedShow', JSON.stringify({
                id: id,
                title: title
            }));
            window.location.href = 'seats.html';
        });
        
        container.appendChild(card);
    }
}

// ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ========================
function formatPrice(price) {
    return new Intl.NumberFormat('ru-RU').format(price) + ' Byn';
}