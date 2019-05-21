import { Component, OnInit, Input, forwardRef, Output, EventEmitter, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatAutocompleteTrigger } from '@angular/material';
import { Subject } from 'rxjs';
import { takeUntil, filter, debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';

@Component({
  selector: 'app-filter-select',
  templateUrl: './filter-select.component.html',
  styleUrls: ['./filter-select.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FilterSelectComponent),
      multi: true,
    },
  ],
})
export class FilterSelectComponent implements AfterViewInit, ControlValueAccessor {
  @Input() placeholder = 'placeholder';
  @Input() items: any[] = [];
  @Input() bindLabel = '';
  @Input() bindValue = '';
  @Input() searching = false;
  @Input() debounceInMs = 300;
  @Input() showClearButton = true;

  @Output() filter = new EventEmitter<string>();
  @ViewChild('filter') inputRef: ElementRef;

  onChange: (value: any) => void;
  onTouched: () => void;
  destroyed$ = new Subject();
  focus = false;

  ctrl = new FormControl;
  inputCtrl = new FormControl();

  ngAfterViewInit(): void {
    this.ctrl.valueChanges.pipe(distinctUntilChanged(), takeUntil(this.destroyed$)).subscribe(value => this.onChange(value));
    this.inputCtrl.valueChanges
      .pipe(
        filter(search => !!search),
        debounceTime(this.debounceInMs),
        takeUntil(this.destroyed$),
      )
      .subscribe(value => {
        if (this.focus) {
          this.filter.emit(value);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  writeValue(value: any): void {
    this.ctrl.setValue(value, { emitEvent: false });
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.ctrl.disable({ emitEvent: false });
    } else {
      this.ctrl.enable({ emitEvent: false });
    }
  }

  onBlur(): void {
    console.log("blurred")
    this.focus = false;
    const items = this.items || [];
    const valuesToLookIn = items.map(o => this.getValue(o));
    // console.log(valuesToLookIn);
    // console.log(this.ctrl.value);
    const needle = valuesToLookIn.find(e => e === this.ctrl.value);

    if (!needle) {
      // is a select?
      this.inputCtrl.reset(null);
      this.ctrl.reset(null);
    } else {
      this.inputCtrl.reset(this.getLabel(needle));
      this.ctrl.setValue(needle);
    }
    this.onTouched();
  }

  onFocus() {
    console.log('focuses');
    this.focus = true;
  }

  onSelect(event: any) {
    console.log('select', event);
    this.inputCtrl.setValue(this.getLabel(event.option.value));
    this.ctrl.setValue(event.option.value);

    // doesn't work:
    // event.preventDefault();
  }

  clearValue(event: Event) {
    event.stopPropagation();
    this.ctrl.reset(null);
    this.inputCtrl.reset('');
    this.inputRef.nativeElement.focus();
  }

  getLabel(option: any): string {
    if (!option) throw new Error('option is false');
    if (!this.bindLabel && typeof option === 'string') {
      return option;
    }
    if (!this.bindLabel) {
      throw new Error('please specify the bindLabel Input');
    }
    if (!option.hasOwnProperty(this.bindLabel)) {
      throw new Error(`option does not have prop ${this.bindLabel}`);
    }
    return option[this.bindLabel];
  }

  getValue(option: any): string | number {
    if (!option) throw new Error('option is false');
    if (!this.bindValue) {
      return option;
    }
    if (!option.hasOwnProperty(this.bindValue)) {
      throw new Error(`option does not have prop ${this.bindValue}`);
    }
    return option[this.bindValue];
  }
}