document.addEventListener("DOMContentLoaded", function () {
  const input = document.getElementById("news-city-input");
  const button = document.getElementById("news-search-btn");
  const statusBox = document.getElementById("news-status");
  const resultsBox = document.getElementById("news-results");

  const API_BASE = "http://localhost:3000";

  let map = null;
  let markers = [];

function initMap() {
  if (map) return;
  map = L.map("news-map", { scrollWheelZoom: true }).setView([15, 0], 2);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 18,
    attribution: "© OpenStreetMap contributors",
  }).addTo(map);

  // Recalcule la taille de la carte à chaque redimensionnement de la fenêtre
  window.addEventListener("resize", () => {
    if (map) map.invalidateSize();
  });
}

  function clearMarkers() {
    markers.forEach((m) => map.removeLayer(m));
    markers = [];
  }

  function pinIcon() {
    return L.divIcon({
      className: "",
      html: `<div class="news-map-pin"><span>📍</span></div>`,
      iconSize: [28, 28],
      iconAnchor: [14, 28],
      popupAnchor: [0, -28],
    });
  }

  function renderMap(results) {
    initMap();
    clearMarkers();

    const withCoords = results.filter(
      (r) => r.lat && r.lon && !isNaN(r.lat) && !isNaN(r.lon)
    );

    if (withCoords.length === 0) {
      map.setView([15, 0], 2);
      return;
    }

    withCoords.forEach((item) => {
      const marker = L.marker([item.lat, item.lon], { icon: pinIcon() }).addTo(map);

      marker.bindPopup(`
        <div class="news-map-popup">
          <h4><a href="${item.link}" target="_blank" rel="noopener noreferrer">${item.titulo}</a></h4>
          ${item.jornal ? `<span class="news-source-badge">${item.jornal}</span>` : ""}
          <div>${item.local_nome || ""}</div>
        </div>
      `);

      marker.on("click", () => {
        const card = document.getElementById(`news-card-${item.id}`);
        if (card) {
          card.scrollIntoView({ behavior: "smooth", block: "center" });
          document.querySelectorAll(".news-card.highlighted").forEach((c) =>
            c.classList.remove("highlighted")
          );
          card.classList.add("highlighted");
        }
      });

      markers.push(marker);
    });

    const bounds = L.latLngBounds(withCoords.map((r) => [r.lat, r.lon]));
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 8 });
  }

  function translate(key, fallback) {
    return window._currentTranslations?.[key] || fallback;
  }

  function showStatus(message, isError = false) {
    statusBox.hidden = false;
    statusBox.textContent = message;
    statusBox.classList.toggle("error", isError);
  }

  function hideStatus() {
    statusBox.hidden = true;
  }

  async function fetchAvailableCities() {
    try {
      const response = await fetch(`${API_BASE}/api/news/cities`);
      if (!response.ok) return [];
      const data = await response.json();
      return data.cities || [];
    } catch (err) {
      console.error(err);
      return [];
    }
  }

  async function renderEmptyState() {
    const cities = await fetchAvailableCities();

    let html = `
      <div class="news-empty">
        <p>${translate("news_no_results", "No news found for this search.")}</p>
    `;

    if (cities.length > 0) {
      html += `
        <div class="news-available-cities">
          <p class="news-available-label">
            ${translate("news_available_locations", "Locations with available news:")}
          </p>
          <div class="news-city-list">
            ${cities
              .map(
                (city) =>
                  `<button class="news-city-tag city-search-btn" data-city="${city}">${city}</button>`
              )
              .join("")}
          </div>
        </div>
      `;
    }

    html += `</div>`;
    resultsBox.innerHTML = html;

    document.querySelectorAll(".city-search-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        input.value = btn.dataset.city;
        searchNews();
      });
    });
  }

  function renderResults(data) {
    resultsBox.innerHTML = "";

    if (!data.results || data.results.length === 0) {
      renderMap([]);
      renderEmptyState();
      return;
    }

    renderMap(data.results);

    data.results.forEach((item) => {
      const card = document.createElement("div");
      card.className = "news-card";
      card.id = `news-card-${item.id}`;

      card.innerHTML = `
        <h3>
          <a href="${item.link}" target="_blank" rel="noopener noreferrer">${item.titulo}</a>
        </h3>
        <div class="news-meta">
          ${item.jornal ? `<span class="news-source-badge">${item.jornal}</span>` : ""}
          <span class="news-meta-date">${item.data || "—"}</span>
          <span class="news-meta-place">${item.local_nome || "—"}</span>
        </div>
        ${item.resumo ? `<p class="news-resumo">${item.resumo}</p>` : ""}
      `;

      resultsBox.appendChild(card);
    });
  }

  let isSearching = false;

  async function searchNews(event) {
    if (event) event.preventDefault();
    if (isSearching) return;

    const query = input.value.trim();

    if (!query) {
      showStatus(translate("news_empty_city", "Please enter a keyword or city name."), true);
      return;
    }

    isSearching = true;
    hideStatus();

    resultsBox.innerHTML = `
      <div class="news-empty">${translate("news_loading", "Searching news...")}</div>
    `;

    try {
      const response = await fetch(`${API_BASE}/api/news/search?q=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      renderResults(data);
    } catch (err) {
      console.error(err);
      resultsBox.innerHTML = "";
      showStatus(translate("news_fetch_error", "Error while retrieving news."), true);
    } finally {
      isSearching = false;
    }
  }

  initMap();

  button.addEventListener("click", searchNews);

  input.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      e.preventDefault();
      searchNews();
    }
  });

  document.addEventListener("languageChanged", () => {
    if (resultsBox.querySelector(".news-empty")) {
      renderEmptyState();
    }
  });
});