import { Component, Input } from '@angular/core';
import { Item } from '../item.model';

@Component({
  selector: 'app-item-card',
  templateUrl: './item-card.component.html',
  styleUrls: ['./item-card.component.css'],
})
export class ItemCardComponent {
  p: number = 1;
  @Input() displayedItemsInfo: {itemName: string, itemData: Item[]};

  basicInfo = {
    'Category Name': 'category',
    Condition: 'condition',
  };

  shippingInfo = {
    'Shipping Type': 'shippingType',
    'Shipping Cost': 'shippingCost',
    'Ship To Locations': 'shipToLocations',
    'Expedited Shipping': 'isExpedited',
    'One Day Shipping Available': 'oneDayShippingAvailable',
  };

  listingInfo = {
    'Best Offer Enabled': 'bestOfferEnabled',
    'Buy It Now Available': 'buyItNowAvailable',
    'Listing Type': 'listingType',
    Gift: 'gift',
    'Watch Count': 'watchCount',
  };
}
