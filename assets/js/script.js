// ==================== ДАННЫЕ КНИГ ====================
// Массив с информацией о всех книгах
const booksData = [
    { id: 1, title: "Мастер и Маргарита", author: "Михаил Булгаков", genre: "художественная", price: 650, isNew: true, isRecommended: true, image: "assets/img/books/master.webp", description: "Знаменитый роман о любви, дьяволе и Москве 1930-х." },
    { id: 2, title: "Математика. 5 класс", author: "Виленкин Н.Я.", genre: "учебная", price: 890, isNew: false, isRecommended: false, image: "assets/img/books/matesha.webp", description: "Учебник для общеобразовательных учреждений." },
    { id: 3, title: "Война и мир", author: "Лев Толстой", genre: "классическая", price: 1200, isNew: false, isRecommended: true, image: "assets/img/books/voda.webp", description: "Эпопея о судьбах России в эпоху Наполеоновских войн." },
    { id: 4, title: "Колобок", author: "Народная сказка", genre: "детская", price: 250, isNew: true, isRecommended: true, image: "assets/img/books/kolobok.webp", description: "Красочная книга для самых маленьких." },
    { id: 5, title: "Краткая история времени", author: "Стивен Хокинг", genre: "научная", price: 780, isNew: false, isRecommended: true, image: "assets/img/books/hoking.webp", description: "О космологии и черных дырах." },
    { id: 6, title: "Евгений Онегин", author: "А.С. Пушкин", genre: "классическая", price: 540, isNew: false, isRecommended: false, image: "assets/img/books/onegin.webp", description: "Роман в стихах." },
    { id: 7, title: "Физика. 10 класс", author: "Мякишев Г.Я.", genre: "учебная", price: 720, isNew: true, isRecommended: false, image: "assets/img/books/fizika.webp", description: "Базовый уровень." },
    { id: 8, title: "Маленький принц", author: "Антуан де Сент-Экзюпери", genre: "детская", price: 490, isNew: false, isRecommended: true, image: "assets/img/books/prince.webp", description: "Философская сказка." },
    { id: 9, title: "1984", author: "Джордж Оруэлл", genre: "художественная", price: 550, isNew: true, isRecommended: true, image: "assets/img/books/1984.webp", description: "Антиутопия о тоталитаризме." },
    { id: 10, title: "Преступление и наказание", author: "Ф.М. Достоевский", genre: "классическая", price: 680, isNew: false, isRecommended: true, image: "assets/img/books/raskol.webp", description: "Роман о моральных муках." },
    { id: 11, title: "Гарри Поттер и философский камень", author: "Дж.К. Роулинг", genre: "детская", price: 890, isNew: true, isRecommended: true, image: "assets/img/books/potter.webp", description: "Первая книга о юном волшебнике." },
    { id: 12, title: "Атлант расправил плечи", author: "Айн Рэнд", genre: "художественная", price: 1100, isNew: false, isRecommended: false, image: "assets/img/books/atlant.webp", description: "Философский роман о свободе." },
];

// ==================== КОРЗИНА И ИЗБРАННОЕ ====================
// Загружаем данные из localStorage или создаём пустые массивы
let cart = JSON.parse(localStorage.getItem('booktook_cart')) || [];
let favorites = JSON.parse(localStorage.getItem('booktook_favorites')) || [];

// Сохранение в localStorage и обновление счётчиков
function saveCart() { localStorage.setItem('booktook_cart', JSON.stringify(cart)); updateBadges(); }
function saveFav() { localStorage.setItem('booktook_favorites', JSON.stringify(favorites)); updateBadges(); }

// Обновление значков с количеством в шапке
function updateBadges() {
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const favCount = favorites.length;
    document.getElementById('cartCountBadge').innerText = cartCount;
    document.getElementById('favCountBadge').innerText = favCount;
}

// Добавление товара в корзину (увеличивает количество, если товар уже есть)
function addToCart(bookId, quantity = 1) {
    const existing = cart.find(item => item.id === bookId);
    if (existing) existing.quantity += quantity;
    else cart.push({ id: bookId, quantity });
    saveCart();
}

// Удаление товара из корзины
function removeFromCart(bookId) { cart = cart.filter(item => item.id !== bookId); saveCart(); }

// Изменение количества товара
function updateQuantity(bookId, newQty) {
    if (newQty <= 0) removeFromCart(bookId);
    else { let item = cart.find(i => i.id === bookId); if (item) item.quantity = newQty; saveCart(); }
}

// Работа с избранным
function addToFav(bookId) { if (!favorites.includes(bookId)) { favorites.push(bookId); saveFav(); } }
function removeFromFav(bookId) { favorites = favorites.filter(id => id !== bookId); saveFav(); }
function isInFav(bookId) { return favorites.includes(bookId); }

