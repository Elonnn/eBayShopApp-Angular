const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } = require("constants");
const tools = require("./eBay.js");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/", express.static(path.join(__dirname, "angular"))); // permit index.html to get js files

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  );
  next();
});

app.get("/api/search", (req, res, next) => {
  let searchParams = JSON.parse(req.query.params)
  console.log(searchParams);

  axios
    .get(tools.constructURL(searchParams))
    .then((response) => {
      res.status(200).json({ items: tools.extractNeededInfo(response.data) });
    })
    .catch((error) => {
      console.log(error);
      res.status(500);
    });
});

app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, "angular", "index.html"));
});

module.exports = app;
