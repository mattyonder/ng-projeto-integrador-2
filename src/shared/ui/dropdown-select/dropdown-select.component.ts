import { CommonModule } from '@angular/common';
import { Component, Input, forwardRef } from '@angular/core';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';

@Component({
  selector: 'app-dropdown-select',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <label *ngIf="label" class="block mb-1 font-medium">{{ label }}</label>
    <select
      class="w-full bg-white outline-none border border-primary-2 text-black
      px-3 py-[0.306rem] rounded-xl text-base placeholder:text-gray-500
      placeholder:text-base focus:ring-1 focus:ring-primary-1 transition-shadow
      duration-300 disabled:placeholder:opacity-40 placeholder:font-medium disabled:border-gray-600
      disabled:text-gray-700"
      [disabled]="disabled"
      [(ngModel)]="value"
      (ngModelChange)="onChange($event)"
    >
      <option *ngIf="placeholder" [value]="null" disabled selected>
        {{ placeholder }}
      </option>

      <option *ngFor="let opt of options" [value]="opt[valueKey]">
        {{ opt[labelKey] }}
      </option>
    </select>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true,
    },
  ],
})
export class SelectComponent implements ControlValueAccessor {
  @Input() label: string = '';
  @Input() placeholder: string = 'Selecione';
  @Input() options: any[] = [];

  @Input() labelKey: string = 'label';
  @Input() valueKey: string = 'value';

  value: string | number | null = null;
  disabled = false;

  onChange = (_: any) => {};
  onTouched = () => {};

  writeValue(val: any): void {
    this.value = val;
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
