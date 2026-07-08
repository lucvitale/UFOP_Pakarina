# Advanced Environmental Analysis — Dengue Proliferation Model

**Module:** Climate / Environmental Analysis
**Sprint:** Sprint 3
**Author:** RB (Raphael)

---

## Objective

Refine the dengue proliferation risk model, improve environmental indicators, and document the scientific basis and data sources.

---

## 1. Improved Environmental Indicators

The model analyzes four environmental variables retrieved in real time from the OpenWeatherMap API:

| Indicator | Source | Unit |
|-----------|--------|------|
| Temperature | OpenWeatherMap | °C |
| Relative humidity | OpenWeatherMap | % |
| Wind speed | OpenWeatherMap | m/s |
| Precipitation (1h) | OpenWeatherMap | mm |

---

## 2. Refined Proliferation Model

The initial model used coarse binary thresholds. The refined model uses **continuous scoring** with finer bands, based on entomological research on *Aedes aegypti* (the primary dengue vector).

### Temperature scoring
| Range | Score | Reasoning |
|-------|-------|-----------|
| 25–30°C | +3 | Optimal range for survival and reproduction |
| 30–35°C | +2 | Still favorable |
| 20–25°C | +1.5 | Increasing activity |
| 35–40°C | +1 | Survival drops sharply |
| 10–20°C | +0.5 | Activity slowed |
| <10°C or >40°C | 0 | Larvae/adults do not survive |

### Humidity scoring
| Range | Score | Reasoning |
|-------|-------|-----------|
| ≥60% | +2 | Clearly favors survival and breeding |
| 40–60% | +1 | Partially favorable |
| <40% | 0 | Dry air is unfavorable |

### Wind scoring
| Range | Score | Reasoning |
|-------|-------|-----------|
| <3 m/s | +1 | Mosquitoes fly and feed normally |
| 3–5 m/s | +0.5 | Flight partially disrupted |
| >5 m/s | 0 | Flight and feeding strongly disrupted |

### Precipitation scoring
| Range | Score | Reasoning |
|-------|-------|-----------|
| >20 mm | +1.5 | Strongly increases breeding sites |
| 5–20 mm | +1 | Creates stagnant water |
| 0–5 mm | +0.5 | Minor water accumulation |

### Risk levels (total score, max ~7.5)
| Score | Level | Color |
|-------|-------|-------|
| ≥5 | High Risk | Red |
| 2.5–5 | Medium Risk | Orange |
| <2.5 | Low Risk | Green |

---

## 3. Scientific Basis (Data Sources Expanded)

The thresholds are derived from entomological research, not invented:

- Optimal development range 25–30°C, mortality above 40°C — Reiskind & Zarrabi (2012); Frontiers in Cellular and Infection Microbiology (2023)
- Optimal range for development, longevity and fecundity 22–32°C — Marinho et al. (2016), Journal of Vector Ecology
- Highest egg-hatching at 25°C; larvae die past first instar at 40°C — Sok et al., Parasites & Vectors
- Positive correlation between humidity and vector density — PLOS ONE / PMC (Colombia study)
- Wind disrupts flight/feeding behavior (behavioral, not lethal)
- Moderate rain creates breeding sites; heavy rain can flush larvae — systematic review, PMC

Full reference list is maintained in the project README (Dengue Risk Logic section).

---

## 4. Extended Analytical Capabilities

- Continuous scoring replaces binary thresholds → finer risk gradation
- Each indicator now has its own contextual hint message (temp, humidity, wind, precipitation)
- Visual bars reflect each variable's contribution to risk
- Risk analysis available by city search or GPS location
- Fully multilingual (EN/FR/ES/PT)

---

## 5. Future Improvements

- Historical trend analysis (requires storing past readings)
- Multi-day forecast integration
- Correlation with real dengue case data from the database
- Additional weather sources for cross-validation

---

*Last updated: Sprint 3 — Advanced Environmental Analysis*
