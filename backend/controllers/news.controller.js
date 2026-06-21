// =============================================================================
// CONTROLLER: news.controller.js
// DESCRIÇÃO:
// Lê a tabela `noticias` (preenchida pelo scraper buscador.py do colega,
// que já roda no servidor da universidade). Não faz scraping aqui —
// apenas leitura e formatação da resposta para o frontend.
// =============================================================================

const { getPool } = require("../config/db");
const { logger } = require("../config/logger");

// -----------------------------------------------------------------------------
// GET /api/news?city=Rio
// -----------------------------------------------------------------------------
// NOTA: nomes de coluna (titulo, link, jornal, data_publicacao, lat, lon,
// local_nome) seguem estrutura_banco_sql.txt. Confirmar com "DESCRIBE noticias;"
// no servidor real e ajustar se necessário.
// -----------------------------------------------------------------------------
async function getNewsByCity(req, res, next) {
  try {
    const { city } = req.query;

    if (!city || city.trim().length === 0) {
      return res.status(400).json({ error: "City parameter is required" });
    }

    const pool = await getPool();
    const searchTerm = `%${city.trim()}%`;

    const [rows] = await pool.query(
      `SELECT
         id,
         titulo,
         link,
         jornal,
         data_publicacao AS data,
         lat,
         lon,
         local_nome,
         termo_busca,
         momento_coleta,
         resumo
       FROM noticias
       WHERE local_nome LIKE ?
       ORDER BY momento_coleta DESC
       LIMIT 100`,
      [searchTerm]
    );

    logger.info("News search by city", { city: city.trim(), count: rows.length });

    return res.status(200).json({
      city: city.trim(),
      count: rows.length,
      results: rows,
    });
  } catch (err) {
    next(err);
  }
}

// -----------------------------------------------------------------------------
// GET /api/news/nearby?lat=-22.90&lon=-43.17&radius=50
// Variante por geolocalização (raio em km), útil para clique no mapa.
// -----------------------------------------------------------------------------
async function getNewsNearby(req, res, next) {
  try {
    const { lat, lon, radius } = req.query;

    if (!lat || !lon) {
      return res.status(400).json({ error: "lat and lon parameters are required" });
    }

    const radiusKm = radius ? parseFloat(radius) : 50;
    const pool = await getPool();

    const [rows] = await pool.query(
      `SELECT
         id,
         titulo,
         link,
         jornal,
         data_publicacao AS data,
         lat,
         lon,
         local_nome,
         resumo,
         (6371 * ACOS(
            COS(RADIANS(?)) * COS(RADIANS(lat)) *
            COS(RADIANS(lon) - RADIANS(?)) +
            SIN(RADIANS(?)) * SIN(RADIANS(lat))
         )) AS distancia_km
       FROM noticias
       HAVING distancia_km <= ?
       ORDER BY distancia_km ASC, momento_coleta DESC
       LIMIT 100`,
      [parseFloat(lat), parseFloat(lon), parseFloat(lat), radiusKm]
    );

    logger.info("News search nearby", { lat, lon, radiusKm, count: rows.length });

    return res.status(200).json({
      center: { lat: parseFloat(lat), lon: parseFloat(lon) },
      radius_km: radiusKm,
      count: rows.length,
      results: rows,
    });
  } catch (err) {
    next(err);
  }
}

// -----------------------------------------------------------------------------
// GET /api/news/cities
// Retorna a lista de cidades distintas presentes na tabela noticias.
// Útil para sugerir cidades disponíveis quando uma busca não retorna nada.
// -----------------------------------------------------------------------------
async function getAvailableCities(req, res, next) {
  try {
    const pool = await getPool();

    const [rows] = await pool.query(
      `SELECT DISTINCT local_nome
       FROM noticias
       WHERE local_nome IS NOT NULL AND local_nome != ''
       ORDER BY local_nome ASC`
    );

    const cities = rows.map((r) => r.local_nome);

    return res.status(200).json({ cities });
  } catch (err) {
    next(err);
  }
}

module.exports = { getNewsByCity, getNewsNearby, getAvailableCities };