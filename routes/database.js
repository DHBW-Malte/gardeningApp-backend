const express = require("express");
const pool = require("../restApi/db");
const router = express.Router();

router.get("/setup", async (req, res) => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS app_user (
        id SERIAL PRIMARY KEY, 
        username TEXT NOT NULL UNIQUE, 
        email TEXT NOT NULL UNIQUE, 
        pwd_reset_token TEXT, 
        active BOOLEAN DEFAULT FALSE, 
        token_expiring_date TIMESTAMPTZ,
        salt TEXT
      );

      CREATE TABLE IF NOT EXISTS catalog_plant (
        id SERIAL PRIMARY KEY,
        common_name TEXT NOT NULL,
        scientific_name TEXT NOT NULL,
        width INTEGER,
        height INTEGER,
        min_temperature INTEGER,
        max_temperature INTEGER,
        planting_start TEXT,
        planting_end TEXT,
        blooming_start TEXT,
        blooming_end TEXT,
        flower_color TEXT,
        harvest_start TEXT,
        harvest_end TEXT,
        edible_parts TEXT,
        yield TEXT,
        sun_light TEXT,
        water_frequency TEXT,
        feeding_frequency TEXT,
        fertilizer_type TEXT
      );

      CREATE TABLE IF NOT EXISTS garden (
        id SERIAL PRIMARY KEY,
        user_id INTEGER,
        name TEXT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS user_plant (
        id SERIAL PRIMARY KEY,
        nickname TEXT NOT NULL,
        plant_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        garden_id INTEGER NOT NULL,
        date_added TIMESTAMPTZ,
        date_watered DATE,
        harvest_status BOOLEAN DEFAULT FALSE,
        FOREIGN KEY (plant_id) REFERENCES catalog_plant(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE,
        FOREIGN KEY (garden_id) REFERENCES garden(id) ON DELETE CASCADE
      );
    `);

    res.status(200).json({ message: "Tables created successfully" });

  } catch (error) {
    console.error("Error creating tables:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
