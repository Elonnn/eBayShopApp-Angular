const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } = require("constants");

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
    .get(constructURL(searchParams))
    .then((response) => {
      res.status(200).json({ items: extractNeededInfo(response.data) });
    })
    .catch((error) => {
      console.log(error);
      res.status(500);
    });
});

app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, "angular", "index.html"));
});

function constructURL(searchParams) {
  let url = `https://svcs.ebay.com/services/search/FindingService/v1?OPERATION-NAME=findItemsAdvanced&SERVICE-VERSION=1.0.0&SECURITY-APPNAME=YilangXu-CSCI571h-PRD-b2eb84a53-40467988&RESPONSE-DATA-FORMAT=JSON&REST-PAYLOAD&paginationInput.entriesPerPage=100`;
  let eBayParams = {
    keywords: searchParams["keywords"],
    sortOrder: searchParams["sortOrder"],
  };

  let filterNum = 0;
  if (searchParams["MinPrice"] !== null) {
    eBayParams["itemFilter(" + filterNum.toString() + ").name"] = "MinPrice";
    eBayParams["itemFilter(" + filterNum.toString() + ").value"] =
      searchParams["MinPrice"];
    eBayParams["itemFilter(" + filterNum.toString() + ").paramName"] =
      "Currency";
    eBayParams["itemFilter(" + filterNum.toString() + ").paramValue"] = "USD";
    filterNum += 1;
  }
  if (searchParams["MaxPrice"] !== null) {
    eBayParams["itemFilter(" + filterNum.toString() + ").name"] = "MaxPrice";
    eBayParams["itemFilter(" + filterNum.toString() + ").value"] =
      searchParams["MaxPrice"];
    eBayParams["itemFilter(" + filterNum.toString() + ").paramName"] =
      "Currency";
    eBayParams["itemFilter(" + filterNum.toString() + ").paramValue"] = "USD";
    filterNum += 1;
  }
  eBayParams["itemFilter(" + filterNum.toString() + ").name"] =
    "ReturnsAcceptedOnly";
  eBayParams["itemFilter(" + filterNum.toString() + ").value"] =
    searchParams["ReturnsAcceptedOnly"];
  filterNum += 1;
  eBayParams["itemFilter(" + filterNum.toString() + ").name"] =
    "FreeShippingOnly";
  eBayParams["itemFilter(" + filterNum.toString() + ").value"] =
    searchParams["FreeShippingOnly"];
  filterNum += 1;
  if (searchParams["shippingExpedited"]) {
    eBayParams["itemFilter(" + filterNum.toString() + ").name"] =
      "ExpeditedShippingType";
    eBayParams["itemFilter(" + filterNum.toString() + ").value"] = "Expedited";
    filterNum += 1;
  }
  let condition = searchParams["condition"];
  if (condition.length > 0) {
    eBayParams["itemFilter(" + filterNum.toString() + ").name"] = "Condition";
    for (var i = 0; i < condition.length; i++) {
      v = condition[i];
      eBayParams[
        "itemFilter(" + filterNum.toString() + ").value(" + i.toString() + ")"
      ] = v;
    }
    filterNum += 1;
  }
  const paramString = new URLSearchParams(eBayParams).toString();
  url += "&" + paramString;
  console.log(url);
  return url;
}

function extractNeededInfo(rawData) {
  if (
    rawData.findItemsAdvancedResponse === undefined ||
    rawData.findItemsAdvancedResponse[0].paginationOutput === undefined ||
    rawData.findItemsAdvancedResponse[0].paginationOutput[0].totalEntries ===
      undefined ||
    rawData.findItemsAdvancedResponse[0].paginationOutput[0].totalEntries[0] ===
      "0"
  ) {
    console.dir(rawData);
    console.log("No matches found!");
    return [];
  }
  let items =
    rawData["findItemsAdvancedResponse"][0]["searchResult"][0]["item"];
  let res = [];
  for (var item of items) {
    try {
      var title = item["title"][0];
      var imageURL = item["galleryURL"][0];
      if (imageURL === undefined || imageURL === null || imageURL === 'https://thumbs1.ebaystatic.com/pict/04040_0.jpg') {
        imageURL = 'https://csci571.com/hw/hw8/images/ebayDefault.png';
      }
      var itemURL = item["viewItemURL"][0];
      var price =
        item["sellingStatus"][0]["convertedCurrentPrice"][0]["__value__"];
      var location = item["location"][0];

      var category = item["primaryCategory"][0]["categoryName"][0];
      var condition = item["condition"][0]["conditionDisplayName"][0];

      var shippingType = item["shippingInfo"][0]["shippingType"][0];
      var shippingCost =
        item["shippingInfo"][0]["shippingServiceCost"][0]["__value__"];
      var shipToLocations = item["shippingInfo"][0]["shipToLocations"][0];
      var isExpedited =
        item["shippingInfo"][0]["expeditedShipping"][0] === "true";
      var oneDayShippingAvailable =
        item["shippingInfo"][0]["oneDayShippingAvailable"][0] === "true";

      var bestOfferEnabled = item["listingInfo"][0]["bestOfferEnabled"][0] === "true";
      var buyItNowAvailable = item["listingInfo"][0]["buyItNowAvailable"][0] === "true";
      var listingType = item["listingInfo"][0]["listingType"][0];
      var gift = item["listingInfo"][0]["gift"][0] === "true";
      var watchCount = item["listingInfo"][0]["watchCount"][0];
    } catch (error) {
      // console.dir(item)
      // console.dir(error)
      continue;
    }
    res.push({
      title: title,
      imageURL: imageURL,
      itemURL: itemURL,
      price: price,
      location: location,

      category: category,
      condition: condition,

      shippingType: shippingType,
      shippingCost: shippingCost,
      shipToLocations: shipToLocations,
      isExpedited: isExpedited,
      oneDayShippingAvailable: oneDayShippingAvailable,

      bestOfferEnabled: bestOfferEnabled,
      buyItNowAvailable: buyItNowAvailable,
      listingType: listingType,
      gift: gift,
      watchCount: watchCount,
    });
  }
  return res;
}

module.exports = app;
