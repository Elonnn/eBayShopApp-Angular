import { Component, Input } from '@angular/core';
import { Item } from '../item.model';

@Component({
  selector: 'app-item-card',
  templateUrl: './item-card.component.html',
  styleUrls: ['./item-card.component.css'],
})
export class ItemCardComponent {
  p: number = 1;
  @Input() displayedItems: Item[] = [];

  onShowDetails() {
    alert('details!');
  }
}