// ==================== ОТРИСОВКА КАРТОЧКИ ====================
// Создаёт HTML карточки книги
function renderBookCard(book) {
    const favClass = isInFav(book.id) ? '❤️' : '🤍';
    return `
        <div class="book-card" data-id="${book.id}">
            <img class="book-img" src="${book.image}" alt="${book.title}">
            <div class="book-info">
                <div class="book-title">${book.title}</div>
                <div class="book-author">${book.author}</div>
                <div class="book-price">${book.price} ₽</div>
                <div class="card-buttons">
                    <button class="btn-primary add-to-cart-btn" data-id="${book.id}">В корзину</button>
                    <button class="btn-secondary fav-toggle" data-id="${book.id}">${favClass}</button>
                </div>
            </div>
        </div>
    `;
}

// ==================== РЕНДЕР СТРАНИЦ ====================
let currentPage = 'home';

// Основная функция переключения страниц
function renderPage(page) {
    currentPage = page;
    const container = document.getElementById('pageContainer');
    if (page === 'home') container.innerHTML = renderHomePage();
    else if (page === 'catalog') container.innerHTML = renderCatalogPage();
    else if (page === 'contacts') container.innerHTML = renderContactsPage();
    else if (page === 'cart') container.innerHTML = renderCartPage();
    else if (page === 'favorites') container.innerHTML = renderFavPage();
    attachPageEvents(page);
}

// ГЛАВНАЯ СТРАНИЦА
function renderHomePage() {
    const newBooks = booksData.filter(b => b.isNew);
    const recommended = booksData.filter(b => b.isRecommended);
    return `
        <div class="home-page">
            <!-- Слайдер баннеров -->
            <div class="banner-slider slider-container">
                <button class="slider-btn slider-left" id="bannerPrevBtn">❮</button>
                <div class="slider-track" id="bannerTrack">
                    <img src="assets/img/banner2.webp" alt="Новинки">
                    <img src="assets/img/banner3.webp" alt="Скидки">
                    <img src="assets/img/banner4.jpg" alt="Скидки">
                    <img src="assets/img/banner5.jpg" alt="Скидки">
                </div>
                <button class="slider-btn slider-right" id="bannerNextBtn">❯</button>
            </div>
            <!-- Категории для быстрого перехода -->
            <div class="categories">
                ${['художественная','учебная','классическая','детская','научная'].map(cat => `<div class="cat-item" data-cat="${cat}">${cat.toUpperCase()}</div>`).join('')}
            </div>
            <!-- Таймер акции -->
            <div class="timer-box">
                <h3>Акция: скидка 15% на всё до конца распродажи!</h3>
                <div class="timer-digits" id="countdownTimer">--:--:--</div>
            </div>
            <!-- Блок "О магазине" -->
            <div class="about-section">
                <h2>О магазине</h2>
                <p>Книжный магазин «БУКТУК» — это уютное пространство для любителей чтения. Мы предлагаем широкий выбор художественной, учебной, научной и детской литературы. Наша цель — вдохновлять и помогать находить книги, которые меняют жизнь.</p>
            </div>
            <!-- Преимущества -->
            <div class="benefits-section">
                <h2>Наши преимущества</h2>
                <div class="benefits-grid">
                    <div class="benefit-item"><h3>Быстрая доставка</h3><p>По всей России за 1-3 дня</p></div>
                    <div class="benefit-item"><h3>Широкий ассортимент</h3><p>Более 5000 наименований</p></div>
                    <div class="benefit-item"><h3>Низкие цены</h3><p>Постоянные скидки и акции</p></div>
                </div>
            </div>
            <!-- Слайдер новинок -->
            <h2>Новинки</h2>
            <div class="slider-container">
                <button class="slider-btn slider-left" data-slider="new">❮</button>
                <div class="slider-track" id="newSliderTrack">${newBooks.map(b => renderBookCard(b)).join('')}</div>
                <button class="slider-btn slider-right" data-slider="new">❯</button>
            </div>
            <!-- Слайдер рекомендуемых -->
            <h2>Рекомендуем</h2>
            <div class="slider-container">
                <button class="slider-btn slider-left" data-slider="rec">❮</button>
                <div class="slider-track" id="recSliderTrack">${recommended.map(b => renderBookCard(b)).join('')}</div>
                <button class="slider-btn slider-right" data-slider="rec">❯</button>
            </div>
            <!-- Отзывы -->
            <div class="reviews-section">
                <h2>Отзывы наших читателей</h2>
                <div class="reviews-grid">
                    <div class="review-card"><p>“Отличный магазин! Большой выбор, быстрая доставка. Обязательно вернусь!”</p><p class="review-author">— Анна С.</p></div>
                    <div class="review-card"><p>“Удобный сайт, легко найти нужную книгу. Приятные цены.”</p><p class="review-author">— Игорь П.</p></div>
                    <div class="review-card"><p>“Книги приходят в идеальном состоянии. Спасибо!”</p><p class="review-author">— Мария К.</p></div>
                </div>
            </div>
        </div>
    `;
}

