// weather.js — OpenWeatherMap integration
// Default city: João Monlevade, Brazil

const DEFAULT_CITY = "João Monlevade";

async function fetchWeather(city) {
  const apiKey = CONFIG.WEATHER_API_KEY;
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric&lang=${currentLang}`;

  showLoading();

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("City not found");
    const data = await response.json();
    displayWeather(data);
  } catch (err) {
    showError();
    console.error("[Weather] Error:", err.message);
  }
}

async function fetchWeatherByCoords(lat, lon) {
  const apiKey = CONFIG.WEATHER_API_KEY;
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=${currentLang}`;

  showLoading();

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Location not found");
    const data = await response.json();
    displayWeather(data);
  } catch (err) {
    showError();
    console.error("[Weather] Error:", err.message);
  }
}

function getGPSLocation() {
  if (!navigator.geolocation) {
    alert("Geolocation is not supported by your browser.");
    return;
  }
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      fetchWeatherByCoords(latitude, longitude);
    },
    () => {
      alert("Unable to retrieve your location.");
    }
  );
}

function displayWeather(data) {
  const temp = Math.round(data.main.temp);
  const feelsLike = Math.round(data.main.feels_like);
  const humidity = data.main.humidity;
  const windSpeed = data.wind.speed;
  const description = data.weather[0].description;
  const icon = data.weather[0].icon;
  const cityName = `${data.name}, ${data.sys.country}`;

  document.getElementById("weather-city").textContent = cityName;
  document.getElementById("weather-temp").textContent = `${temp}°C`;
  document.getElementById("weather-desc").textContent = description.charAt(0).toUpperCase() + description.slice(1);
  document.getElementById("weather-icon").src = `https://openweathermap.org/img/wn/${icon}@2x.png`;
  document.getElementById("weather-humidity").textContent = `${humidity}%`;
  document.getElementById("weather-wind").textContent = `${windSpeed} m/s`;
  document.getElementById("weather-feels").textContent = `${feelsLike}°C`;

  const warning = document.getElementById("weather-dengue-warning");
  if (temp >= 25 && humidity >= 60) {
    const allTranslations = window._currentTranslations || {};
    warning.textContent = allTranslations["dashboard_dengue_warning"] || "⚠️ Current conditions may favour dengue mosquito proliferation.";
    warning.style.display = "block";
  } else {
    warning.style.display = "none";
  }

  document.getElementById("weather-loading").style.display = "none";
  document.getElementById("weather-data").style.display = "block";
}

function showLoading() {
  document.getElementById("weather-loading").style.display = "block";
  document.getElementById("weather-data").style.display = "none";
  document.getElementById("weather-error").style.display = "none";
}

function showError() {
  document.getElementById("weather-loading").style.display = "none";
  document.getElementById("weather-error").style.display = "block";
}

function searchCity() {
  const input = document.getElementById("city-input").value.trim();
  if (input) fetchWeather(input);
}

document.getElementById("city-input").addEventListener("keydown", (e) => {
  if (e.key === "Enter") searchCity();
});

fetchWeather(DEFAULT_CITY);