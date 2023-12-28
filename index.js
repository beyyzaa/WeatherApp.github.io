const container = document.querySelector('.container');
const search = document.querySelector('.search-box button');
const weatherBox = document.querySelector('.weather-box');
const weatherDetails = document.querySelector('.weather-details');
const error404 = document.querySelector('.not-found');
const mapContainer = document.getElementById('map');

var map;

// OpenCage API anahtarı
const openCageApiKey = '14450729c34a49dd94c9fa9817daf748';

// Ters jeokodlama fonksiyonu
// Ters jeokodlama fonksiyonu
function reverseGeocode(lat, lng) {
    const apiUrl = `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${openCageApiKey}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const city = data.results[0].components.city;
            // Arama kutusunu güncelle
            document.querySelector('.search-box input').value = city;
            getWeatherInfo(city);
        })
        .catch(error => console.error('Reverse geocoding error:', error));
}


// Hava durumu bilgilerini getiren fonksiyon
function getWeatherInfo(city) {
    const APIKey = '1607338ec88ce398dd800ec81cfb32b6';

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${APIKey}`)
        .then(response => response.json())
        .then(json => {
            if (json.cod === '404') {
                container.style.height = '420px';
                weatherBox.style.display = 'none';
                weatherDetails.style.display = 'none';
                error404.style.display = 'block';
                error404.classList.add('fadeIn');
                return;
            }

            error404.style.display = 'none';
            error404.classList.remove('fadeIn');

            const image = document.querySelector('.weather-box img');
            const temperature = document.querySelector('.weather-box .temperature');
            const description = document.querySelector('.weather-box .description');
            const humidity = document.querySelector('.weather-details .humidity span');
            const wind = document.querySelector('.weather-details .wind span');

            switch (json.weather[0].main) {
                case 'Clear':
                    image.src = 'images/clear.png';
                    break;

                case 'Rain':
                    image.src = 'images/rain.png';
                    break;

                case 'Snow':
                    image.src = 'images/snow.png';
                    break;

                case 'Clouds':
                    image.src = 'images/cloud.png';
                    break;

                case 'Haze':
                    image.src = 'images/mist.png';
                    break;

                default:
                    image.src = '';
            }

            temperature.innerHTML = `${parseInt(json.main.temp)}<span>°C</span>`;
            description.innerHTML = `${json.weather[0].description}`;
            humidity.innerHTML = `${json.main.humidity}%`;
            wind.innerHTML = `${parseInt(json.wind.speed)}Km/h`;

            weatherBox.style.display = '';
            weatherDetails.style.display = '';
            weatherBox.classList.add('fadeIn');
            weatherDetails.classList.add('fadeIn');
            container.style.height = '590px';
        });
}

// Harita oluştur
function initMap() {
    map = L.map(mapContainer).setView([0, 0], 2);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // Harita üzerinde tıklama olayını dinle
    map.on('click', (e) => {
        const lat = e.latlng.lat;
        const lng = e.latlng.lng;

        // Ters jeokodlama fonksiyonunu çağır
        reverseGeocode(lat, lng);
    });
}

// Arama butonuna tıklanınca
search.addEventListener('click', () => {
    const city = document.querySelector('.search-box input').value;

    if (city === '') return;

    fetch(`https://api.opencagedata.com/geocode/v1/json?q=${city}&key=${openCageApiKey}`)
        .then(response => response.json())
        .then(data => {
            const lat = data.results[0].geometry.lat;
            const lng = data.results[0].geometry.lng;

            // Haritayı güncelle
            map.setView([lat, lng], 10);

            // Ters jeokodlama fonksiyonunu çağır
            reverseGeocode(lat, lng);
        })
        .catch(error => console.error('Geocoding error:', error));
});

// Haritayı başlat
initMap();
