const cards = [
  {
    titleKey: "nav_news",
    descKey: "home_module_news",
    href: "pages/news.html",
  },
  {
    titleKey: "nav_climate",
    descKey: "home_module_climate",
    href: "pages/climate.html",
  },
  {
    titleKey: "nav_awareness",
    descKey: "home_module_awareness",
    href: "pages/awareness.html",
  },
  {
    titleKey: "nav_dashboard",
    descKey: "home_module_dashboard",
    href: "pages/dashboard.html",
  },
];

let current = 0;

function buildCarousel() {
  const track = document.getElementById("carousel-track");
  const dots = document.getElementById("carousel-dots");

  if (!track || !dots) return;

  track.innerHTML = "";
  dots.innerHTML = "";

  cards.forEach((card, i) => {
    const a = document.createElement("a");

    a.href = card.href;
    a.className = "module-card";

    a.innerHTML = `
      <h3 data-i18n="${card.titleKey}"></h3>
      <p data-i18n="${card.descKey}"></p>
    `;

    track.appendChild(a);

    const dot = document.createElement("span");

    dot.className = "carousel-dot" + (i === current ? " active" : "");

    dot.onclick = () => goTo(i);

    dots.appendChild(dot);
  });
}

function goTo(index) {
  current = (index + cards.length) % cards.length;

  const track = document.getElementById("carousel-track");
  const card = track?.querySelector(".module-card");

  if (!track || !card) return;

  const cardWidth = card.offsetWidth + 16;

  track.style.transform = `translateX(-${current * cardWidth}px)`;

  document.querySelectorAll(".carousel-dot").forEach((dot, i) => {
    dot.classList.toggle("active", i === current);
  });
}

function slideCarousel(direction) {
  goTo(current + direction);
}

window.addEventListener("load", () => {
  buildCarousel();

  // Apply the current language after the cards have been created.
  if (typeof applyTranslations === "function") {
    applyTranslations(currentLang);
  }
});