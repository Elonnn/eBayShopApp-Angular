import { Component, OnInit } from '@angular/core';
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
  selectedValue: string;
  items: Item[];
  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.onReset();
  }

  onSubmit(form: NgForm): void {
    this.submitted = true;
    if (form.invalid) return;
    let upperPriceLimit = parseFloat(form.value.upperPriceLimit);
    let lowerPriceLimit = parseFloat(form.value.lowerPriceLimit);
    if (
      (!isNaN(lowerPriceLimit)) && lowerPriceLimit < 0 ||
      (!isNaN(upperPriceLimit)) && upperPriceLimit < 0 ||
      (!isNaN(upperPriceLimit)) && (!isNaN(lowerPriceLimit)) && lowerPriceLimit > upperPriceLimit
    ) {
      this.priceRangeValid = false;
      return;
    } else {
      this.priceRangeValid = true;
    }

    let condition = [];
    if (form.value.condition1000) condition.push('1000');
    if (form.value.condition3000) condition.push('3000');
    if (form.value.condition4000) condition.push('4000');
    if (form.value.condition5000) condition.push('5000');
    if (form.value.condition6000) condition.push('6000');

    let searchFilters = {
      "keywords": form.value.keywords,
      "sortOrder": this.selectedValue,
      "MinPrice": lowerPriceLimit,
      "MaxPrice": upperPriceLimit,

      "ReturnsAcceptedOnly": form.value.returnAccepted,
      "FreeShippingOnly": form.value.shippingFree,
      "shippingExpedited": form.value.shippingExpedited,
      "condition": condition,
    }

    let params = JSON.stringify(searchFilters);
    this.http.get<{message: string, items: Item[]}>('http://localhost:3000/api/search/' + params)
    .subscribe((rawData) => {
      this.items = rawData.items;
    });
  }

  onReset(): void {
    this.submitted = false;
    this.priceRangeValid = true;
  }
}
