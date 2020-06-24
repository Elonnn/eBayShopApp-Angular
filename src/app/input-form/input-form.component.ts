import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import { Item } from '../item/item.model';
import { ItemInfoService } from '../item/item-info.service';

@Component({
  selector: 'app-input-form',
  templateUrl: './input-form.component.html',
  styleUrls: ['./input-form.component.css'],
})
export class InputFormComponent implements OnInit {
  submitted = false;
  priceRangeValid = true;
  noMatch = false;
  searchFilters = {
    keywords: null,
    sort_order: 'BestMatch',
    min_price: null,
    max_price: null,

    returns_accepted_only: false,
    free_shipping_only: false,
    shipping_expedited: false,
    condition: [],
  };

  // ngFor will loop in the alphabetic order
  // one option is switch the value and key
  // another option is to self-define a pipe named 'sortBy', then add | sortBy: 'x.value'
  conditionInfo = {
    1000: 'New',
    3000: 'Used',
    4000: 'Very Good',
    5000: 'Good',
    6000: 'Acceptable',
  };

  constructor(
    private http: HttpClient,
    public itemInfoService: ItemInfoService
  ) {}

  ngOnInit(): void {
    this.onReset();
  }

  onSubmit(form: NgForm): void {
    this.submitted = true;

    let MaxPrice = parseFloat(form.value.MaxPrice);
    let MinPrice = parseFloat(form.value.MinPrice);
    if (
      (!isNaN(MinPrice) && MinPrice < 0) ||
      (!isNaN(MaxPrice) && MaxPrice < 0) ||
      (!isNaN(MaxPrice) && !isNaN(MinPrice) && MinPrice > MaxPrice)
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
    this.searchFilters['condition'] = condition;

    let params = JSON.stringify(this.searchFilters);
    this.http
      .get<{ items: Item[] }>(
        'https://ebay-shopping-2.wl.r.appspot.com/api/search?params=' + params
      )
      .subscribe((data) => {
        if (data.items.length === 0) {
          this.noMatch = true;
        } else {
          this.noMatch = false;
        }
        // emit an event with data as parameters
        // this.dataUpdated.emit({itemName: this.searchFilters.keywords, itemData: data.items});
        this.itemInfoService.updateItemInfo(
          this.searchFilters.keywords,
          data.items
        );
      });
  }

  onReset(): void {
    this.submitted = false;
    this.priceRangeValid = true;
    this.noMatch = false;
    // this.dataUpdated.emit({itemName: null, itemData: []});
    this.itemInfoService.updateItemInfo(null, []);

    this.searchFilters.keywords = null;
    this.searchFilters.sort_order = 'BestMatch';
    this.searchFilters.min_price = null;
    this.searchFilters.max_price = null;
    this.searchFilters.returns_accepted_only = false;
    this.searchFilters.free_shipping_only = false;
    this.searchFilters.shipping_expedited = false;
    this.searchFilters.condition = [];
  }
}
