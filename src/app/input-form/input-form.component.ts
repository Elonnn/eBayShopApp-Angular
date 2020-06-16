import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-input-form',
  templateUrl: './input-form.component.html',
  styleUrls: ['./input-form.component.css'],
})
export class InputFormComponent implements OnInit {
  submitted: boolean;
  priceRangeValid: boolean;
  constructor() {}

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
    console.dir(form.value.condition)

  }

  onReset(): void {
    this.submitted = false;
    this.priceRangeValid = true;
  }
}
