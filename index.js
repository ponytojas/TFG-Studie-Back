(async () => {
  const cors = require("cors");
  const router = require("./routes/router.js");
  const express = require("express");

  const app = express(); //instancia de express
  const PORT = 4000;
  app.use(cors());

  app.use(express.json());

  app.use(router);
  const server = require("http").createServer(app);

  server.listen(PORT, () => {
    console.log(`express is running on port ${PORT}.\r`);
  });
})();
