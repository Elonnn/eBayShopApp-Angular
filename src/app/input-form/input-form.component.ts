import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import { Item } from '../item/item.model';


@Component({
  selector: 'app-input-form',
  templateUrl: './input-form.component.html',
  styleUrls: ['./input-form.component.css'],
})
export class InputFormComponent implements OnInit {
  submitted: boolean;
  priceRangeValid: boolean;
  noMatch: boolean;
  fetchedItems: Item[] = [];
  searchFilters = {
    "keywords": null,
    "sortOrder": null,
    "MinPrice": null,
    "MaxPrice": null,

    "ReturnsAcceptedOnly": false,
    "FreeShippingOnly": false,
    "shippingExpedited": false,
    "condition": [],
  }
  @Output() dataFetched = new EventEmitter<Item[]>();

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.onReset();
  }

  onSubmit(form: NgForm): void {
    this.submitted = true;

    let MaxPrice = parseFloat(form.value.MaxPrice);
    let MinPrice = parseFloat(form.value.MinPrice);
    if (
      (!isNaN(MinPrice)) && MinPrice < 0 ||
      (!isNaN(MaxPrice)) && MaxPrice < 0 ||
      (!isNaN(MaxPrice)) && (!isNaN(MinPrice)) && MinPrice > MaxPrice
    ) {
      this.priceRangeValid = false;
      return;
    } else {
      this.priceRangeValid = true;
    }
    if (form.invalid) return;

    let condition = [];
    if (form.value.condition1000) condition.push('1000');
    if (form.value.condition3000) condition.push('3000');
    if (form.value.condition4000) condition.push('4000');
    if (form.value.condition5000) condition.push('5000');
    if (form.value.condition6000) condition.push('6000');
    this.searchFilters["condition"] = condition;

    let params = JSON.stringify(this.searchFilters);
    this.http.get<{items: Item[]}>('https://ebay-shopping-2.wl.r.appspot.com/api/search?params=' + params)
    .subscribe((data) => {
      if (data.items.length === 0){
        this.noMatch = true;
      }
      this.fetchedItems = data.items;
      // emit an event with data as parameters
      this.dataFetched.emit(this.fetchedItems);
    });
  }

  onReset(): void {
    this.submitted = false;
    this.priceRangeValid = true;
    this.noMatch = false;
    this.fetchedItems = [];
    this.dataFetched.emit(this.fetchedItems);
    this.searchFilters = {
    "keywords": null,
    "sortOrder": 'BestMatch',
    "MinPrice": null,
    "MaxPrice": null,

    "ReturnsAcceptedOnly": false,
    "FreeShippingOnly": false,
    "shippingExpedited": false,
    "condition": [],
  }
  }
}
