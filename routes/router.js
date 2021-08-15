const { Pool, Client } = require("pg");
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

router.get("/", (req, res, next) => {
  res.send("There are not the droid you're lookin for...");
});

router.post("/saveData", async (req, res, next) => {
  try{
    console.log("Received request");

    const client = await pool.connect();

    let update = await client
      .query("SELECT * from responses where id = $1", [req.body.id])
      .then((res) => res.rows.length > 0)
      .catch(() => false);

    let query = update
      ? `UPDATE responses set ${req.body.question} = $2 where id = $1`
      : `INSERT INTO responses (id, ${req.body.question}) VALUES ($1, $2)`;
    let values = [req.body.id, req.body.response];

    client.query(query, values);

    res.sendStatus(200);
  } catch(err) { }
  finally{
    client.release();
  }
});

module.exports = router;
