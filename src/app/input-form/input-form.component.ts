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
  submitted= false;
  priceRangeValid=true;
  noMatch=false;
  fetchedItems: Item[] = [];
  searchFilters = {
  "keywords": null,
  "sortOrder": 'BestMatch',
  "MinPrice": null,
  "MaxPrice": null,

  "ReturnsAcceptedOnly": false,
  "FreeShippingOnly": false,
  "shippingExpedited": false,
  "condition": [],
};
  @Output() dataFetched = new EventEmitter<Item[]>();

  // ngFor will loop in the alphabetic order
  // one option is switch the value and key
  // another option is to self-define a pipe named 'sortBy', then add | sortBy: 'x.value'
  conditionInfo = {
    1000: 'New',
    3000: 'Used',
    4000: 'Very Good',
    5000: 'Good',
    6000: 'Acceptable',
  }

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
    for (var x of Object.keys(this.conditionInfo)) {
      if (form.value['condition' + x]) {
        condition.push(x);
      }
    }
    this.searchFilters["condition"] = condition;

    let params = JSON.stringify(this.searchFilters);
    this.http.get<{items: Item[]}>('https://ebay-shopping-2.wl.r.appspot.com/api/search?params=' + params)
    .subscribe((data) => {
      if (data.items.length === 0){
        this.noMatch = true;
      } else {
        this.noMatch = false;
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

    this.searchFilters.keywords = null;
    this.searchFilters.sortOrder = 'BestMatch';
    this.searchFilters.MinPrice = null;
    this.searchFilters.MaxPrice = null;
    this.searchFilters.ReturnsAcceptedOnly = false;
    this.searchFilters.FreeShippingOnly = false;
    this.searchFilters.shippingExpedited = false;
    this.searchFilters.condition = [];
  }
}
