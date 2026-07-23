const { getPool } = require("../config/db");

const SPECIES = {
  FAeg: { name: "Aedes aegypti", sex: "female", vector: true },
  MAeg: { name: "Aedes aegypti", sex: "male", vector: true },
  FAab: { name: "Aedes albopictus", sex: "female", vector: true },
  MAab: { name: "Aedes albopictus", sex: "male", vector: true },
  FCx:  { name: "Culex", sex: "female", vector: false },
  MCx:  { name: "Culex", sex: "male", vector: false },
  Desc: { name: "Unidentified", sex: "unknown", vector: false },
};

// GET /api/sensor/readings
const getReadings = async (req, res, next) => {
  try {
    const pool = await getPool();
    const [rows] = await pool.query("SELECT * FROM sensor_readings ORDER BY id ASC");
    res.json(rows);
  } catch (err) {
    next(err);
  }
};

// GET /api/sensor/summary — une seule requête pour éviter les conflits de tunnel SSH
const getSummary = async (req, res, next) => {
  try {
    const pool = await getPool();
    const [rows] = await pool.query(
      `SELECT species_code, COUNT(*) as count,
              AVG(temperature) as avg_temp, AVG(humidity) as avg_humidity,
              MAX(latitude) as lat, MAX(longitude) as lon
       FROM sensor_readings GROUP BY species_code`
    );

    const species = rows.map((r) => ({
      code: r.species_code,
      count: r.count,
      ...SPECIES[r.species_code],
    }));

    const total = species.reduce((s, x) => s + x.count, 0);
    const vectorCount = species.filter((s) => s.vector).reduce((s, x) => s + x.count, 0);

    // Moyennes pondérées globales
    const avgTemp = rows.reduce((s, r) => s + Number(r.avg_temp) * r.count, 0) / total;
    const avgHum = rows.reduce((s, r) => s + Number(r.avg_humidity) * r.count, 0) / total;

    res.json({
      total,
      vectorCount,
      species,
      avgTemperature: avgTemp.toFixed(1),
      avgHumidity: avgHum.toFixed(1),
      location: { latitude: rows[0].lat, longitude: rows[0].lon },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getReadings, getSummary };
