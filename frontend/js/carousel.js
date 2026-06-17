// carousel.js — Infinite loop carousel

const cards = [
  {
    titleKey: "nav_news",
    descKey: "home_module_news",
    href: "pages/news.html"
  },
  {
    titleKey: "nav_climate",
    descKey: "home_module_climate",
    href: "pages/climate.html"
  },
  {
    titleKey: "nav_awareness",
    descKey: "home_module_awareness",
    href: "pages/awareness.html"
  },
  {
    titleKey: "nav_dashboard",
    descKey: "home_module_dashboard",
    href: "pages/dashboard.html"
  }
];

let current = 0;

function buildCarousel() {
  const track = document.getElementById("carousel-track");
  const dots = document.getElementById("carousel-dots");
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
    dot.className = "carousel-dot" + (i === 0 ? " active" : "");
    dot.onclick = () => goTo(i);
    dots.appendChild(dot);
  });
}

function goTo(index) {
  current = (index + cards.length) % cards.length;
  const track = document.getElementById("carousel-track");
  const card = track.querySelector(".module-card");
  const cardWidth = card.offsetWidth + 16;
  track.style.transform = `translateX(-${current * cardWidth}px)`;
  document.querySelectorAll(".carousel-dot").forEach((d, i) => {
    d.classList.toggle("active", i === current);
  });
}

function slideCarousel(dir) {
  goTo(current + dir);
}

window.addEventListener("load", () => {
  buildCarousel();
  if (typeof applyTranslations === "function") {
    applyTranslations(currentLang);
  }
});