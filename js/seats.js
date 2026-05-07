// СКРИПТ ДЛЯ ВЫБОРА МЕСТ
document.addEventListener('DOMContentLoaded', function() {
    
    // получение данных о выбраном спектакле
    const selectedShow = JSON.parse(localStorage.getItem('selectedShow'));
    
    if (!selectedShow) {
        alert('Пожалуйста, выберите спектакль');
        window.location.href = 'shows.html';
        return;
    }
    
    const showName = document.getElementById('showName');
    const showDate = document.getElementById('showDate');
    
    if (showName) showName.textContent = selectedShow.title;
    if (showDate) showDate.textContent = '2 июня 2026 г. 19:00';
    
    // генерация мест
    const seatsGrid = document.getElementById('seatsGrid');
    const seatsList = document.getElementById('seatsList');
    const seatsCount = document.getElementById('seatsCount');
    const totalPrice = document.getElementById('totalPrice');
    const addToCartBtn = document.getElementById('addToCartBtn');
    
    let selectedSeats = [];
    
    // создаём сетку мест (7 рядов по 20 мест)
    if (seatsGrid) {
        
        for (let row = 1; row <= 7; row++) {
            for (let seat = 1; seat <= 20; seat++) {
                const seatBtn = document.createElement('button');
                seatBtn.className = 'seat';
                seatBtn.textContent = seat;
                seatBtn.setAttribute('aria-label', `Ряд ${row}, место ${seat}`);
                
                let seatType = 'standard';
                let seatPrice = 30;
                
                if (row <= 3) {
                    seatType = 'vip';
                    seatPrice = 50;
                }
                else if (row <= 6) {
                    seatType = 'standard';
                    seatPrice = 30;
                }
                else {
                    seatType = 'balcony';
                    seatPrice = 15;
                }
                
                seatBtn.classList.add(seatType);
                seatBtn.dataset.price = seatPrice;
                seatBtn.dataset.row = row;
                seatBtn.dataset.seat = seat;
                
                // некоторые места заняты (случайно - 20% мест)
                if (Math.random() < 0.2) {
                    seatBtn.classList.add('occupied');
                    seatBtn.disabled = true;
                    seatBtn.setAttribute('aria-label', `Ряд ${row}, место ${seat} (занято)`);
                }
                
                seatBtn.addEventListener('click', function() {
                    if (seatBtn.classList.contains('occupied')) {
                        return;
                    }
                    
                    seatBtn.classList.toggle('selected');
                    
                    const seatInfo = {
                        row: row,
                        seat: seat,
                        price: seatPrice,
                        type: seatType
                    };
                    
                    if (seatBtn.classList.contains('selected')) {
                        selectedSeats.push(seatInfo);
                    } else {
                        selectedSeats = selectedSeats.filter(function(s) {
                            return s.row !== seatInfo.row || s.seat !== seatInfo.seat;
                        });
                    }
                    
                    updateOrderInfo();
                });
                
                seatsGrid.appendChild(seatBtn);
            }
        }
    }
    
    // обновление информации о заказе
    function updateOrderInfo() {
        if (!seatsList || !seatsCount || !totalPrice || !addToCartBtn) return;
        
        seatsList.innerHTML = '';
        
        let total = 0;
        
        selectedSeats.forEach(function(seat) {
            const li = document.createElement('li');
            li.textContent = `Ряд ${seat.row}, место ${seat.seat}`;
            
            const priceSpan = document.createElement('span');
            priceSpan.textContent = formatPrice(seat.price);
            
            li.appendChild(priceSpan);
            seatsList.appendChild(li);
            
            total += seat.price;
        });
        
        seatsCount.textContent = selectedSeats.length;
        totalPrice.textContent = formatPrice(total);
        
        addToCartBtn.disabled = selectedSeats.length === 0;
    }
    
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', function() {
            if (selectedSeats.length === 0) {
                alert('Выберите хотя бы одно место');
                return;
            }
            
            addToCart(
                selectedShow.id,
                selectedShow.title,
                selectedShow.price,
                selectedSeats
            );
            
            window.location.href = 'checkout.html';
        });
    }
});