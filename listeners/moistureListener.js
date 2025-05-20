const { Client } = require("pg");
const { notifyClients } = require("../sockets/socketHandler");
require("dotenv").config();

const pgClient = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

pgClient.connect()
    .then(() => {
        console.log("Connected to PostgreSQL LISTEN client.");
        pgClient.query("LISTEN moisture_channel");
    })
    .catch(err => console.error("Error connecting to PostgreSQL:", err.message));

pgClient.on("notification", (msg) => {
    if (msg.channel === "moisture_channel") {
        const payload = JSON.parse(msg.payload || "{}");
        console.log("[DB Trigger] New moisture value:", payload);

        notifyClients(payload.user_id, {
            type: "MOISTURE_UPDATE",
            sensorId: payload.sensorId,
            moisture_level: payload.moisture_level,
            interpreted_level: payload.interpreted_moisture_level,
        });
    }
});
