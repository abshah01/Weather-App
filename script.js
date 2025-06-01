const apiKey = 'sk - cc68631f35686a86b54f1aeb139c1aa8'; // <-- Replace this with your API key

const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const weatherDiv = document.getElementById('weather');
const errorP = document.getElementById('error');

const locationEl = document.getElementById('location');
const iconEl = document.getElementById('icon');
const descriptionEl = document.getElementById('description');
const tempEl = document.getElementById('temp');
const humidityEl = document.getElementById('humidity');
const windEl = document.getElementById('wind');
const pressureEl = document.getElementById('pressure');
const feelsLikeEl = document.getElementById('feels_like');
const updatedEl = document.getElementById('updated');

searchBtn.addEventListener('click', () => {
  const city = cityInput.value.trim();
  if (city) {
    errorP.textContent = '';
    fetchWeatherByCity(city);
  }
});

cityInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    searchBtn.click();
  }
});

function fetchWeatherByCity(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;
  fetchWeather(url);
}

function fetchWeatherByCoords(lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  fetchWeather(url);
}

function fetchWeather(url) {
  fetch(url)
    .then((res) => {
      if (!res.ok) {
        throw new Error('City not found');
      }
      return res.json();
    })
    .then((data) => {
      displayWeather(data);
    })
    .catch((err) => {
      weatherDiv.classList.add('hidden');
      errorP.textContent = err.message;
    });
}

function displayWeather(data) {
  weatherDiv.classList.remove('hidden');

  locationEl.textContent = `${data.name}, ${data.sys.country}`;
  descriptionEl.textContent = data.weather[0].description;
  tempEl.textContent = `${Math.round(data.main.temp)}°C`;
  humidityEl.textContent = data.main.humidity;
  windEl.textContent = data.wind.speed;
  pressureEl.textContent = data.main.pressure;
  feelsLikeEl.textContent = `${Math.round(data.main.feels_like)}°C`;
  updatedEl.textContent = new Date(data.dt * 1000).toLocaleString();

  const iconCode = data.weather[0].icon;
  iconEl.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  iconEl.alt = data.weather[0].description;

  errorP.textContent = '';
}

// Try to get location automatically on page load
window.addEventListener('load', () => {
  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        fetchWeatherByCoords(pos.coords.latitude, pos.coords.longitude);
      },
      (err) => {
        // User denied location or error
        errorP.textContent = 'Allow location or search a city manually.';
      }
    );
  } else {
    errorP.textContent = 'Geolocation is not supported by your browser.';
  }
});
