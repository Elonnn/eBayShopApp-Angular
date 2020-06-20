import { Component, OnInit, OnDestroy } from '@angular/core';
import { Item } from '../item.model';
import { ItemInfoService } from '../item-info.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-item-card',
  templateUrl: './item-card.component.html',
  styleUrls: ['./item-card.component.css'],
})
export class ItemCardComponent implements OnInit, OnDestroy {
  p: number = 1;
  displayedItemsInfo: { itemName: string; itemData: Item[] };

  private itemInfoSub: Subscription;
  constructor(public itemInfoService: ItemInfoService) {}

  ngOnInit() {
    this.displayedItemsInfo = { itemName: null, itemData: [] };
    this.itemInfoSub = this.itemInfoService
      .getItemUpdateListener()
      .subscribe((itemInfo: { itemName: string; itemData: Item[] }) => {
        this.displayedItemsInfo = itemInfo;
      });
  }

  ngOnDestroy() {
    this.itemInfoSub.unsubscribe();
  }

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
