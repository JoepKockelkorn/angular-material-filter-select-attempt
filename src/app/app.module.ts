import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule, MatProgressSpinnerModule, MatFormFieldModule, MatInputModule } from '@angular/material'
import { MatIconModule } from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { HelloComponent } from './hello.component';
import { FilterSelectComponent } from './filter-select/filter-select.component';

@NgModule({
  imports: [BrowserModule, FormsModule, MatAutocompleteModule, MatProgressSpinnerModule, MatFormFieldModule, ReactiveFormsModule, MatInputModule, BrowserAnimationsModule, MatIconModule],
  declarations: [AppComponent, HelloComponent, FilterSelectComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
