const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } = require("constants");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/", express.static(path.join(__dirname, "angular")));  // permit index.html to get js files

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

app.get("/api/search/:searchParams", (req, res, next) => {
  let searchParams = JSON.parse(req.params.searchParams);
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
      var condition = item["condition"][0]["conditionDisplayName"][0];
      var category = item["primaryCategory"][0]["categoryName"][0];
      var itemURL = item["viewItemURL"][0];
      var price =
        item["sellingStatus"][0]["convertedCurrentPrice"][0]["__value__"];
      var shippingPrice =
        item["shippingInfo"][0]["shippingServiceCost"][0]["__value__"];
      var location = item["location"][0];
      var isReturnAccepted = item["returnsAccepted"][0] === "true";
      var isTopRated = item["topRatedListing"][0] === "true";
      var isExpedited =
        item["shippingInfo"][0]["expeditedShipping"][0] === "true";
      var imageURL = item["galleryURL"][0];
    } catch (error) {
      // console.dir(item)
      // console.dir(error)
      continue;
    }
    res.push({
      title: title,
      condition: condition,
      category: category,
      itemURL: itemURL,
      price: price,
      shippingPrice: shippingPrice,
      location: location,
      isReturnAccepted: isReturnAccepted,
      isTopRated: isTopRated,
      isExpedited: isExpedited,
      imageURL: imageURL,
    });
  }
  return res;
}

module.exports = app;
