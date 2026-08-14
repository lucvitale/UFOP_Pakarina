require("dotenv").config();

const { getPool } = require("./config/db");

async function test() {
    const pool = await getPool();

    const [rows] = await pool.query(
        "SELECT * FROM noticias LIMIT 5;"
    );

    console.log(rows);
}

test();