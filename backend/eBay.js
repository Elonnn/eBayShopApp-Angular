module.exports = {
  constructURL: function (searchParams) {
    let url = `https://svcs.ebay.com/services/search/FindingService/v1?OPERATION-NAME=findItemsAdvanced&SERVICE-VERSION=1.0.0&SECURITY-APPNAME=YilangXu-CSCI571h-PRD-b2eb84a53-40467988&RESPONSE-DATA-FORMAT=JSON&REST-PAYLOAD&paginationInput.entriesPerPage=100`;

    let eBayParams = {
      keywords: searchParams["keywords"],
      sortOrder: searchParams["sort_order"],
    };

    let filterNum = 0;
    if (
      searchParams["min_price"] !== null &&
      searchParams["min_price"] !== undefined
    ) {
      eBayParams["itemFilter(" + filterNum.toString() + ").name"] = "MinPrice";
      eBayParams["itemFilter(" + filterNum.toString() + ").value"] =
        searchParams["min_price"];
      eBayParams["itemFilter(" + filterNum.toString() + ").paramName"] =
        "Currency";
      eBayParams["itemFilter(" + filterNum.toString() + ").paramValue"] = "USD";
      filterNum += 1;
    }
    if (
      searchParams["max_price"] !== null &&
      searchParams["max_price"] !== undefined
    ) {
      eBayParams["itemFilter(" + filterNum.toString() + ").name"] = "MaxPrice";
      eBayParams["itemFilter(" + filterNum.toString() + ").value"] =
        searchParams["max_price"];
      eBayParams["itemFilter(" + filterNum.toString() + ").paramName"] =
        "Currency";
      eBayParams["itemFilter(" + filterNum.toString() + ").paramValue"] = "USD";
      filterNum += 1;
    }
    if (searchParams.returns_accepted_only === true) {
      eBayParams["itemFilter(" + filterNum.toString() + ").name"] =
        "ReturnsAcceptedOnly";
      eBayParams["itemFilter(" + filterNum.toString() + ").value"] =
        searchParams.returns_accepted_only;
      filterNum += 1;
    }
    if (searchParams.free_shipping_only === true) {
      eBayParams["itemFilter(" + filterNum.toString() + ").name"] =
        "FreeShippingOnly";
      eBayParams["itemFilter(" + filterNum.toString() + ").value"] =
        searchParams.free_shipping_only;
      filterNum += 1;
    }
    if (searchParams["shipping_expedited"] === true) {
      eBayParams["itemFilter(" + filterNum.toString() + ").name"] =
        "ExpeditedShippingType";
      eBayParams["itemFilter(" + filterNum.toString() + ").value"] =
        "Expedited";
      filterNum += 1;
    }
    let condition = searchParams["condition"];
    if (condition !== undefined && condition.length > 0) {
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
  },

  extractItemsInfo: function (rawData, maxReturnedItemNum) {
    if (
      rawData.findItemsAdvancedResponse === undefined ||
      rawData.findItemsAdvancedResponse[0].paginationOutput === undefined ||
      rawData.findItemsAdvancedResponse[0].paginationOutput[0].totalEntries ===
        undefined ||
      rawData.findItemsAdvancedResponse[0].paginationOutput[0]
        .totalEntries[0] === "0"
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
        var productID = item["itemId"][0];
        var title = item["title"][0];
        var imageURL = item["galleryURL"][0];
        if (
          imageURL === undefined ||
          imageURL === null ||
          imageURL === "https://thumbs1.ebaystatic.com/pict/04040_0.jpg"
        ) {
          imageURL = "https://elonnn.github.io/hw-assets/img/ebayDefault.png";
        }
        var itemURL = item["viewItemURL"][0];
        var price =
          item["sellingStatus"][0]["convertedCurrentPrice"][0]["__value__"];
        var location = item["location"][0];
        var isTopRated = item["topRatedListing"][0] === "true";

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

        var shippingInfo = item["shippingInfo"][0];
        delete shippingInfo["shippingServiceCost"];
        for (var key of Object.keys(shippingInfo)) {
          shippingInfo[key] = shippingInfo[key][0];
        }

        var bestOfferEnabled =
          item["listingInfo"][0]["bestOfferEnabled"][0] === "true";
        var buyItNowAvailable =
          item["listingInfo"][0]["buyItNowAvailable"][0] === "true";
        var listingType = item["listingInfo"][0]["listingType"][0];
        var gift = item["listingInfo"][0]["gift"][0] === "true";
        var watchCount = item["listingInfo"][0]["watchCount"][0];
      } catch (error) {
        // console.dir(item)
        // console.dir(error)
        continue;
      }
      res.push({
        productID: productID,
        title: title,
        imageURL: imageURL,
        itemURL: itemURL,
        price: price,
        location: location,
        isTopRated: isTopRated,

        category: category,
        condition: condition,

        shippingType: shippingType,
        shippingCost: shippingCost,
        shipToLocations: shipToLocations,
        isExpedited: isExpedited,
        oneDayShippingAvailable: oneDayShippingAvailable,
        shippingInfo: shippingInfo,

        bestOfferEnabled: bestOfferEnabled,
        buyItNowAvailable: buyItNowAvailable,
        listingType: listingType,
        gift: gift,
        watchCount: watchCount,
      });
      if (
        maxReturnedItemNum !== undefined &&
        res.length >= maxReturnedItemNum
      ) {
        return res;
      }
    }
    return res;
  },

  extractItemInfo: function (rawData) {
    let res = {};
    if (!rawData.Item) {
      console.dir(rawData)
      return res;
    }

    res.pictureURLs = rawData.Item.PictureURL;
    res.brand = null;
    res.specifications = {};
    let nameValueList = rawData.Item.ItemSpecifics.NameValueList;
    if (nameValueList) {
      for (var obj of nameValueList) {
        if (obj.Name === "Brand") {
          res.brand = obj.Value;
        } else {
          res.specifications[obj.Name] = obj.Value;
        }
      }
    }
    res.subtitle = rawData.Item.Subtitle;
    res.sellerInfo = rawData.Item.Seller;
    res.returnPolicies = rawData.Item.ReturnPolicy;

    return res;
  },
};
