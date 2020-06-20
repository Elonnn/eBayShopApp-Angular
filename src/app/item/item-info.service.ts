import { Item } from './item.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ItemInfoService {
  itemName: string = '';
  itemData: Item[] = [];

  private itemInfoUpdated = new Subject<{
    itemName: string;
    itemData: Item[];
  }>();

  getItemUpdateListener() {
    return this.itemInfoUpdated.asObservable();
  }

  updateItemInfo(itemName: string, itemData: Item[]) {
    this.itemName = itemName;
    this.itemData = itemData;
    this.itemInfoUpdated.next({
      itemName: this.itemName,
      itemData: [...this.itemData],
    });
  }
}
