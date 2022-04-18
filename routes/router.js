const { Pool, Client } = require("pg");
const isMobile = require("../lib/device");
require("dotenv").config();

var express = require("express");
var router = express.Router();

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
});

pool.on("error", (err, client) => {
  console.error("Unexpected error on idle client", err);
  process.exit(-1);
});

router.get("/", (req, res, next) => {
  res.send("There are not the droid you're lookin for...");
});

router.post("/saveData", async (req, res, next) => {
  console.log("Received request");
  const agent = req.get('User-Agent');
  console.log(`ID => ${req.body.id}   /   User agent => ${agent}`)

  const client = await pool.connect();
  try {
    const update = await client
      .query("SELECT * from responses where id = $1", [req.body.id])
      .then((res) => res.rows.length > 0)
      .catch(() => false);

    const query = update
      ? `UPDATE responses set ${req.body.question} = $2 where id = $1`
      : `INSERT INTO responses (id, ${req.body.question}) VALUES ($1, $2)`;
    const queryValues = [req.body.id, req.body.response];

    client.query(query, queryValues);

    res.sendStatus(200);
    console.log("Response sent");

    const isDeviceSet = await client
      .query("SELECT device from responses where id = $1", [req.body.id])
      .then((res) => res.rows[0].device !== null)
      .catch(() => false);

    if (!isDeviceSet) {
      console.log("Setting device");
      const device = isMobile(agent) ? "mobile" : "desktop";
      client.query(`UPDATE responses set device = $1 where id = $2`, [device, req.body.id]);
    }

    console.log("Device set");

  } catch (err) {
  } finally {
    console.log("Releasing client");
    client.release();
  }
});

module.exports = router;
