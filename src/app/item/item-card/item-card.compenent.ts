import { Component } from '@angular/core';
import { Item } from '../item.model';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-item-card',
  templateUrl: './item-card.component.html',
  styleUrls: ['./item-card.component.css']
})
export class ItemCardComponent {
  p: number = 1;
  items: Item[];

  constructor(private http: HttpClient) {}

  getItems() {
    this.http.get<{message: string, items: Item[]}>('http://localhost:3000/api/search')
    .subscribe((rawData) => {
      this.items = rawData.items;
    });
  }

  ngOnInit() {
    this.getItems();
  }

  onShowDetails() {
    alert('details!')
  }

}
