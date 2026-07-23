// Sensor data visualization — Hardware Integration
const SENSOR_API = "http://localhost:3000/api/sensor/summary";

async function loadSensorData() {
  const loading = document.getElementById("sensor-loading");
  const content = document.getElementById("sensor-content");
  const errorEl = document.getElementById("sensor-error");

  try {
    const res = await fetch(SENSOR_API);
    if (!res.ok) throw new Error("API error");
    const data = await res.json();

    // Stats principales
    document.getElementById("sensor-total").textContent = data.total;
    document.getElementById("sensor-vectors").textContent = data.vectorCount;
    document.getElementById("sensor-temp").textContent = `${data.avgTemperature}°C`;
    document.getElementById("sensor-humidity").textContent = `${data.avgHumidity}%`;

    // Localisation
    if (data.location) {
      document.getElementById("sensor-location").textContent =
        `📍 ${data.location.latitude}, ${data.location.longitude} — João Monlevade, MG`;
    }

    // Graphique par espèce
    const speciesEl = document.getElementById("sensor-species");
    const maxCount = Math.max(...data.species.map((s) => s.count));
    speciesEl.innerHTML = data.species
      .sort((a, b) => b.count - a.count)
      .map((s) => {
        const label = s.sex === "unknown"
          ? s.name
          : `${s.name} (${s.sex === "female" ? "♀" : "♂"})`;
        const pct = (s.count / maxCount) * 100;
        const barColor = s.vector ? "#e74c3c" : "#a48a6a";
        return `
          <div class="species-row">
            <span class="species-name">${label}${s.vector ? " ⚠️" : ""}</span>
            <div class="species-bar-track">
              <div class="species-bar" style="width:${pct}%;background:${barColor}"></div>
            </div>
            <span class="species-count">${s.count}</span>
          </div>`;
      })
      .join("");

    loading.style.display = "none";
    content.style.display = "block";
  } catch (err) {
    loading.style.display = "none";
    errorEl.style.display = "block";
    console.error("[sensor] Error:", err.message);
  }
}

document.addEventListener("DOMContentLoaded", loadSensorData);
