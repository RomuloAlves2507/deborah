document.addEventListener('DOMContentLoaded', () => {

    // --- NOMES DOS ARQUIVOS DE IMAGEM NA PASTA "midias" ---
    const imageFileNames = [
        'Foto_1.jpg', 'Foto_2.jpg', 'Foto_3.jpg', 'Foto_4.jpg', 
        'Foto_5.jpg', 'Foto_6.jpg', 'Foto_7.jpg', 'Foto_8.jpg', 
        'Foto_9.jpg', 'Foto_10.jpg', 'Foto_11.jpg', 'Foto_12.jpg', 
        'Foto_13.jpg', 'Foto_14.jpg', 'Foto_15.jpg', 'Foto_16.jpg', 
        'Foto_17.jpg', 'Foto_18.jpg', 'Foto_19.jpg', 'Foto_20.jpg', 
        'Foto_21.jpg', 'Foto_100.HEIC'
    ];

    // --- LÓGICA DOS CONTADORES ---
    function startCounters() {
        // Lembre-se de ajustar para as suas datas reais!
        // Formato: Ano, Mês (0=Jan, 1=Fev, ...), Dia
        const dateConhecido = new Date(2024, 6, 17); // 17 de Julho de 2024
        const dateBeijo = new Date(2024, 7, 17);     // 17 de Agosto de 2024
        const dateNamoro = new Date(2025, 0, 17);    // 17 de Janeiro de 2025

        const conhecidoCounter = document.getElementById('conhecido-counter');
        const beijoCounter = document.getElementById('beijo-counter');
        const namoroCounter = document.getElementById('namoro-counter');

        function updateCounter(element, targetDate) {
            const now = new Date();
            const diff = now - targetDate;

            if (diff < 0) {
                element.innerHTML = "Em breve...";
                return;
            }

            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            element.innerHTML =
                `${String(days).padStart(3, '0')}d ` +
                `${String(hours).padStart(2, '0')}h ` +
                `${String(minutes).padStart(2, '0')}m ` +
                `${String(seconds).padStart(2, '0')}s`;
        }

        setInterval(() => {
            updateCounter(conhecidoCounter, dateConhecido);
            updateCounter(beijoCounter, dateBeijo);
            updateCounter(namoroCounter, dateNamoro);
        }, 1000);
    }

    // --- LÓGICA DO CARROSSEL ---
    function startCarousel() {
        const carousel = document.querySelector('.carousel');
        const nextButton = document.querySelector('.next');
        const prevButton = document.querySelector('.prev');
        let currentIndex = 0;
        let slides = [];

        imageFileNames.forEach(fileName => {
            const slide = document.createElement('div');
            slide.classList.add('slide');
            const img = document.createElement('img');
            img.src = `midias/${fileName}`;
            img.alt = `Nosso momento - ${fileName}`;
            slide.appendChild(img);
            carousel.appendChild(slide);
        });

        slides = Array.from(document.querySelectorAll('.slide'));
        if (slides.length === 0) return;

        function updateCarousel() {
            carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
            slides.forEach((slide, index) => {
                slide.classList.remove('active');
                if (index === currentIndex) {
                    slide.classList.add('active');
                }
            });
        }

        nextButton.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % slides.length;
            updateCarousel();
        });

        prevButton.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + slides.length) % slides.length;
            updateCarousel();
        });

        updateCarousel();
    }

    // --- LÓGICA DA CHUVA DE CORAÇÕES ---
    function startHeartRain() {
        const canvas = document.getElementById('heart-rain-canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        let hearts = [];

        function createHeart() {
            const x = Math.random() * canvas.width;
            const y = (Math.random() * -canvas.height) - 20;
            const size = Math.random() * 20 + 10;
            const speed = Math.random() * 3 + 1;
            const opacity = Math.random() * 0.5 + 0.3;
            hearts.push({ x, y, size, speed, opacity });
        }

        function drawHeart(heart) {
            ctx.fillStyle = `rgba(255, 77, 77, ${heart.opacity})`;
            ctx.beginPath();
            const topCurveHeight = heart.size * 0.3;
            ctx.moveTo(heart.x, heart.y + topCurveHeight);
            ctx.bezierCurveTo(heart.x, heart.y, heart.x - heart.size / 2, heart.y, heart.x - heart.size / 2, heart.y + topCurveHeight);
            ctx.bezierCurveTo(heart.x - heart.size / 2, heart.y + (heart.size + topCurveHeight) / 2, heart.x, heart.y + (heart.size + topCurveHeight) / 2, heart.x, heart.y + heart.size);
            ctx.bezierCurveTo(heart.x, heart.y + (heart.size + topCurveHeight) / 2, heart.x + heart.size / 2, heart.y + (heart.size + topCurveHeight) / 2, heart.x + heart.size / 2, heart.y + topCurveHeight);
            ctx.bezierCurveTo(heart.x + heart.size / 2, heart.y, heart.x, heart.y, heart.x, heart.y + topCurveHeight);
            ctx.fill();
            ctx.closePath();
        }

        function updateHearts() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < hearts.length; i++) {
                let heart = hearts[i]; // Bug corrigido aqui
                heart.y += heart.speed;
                drawHeart(heart);
                if (heart.y > canvas.height + heart.size) {
                    hearts.splice(i, 1);
                    i--;
                }
            }
        }

        function gameLoop() {
            updateHearts();
            requestAnimationFrame(gameLoop);
        }

        setInterval(createHeart, 300);
        gameLoop();
        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });
    }

    // --- LÓGICA DO LIGHTBOX (TELA CHEIA) ---
    function setupLightbox() {
        const carousel = document.querySelector('.carousel');
        const lightboxOverlay = document.getElementById('lightbox-overlay');
        const lightboxImage = document.getElementById('lightbox-image');
        const closeButton = document.querySelector('.lightbox-close');

        if (!carousel || !lightboxOverlay || !lightboxImage || !closeButton) {
            return;
        }

        carousel.addEventListener('click', (e) => {
            if (e.target.tagName === 'IMG' && e.target.closest('.slide.active')) {
                lightboxImage.src = e.target.src;
                lightboxOverlay.style.display = 'flex';
            }
        });

        function closeLightbox() {
            lightboxOverlay.style.display = 'none';
        }

        closeButton.addEventListener('click', closeLightbox);
        lightboxOverlay.addEventListener('click', (e) => {
            if (e.target === lightboxOverlay) {
                closeLightbox();
            }
        });
    }

    // --- INICIA TODAS AS FUNCIONALIDADES DO SITE ---
    startCounters();
    startCarousel();
    startHeartRain();
    setupLightbox();
});