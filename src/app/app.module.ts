import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ItemCardComponent } from './item/item-card/item-card.compenent';

import { NgxPaginationModule } from 'ngx-pagination';
import { InputFormComponent } from './input-form/input-form.component';

@NgModule({
  declarations: [AppComponent, ItemCardComponent, InputFormComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NgxPaginationModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
