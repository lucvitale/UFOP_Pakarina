async function fetchClimateData(city) {
  const apiKey = CONFIG.WEATHER_API_KEY;
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;

  showClimateLoading();

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("City not found");
    const data = await response.json();
    analyzeClimate(data);
  } catch (err) {
    showClimateError();
  }
}

async function fetchClimateByCoords(lat, lon) {
  const apiKey = CONFIG.WEATHER_API_KEY;
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

  showClimateLoading();

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Location not found");
    const data = await response.json();
    analyzeClimate(data);
  } catch (err) {
    showClimateError();
  }
}

function analyzeClimate(data) {

  const temp = Math.round(data.main.temp);
  const humidity = data.main.humidity;
  const wind = data.wind.speed;
  const precipitation = data.rain?.["1h"] || 0;
  const city = `${data.name}, ${data.sys.country}`;

  const t = window._currentTranslations || {};

  let riskScore = 0;

  if (temp >= 25 && temp <= 35) riskScore += 2;
  else if (temp > 20) riskScore += 1;

  if (humidity >= 60) riskScore += 2;
  else if (humidity >= 40) riskScore += 1;

  if (wind < 3) riskScore += 1;

  if (precipitation > 5) riskScore += 1;

  let riskLevel, riskColor, riskMessage, riskKey, riskMsgKey;

  if (riskScore >= 4) {
    riskKey = "climate_risk_high";
    riskMsgKey = "climate_msg_high";
    riskLevel = t[riskKey] || "High Risk";
    riskColor = "#e74c3c";
    riskMessage = t[riskMsgKey] || "⚠️ Current conditions are highly favorable for dengue mosquito proliferation. Take preventive measures.";
  } else if (riskScore >= 2) {
    riskKey = "climate_risk_medium";
    riskMsgKey = "climate_msg_medium";
    riskLevel = t[riskKey] || "Medium Risk";
    riskColor = "#f39c12";
    riskMessage = t[riskMsgKey] || "⚡ Conditions partially favor mosquito activity. Stay alert and eliminate standing water.";
  } else {
    riskKey = "climate_risk_low";
    riskMsgKey = "climate_msg_low";
    riskLevel = t[riskKey] || "Low Risk";
    riskColor = "#27ae60";
    riskMessage = t[riskMsgKey] || "✅ Current conditions are not particularly favorable for dengue mosquito proliferation.";
  }

  document.getElementById("risk-city-name").textContent = city;

  const badge = document.getElementById("risk-badge");
  badge.textContent = riskLevel;
  badge.style.background = riskColor;
  badge.setAttribute("data-i18n", riskKey); 

  const msgEl = document.getElementById("risk-message");
  msgEl.textContent = riskMessage;
  msgEl.setAttribute("data-i18n", riskMsgKey);

  document.getElementById("ind-temp").textContent = `${temp}°C`;
  document.getElementById("ind-humidity").textContent = `${humidity}%`;
  document.getElementById("ind-wind").textContent = `${wind} m/s`;
  document.getElementById("ind-precipitation").textContent = `${precipitation} mm`;

  const tempPct = Math.min(Math.max((temp / 45) * 100, 0), 100);
  const humPct = Math.min(humidity, 100);
  const windPct = Math.min((wind / 20) * 100, 100);
  const precipPct = Math.min((precipitation / 20) * 100, 100);

  setBar("bar-temp", tempPct, temp >= 25 && temp <= 35 ? riskColor : "#a48a6a");
  setBar("bar-humidity", humPct, humidity >= 60 ? riskColor : "#a48a6a");
  setBar("bar-wind", 100 - windPct, wind < 3 ? riskColor : "#a48a6a");
  setBar("bar-precipitation", precipPct, precipitation > 5 ? riskColor : "#a48a6a");
  setHint("hint-temp", getTempMsgKey(temp),
  "Dengue mosquitoes thrive between 25°C and 35°C.");
  setHint("hint-humidity", getHumidityMsgKey(humidity),
    "Humidity above 60% favors mosquito breeding.");
  setHint("hint-wind", getWindMsgKey(wind),
    "Low wind speeds allow mosquitoes to remain active.");
  setHint("hint-precipitation", getPrecipMsgKey(precipitation),
    "Rain increases mosquito breeding sites by creating standing water.");

  document.getElementById("climate-loading").style.display = "none";
  document.getElementById("climate-no-data").style.display = "none";
  document.getElementById("climate-results").style.display = "block";
}

function setBar(id, pct, color) {
  const bar = document.getElementById(id);
  bar.style.width = `${pct}%`;
  bar.style.background = color;
}

function getTempMsgKey(temp) {
  if (temp < 10) return "climate_temp_msg_verylow";
  if (temp < 20) return "climate_temp_msg_low";
  if (temp < 25) return "climate_temp_msg_medium";
  if (temp <= 35) return "climate_temp_msg_high";
  return "climate_temp_msg_extreme";
}

function getHumidityMsgKey(humidity) {
  if (humidity < 40) return "climate_humidity_msg_low";
  if (humidity < 60) return "climate_humidity_msg_medium";
  return "climate_humidity_msg_high";
}

function getWindMsgKey(wind) {
  return wind < 3 ? "climate_wind_msg_low" : "climate_wind_msg_high";
}

function getPrecipMsgKey(precipitation) {
  if (precipitation <= 5) return "climate_precip_msg_low";
  if (precipitation <= 20) return "climate_precip_msg_medium";
  return "climate_precip_msg_high";
}

function setHint(id, key, fallback) {
  const el = document.getElementById(id);
  el.textContent = (window._currentTranslations || {})[key] || fallback;
  el.setAttribute("data-i18n", key);
}

function showClimateLoading() {
  document.getElementById("climate-loading").style.display = "block";
  document.getElementById("climate-no-data").style.display = "none";
  document.getElementById("climate-results").style.display = "none";
}

function showClimateError() {
  document.getElementById("climate-loading").style.display = "none";
  document.getElementById("climate-no-data").style.display = "block";
  document.getElementById("climate-results").style.display = "none";
  document.getElementById("climate-no-data").querySelector("p").setAttribute("data-i18n", "climate_error");
  document.getElementById("climate-no-data").querySelector("p").textContent = window._currentTranslations?.["climate_error"] || "City not found. Please try again.";
}

function analyzeCity() {
  const input = document.getElementById("climate-city-input").value.trim();
  if (input) fetchClimateData(input);
}

function analyzeGPS() {
  if (!navigator.geolocation) return;
  navigator.geolocation.getCurrentPosition(
    (pos) => fetchClimateByCoords(pos.coords.latitude, pos.coords.longitude),
    () => showClimateError()
  );
}

document.getElementById("climate-city-input").addEventListener("keydown", (e) => {
  if (e.key === "Enter") analyzeCity();
});