// СТРАНИЦА КАТАЛОГА
function renderCatalogPage() {
    const genres = [...new Set(booksData.map(b => b.genre))];
    return `
        <div class="catalog-page">
            <div class="filters" id="genreFilters">
                <button class="filter-btn active" data-genre="all">Все</button>
                ${genres.map(g => `<button class="filter-btn" data-genre="${g}">${g}</button>`).join('')}
            </div>
            <div id="catalogGrid" class="books-grid"></div>
        </div>
    `;
}

// СТРАНИЦА КОНТАКТОВ
function renderContactsPage() {
    return `
        <div class="contacts-page">
            <h2>Свяжитесь с нами</h2>
            <p class="contacts-subtitle">Мы всегда рады помочь вам с выбором книг и ответить на вопросы</p>
            
            <div class="contacts-grid">
                <!-- Левая колонка: контактная информация -->
                <div class="contacts-info">
                    <div class="info-card">
                        <i class="fas fa-map-marker-alt"></i>
                        <h3>Адрес</h3>
                        <p>г. Стерлитамак, ул. Коммунистическая 148</p>
                        <p class="work-time">Ежедневно: 10:00 – 20:00</p>
                    </div>
                    <div class="info-card">
                        <i class="fas fa-phone-alt"></i>
                        <h3>Телефон</h3>
                        <p>+7 (3473) 12-34-56</p>
                        <p class="small-text">Горячая линия: 8-800-555-35-35</p>
                    </div>
                    <div class="info-card">
                        <i class="fas fa-envelope"></i>
                        <h3>Email</h3>
                        <p>booktook@books.ru</p>
                        <p>support@booktook.ru</p>
                    </div>
                    <div class="info-card">
                        <i class="fas fa-clock"></i>
                        <h3>Режим работы</h3>
                        <p>Пн–Пт: 10:00 – 20:00</p>
                        <p>Сб: 11:00 – 18:00</p>
                        <p>Вс: выходной</p>
                    </div>
                    <div class="info-card social-links">
                        <h3>Мы в соцсетях</h3>
                        <div class="contacts-social">
                            <a href="#"><i class="fab fa-vk"></i> ВКонтакте</a>
                            <a href="#"><i class="fab fa-telegram"></i> Telegram</a>
                        </div>
                    </div>
                </div>

                <!-- Правая колонка: карта и дополнительная информация -->
                <div class="contacts-map">
                    <div class="info-card map-card">
                        <h3>Как нас найти</h3>
                        <div class="map-container">
                            <iframe 
                                src="https://yandex.ru/map-widget/v1/?um=constructor%3A1234567890abcdef&source=constructor" 
                                width="100%" 
                                height="300" 
                                frameborder="0"
                                allowfullscreen>
                            </iframe>
                        </div>
                        <p class="map-note">* Интерактивная карта поможет быстро добраться</p>
                    </div>
                    <div class="info-card">
                        <h3>Удобная парковка</h3>
                        <p>Для вашего комфорта рядом с магазином есть бесплатная парковка.</p>
                    </div>
                    <div class="info-card">
                        <h3>Онлайн‑заказ</h3>
                        <p>Вы можете забронировать книгу на сайте и забрать её в магазине без очереди.</p>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// СТРАНИЦА КОРЗИНЫ
function renderCartPage() {
    if (cart.length === 0) return `<div class="no-items">Корзина пуста. Добавьте книги!</div>`;
    let total = 0;
    let itemsHtml = cart.map(item => {
        const book = booksData.find(b => b.id === item.id);
        if (!book) return '';
        total += book.price * item.quantity;
        return `<div class="cart-item" data-id="${item.id}">
            <div class="item-details"><strong>${book.title}</strong> — ${book.author}<br>${book.price} ₽ x </div>
            <div class="item-actions"><input type="number" class="quantity-input" value="${item.quantity}" min="1" data-id="${item.id}">
            <button class="btn-secondary remove-cart-item" data-id="${item.id}">Удалить</button></div>
        </div>`;
    }).join('');
    return `<div><h2>Корзина</h2>${itemsHtml}<h3>Итого: ${total} ₽</h3><button id="clearCartBtn" class="btn-primary">Очистить корзину</button></div>`;
}

// СТРАНИЦА ИЗБРАННОГО
function renderFavPage() {
    if (favorites.length === 0) return `<div class="no-items">В избранном пока нет книг.</div>`;
    let itemsHtml = favorites.map(id => {
        const book = booksData.find(b => b.id === id);
        if (!book) return '';
        return `<div class="fav-item" data-id="${id}">
            <div><strong>${book.title}</strong> — ${book.author} (${book.price} ₽)</div>
            <div><button class="btn-primary add-to-cart-fav" data-id="${id}">В корзину</button>
            <button class="btn-secondary remove-fav" data-id="${id}">Удалить</button></div>
        </div>`;
    }).join('');
    return `<div><h2>Избранное</h2>${itemsHtml}</div>`;
}

// ==================== ОБРАБОТЧИКИ СОБЫТИЙ ====================
// Подключает обработчики после загрузки страницы
function attachPageEvents(page) {
    initSliders();
    if (page === 'home') {
        startTimer();
        startBannerAutoScroll();
        initBannerControls();
        const bannerContainer = document.querySelector('.banner-slider');
        if (bannerContainer) {
            bannerContainer.addEventListener('mouseenter', stopBannerAutoScroll);
            bannerContainer.addEventListener('mouseleave', startBannerAutoScroll);
        }
    }
    if (page === 'catalog') {
        let currentGenre = 'all';
        function filterCatalog() {
            let filtered = currentGenre === 'all' ? booksData : booksData.filter(b => b.genre === currentGenre);
            document.getElementById('catalogGrid').innerHTML = filtered.map(b => renderBookCard(b)).join('');
        }
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentGenre = btn.dataset.genre;
                filterCatalog();
            });
        });
        filterCatalog();
    }
    if (page === 'cart') {
        const container = document.getElementById('pageContainer');
        container.querySelectorAll('.quantity-input').forEach(inp => {
            inp.addEventListener('change', (e) => updateQuantity(parseInt(inp.dataset.id), parseInt(inp.value)));
        });
        container.querySelectorAll('.remove-cart-item').forEach(btn => {
            btn.addEventListener('click', (e) => { removeFromCart(parseInt(btn.dataset.id)); renderPage('cart'); });
        });
        const clearBtn = document.getElementById('clearCartBtn');
        if (clearBtn) clearBtn.onclick = () => { cart = []; saveCart(); renderPage('cart'); };
    }
    if (page === 'favorites') {
        const container = document.getElementById('pageContainer');
        container.querySelectorAll('.remove-fav').forEach(btn => {
            btn.addEventListener('click', () => { removeFromFav(parseInt(btn.dataset.id)); renderPage('favorites'); });
        });
        container.querySelectorAll('.add-to-cart-fav').forEach(btn => {
            btn.addEventListener('click', () => { addToCart(parseInt(btn.dataset.id), 1); alert('Добавлено в корзину'); });
        });
    }
}

// Делегирование событий для кнопок в карточках
document.getElementById('pageContainer').addEventListener('click', (e) => {
    const target = e.target;
    // Кнопка "В корзину"
    if (target.classList.contains('add-to-cart-btn')) {
        e.stopPropagation();
        const bookId = parseInt(target.dataset.id);
        addToCart(bookId, 1);
        updateBadges();
        alert('Добавлено в корзину');
    } 
    // Кнопка "Избранное"
    else if (target.classList.contains('fav-toggle')) {
        e.stopPropagation();
        const bookId = parseInt(target.dataset.id);
        if (isInFav(bookId)) {
            removeFromFav(bookId);
        } else {
            addToFav(bookId);
        }
        const card = target.closest('.book-card');
        if (card) {
            const newIcon = isInFav(bookId) ? '❤️' : '🤍';
            target.textContent = newIcon;
        }
        updateBadges();
    }
});

// Модальное окно (открывается при клике на карточку)
document.getElementById('pageContainer').addEventListener('click', (e) => {
    const card = e.target.closest('.book-card');
    if (card && !e.target.closest('.card-buttons')) {
        const id = parseInt(card.dataset.id);
        const book = booksData.find(b => b.id === id);
        if (book) {
            const modal = document.getElementById('bookModal');
            document.getElementById('modalBody').innerHTML = `
                <h3>${book.title}</h3>
                <p><strong>${book.author}</strong></p>
                <p>Жанр: ${book.genre}</p>
                <p>Цена: ${book.price} ₽</p>
                <p>${book.description}</p>
            `;
            modal.style.display = 'flex';
        }
    }
});

// Закрытие модального окна
document.querySelector('.close-modal').addEventListener('click', () => {
    document.getElementById('bookModal').style.display = 'none';
});
window.addEventListener('click', (e) => {
    const modal = document.getElementById('bookModal');
    if (e.target === modal) modal.style.display = 'none';
});

// ==================== СЛАЙДЕРЫ ====================
// Инициализация всех слайдеров (кнопки влево/вправо)
function initSliders() {
    const sliders = document.querySelectorAll('.slider-container');
    sliders.forEach(container => {
        const track = container.querySelector('.slider-track');
        const leftBtn = container.querySelector('.slider-left');
        const rightBtn = container.querySelector('.slider-right');
        if (leftBtn && rightBtn && track) {
            leftBtn.onclick = () => { track.scrollBy({ left: -280, behavior: 'smooth' }); };
            rightBtn.onclick = () => { track.scrollBy({ left: 280, behavior: 'smooth' }); };
        }
    });
}

// Управление стрелками баннера (отдельно)
function initBannerControls() {
    const bannerTrack = document.getElementById('bannerTrack');
    const leftBtn = document.getElementById('bannerPrevBtn');
    const rightBtn = document.getElementById('bannerNextBtn');
    if (bannerTrack && leftBtn && rightBtn) {
        leftBtn.onclick = () => {
            bannerTrack.scrollBy({ left: -bannerTrack.clientWidth, behavior: 'smooth' });
        };
        rightBtn.onclick = () => {
            bannerTrack.scrollBy({ left: bannerTrack.clientWidth, behavior: 'smooth' });
        };
    }
}

// ==================== ТАЙМЕР ====================
// Обратный отсчёт до окончания акции
function startTimer() {
    const timerElement = document.getElementById('countdownTimer');
    if (!timerElement) return;
    
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 2);
    
    function updateTimer() {
        const now = new Date();
        const diff = targetDate - now;
        if (diff <= 0) {
            timerElement.innerText = "Акция завершена!";
            return;
        }
        const hours = Math.floor(diff / 3600000);
        const mins = Math.floor((diff % 3600000) / 60000);
        const secs = Math.floor((diff % 60000) / 1000);
        timerElement.innerText = `${hours.toString().padStart(2,'0')}:${mins.toString().padStart(2,'0')}:${secs.toString().padStart(2,'0')}`;
    }
    updateTimer();
    setInterval(updateTimer, 1000);
}

// ==================== АВТОПРОКРУТКА БАННЕРА ====================
let bannerInterval;
let currentBannerIndex = 0;

function startBannerAutoScroll() {
    const bannerTrack = document.getElementById('bannerTrack');
    if (!bannerTrack) return;
    const images = bannerTrack.children;
    if (images.length === 0) return;
    clearInterval(bannerInterval);
    bannerInterval = setInterval(() => {
        currentBannerIndex = (currentBannerIndex + 1) % images.length;
        const scrollAmount = currentBannerIndex * bannerTrack.clientWidth;
        bannerTrack.scrollTo({ left: scrollAmount, behavior: 'smooth' });
    }, 5000);
}

function stopBannerAutoScroll() {
    clearInterval(bannerInterval);
}

// ==================== НАВИГАЦИЯ ====================
// Обработка кликов по ссылкам с data-nav
document.querySelectorAll('[data-nav]').forEach(el => {
    el.addEventListener('click', (e) => {
        e.preventDefault();
        const page = el.dataset.nav;
        if (page) renderPage(page);
    });
});

// Бургер-меню
document.getElementById('burgerBtn').addEventListener('click', () => {
    document.getElementById('navMenu').classList.toggle('active');
});

// Клик по категориям на главной
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('cat-item')) {
        const genre = e.target.dataset.cat;
        renderPage('catalog');
        setTimeout(() => {
            const filterBtn = [...document.querySelectorAll('.filter-btn')].find(btn => btn.dataset.genre === genre);
            if (filterBtn) filterBtn.click();
        }, 50);
    }
});

// ==================== ЗАКРЫТИЕ БУРГЕР-МЕНЮ ====================
// Закрытие при клике по ссылке
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        document.getElementById('navMenu').classList.remove('active');
    });
});

// Закрытие при клике вне меню
document.addEventListener('click', (e) => {
    const menu = document.getElementById('navMenu');
    const burger = document.getElementById('burgerBtn');
    if (menu.classList.contains('active') && !menu.contains(e.target) && !burger.contains(e.target)) {
        menu.classList.remove('active');
    }
});

// ==================== ИНИЦИАЛИЗАЦИЯ ====================
updateBadges();
renderPage('home');