export interface Item {
  title: string,
  imageURL: string,
  itemURL: string,
  price: string,
  location: string,

  category: string,
  condition: string,

  shippingType: string,
  shippingCost: string,
  shipToLocations: string,
  isExpedited: boolean,
  oneDayShippingAvailable: boolean,

  bestOfferEnabled: boolean,
  buyItNowAvailable: boolean,
  listingType: string,
  gift: boolean,
  watchCount: string
}
