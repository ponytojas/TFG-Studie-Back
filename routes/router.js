const { Client } = require("pg");
require("dotenv").config();

var express = require("express");
var router = express.Router();

router.get("/", (req, res, next) => {
  res.sendStatus(200);
  return "There are not the droid you're lookin for.";
});

router.post("/saveData", async (req, res, next) => {
  console.log("Received request");

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  let update = await client
    .query("SELECT * from responses where id = $1", [req.body.id])
    .then((res) => res.rows.length > 0)
    .catch(() => false);

  let query = update
    ? `UPDATE responses set ${req.body.question} = $2 where id = $1`
    : `INSERT INTO responses (id, ${req.body.question}) VALUES ($1, $2)`;
  let values = [req.body.id, req.body.response];

  client.query(query, values);

  client.end();

  res.sendStatus(200);
});

module.exports = router;
