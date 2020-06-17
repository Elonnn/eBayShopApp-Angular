import { Component } from '@angular/core';

import { Item } from './item/item.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'shopApp';
  items : Item[];
  onDataFetched(items: Item[]) {
    this.items = items;
  }
}
