import { CommonModule } from '@angular/common';
import {
  Component,
  contentChild,
  effect,
  EventEmitter,
  forwardRef,
  inject,
  Injector,
  Input,
  model,
  OnInit,
  Output,
  untracked,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormGroupDirective,
  FormsModule,
  NG_VALUE_ACCESSOR,
  NgControl,
  Validators,
} from '@angular/forms';
import { FormInputDirective } from '../directives/form-input.directive';
import { ErrorComponent } from '../error/error.component';

@Component({
  selector: 'app-dropdown-select',
  standalone: true,
  imports: [CommonModule, FormsModule, ErrorComponent],
  template: `
    <label *ngIf="label" class="block mb-1 font-medium"
      >{{ label }}
      <span class="text-red-500 ml-1">*</span>
    </label>
    @if (isRequired()) { }
    <select
      class="w-full bg-white outline-none border border-primary-2 text-black
      px-3 py-[0.306rem] rounded-xl text-base placeholder:text-gray-500
      placeholder:text-base focus:ring-1 focus:ring-primary-1 transition-shadow
      duration-300 disabled:placeholder:opacity-40 placeholder:font-medium disabled:border-gray-600
      disabled:text-gray-700"
      [disabled]="disabled"
      [(ngModel)]="selected"
      (ngModelChange)="handleChange($event)"
    >
      <option *ngIf="placeholder" [ngValue]="null" disabled>
        {{ placeholder }}
      </option>

      <option *ngFor="let opt of options" [ngValue]="opt[valueKey]">
        {{ opt[labelKey] }}
      </option>
    </select>
    @if (error) {
    <app-error [error]="error" />
    }
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true,
    },
  ],
})
export class SelectComponent implements ControlValueAccessor, OnInit {
  injector = inject(Injector);
  fgd = inject(FormGroupDirective, { optional: true });

  @Input() label: string = '';
  @Input() placeholder: string = 'Selecione';
  @Input() options: any[] = [];
  @Input() labelKey: string = 'label';
  @Input() valueKey: string = 'value';
  @Input() error: string | null = null;

  @Output() selectedObject = new EventEmitter<any>();
  ngControl = contentChild(FormInputDirective, { read: NgControl });

  selected: any = null;
  disabled = false;

  private onChange = (_: any) => {};
  private onTouched = () => {};

  isRequired = model<boolean>(false);

  writeValue(value: any): void {
    this.selected = value;
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

  handleChange(value: any) {
    this.selected = value;
    this.onChange(value);

    const fullObj = this.options.find((opt) => opt[this.valueKey] === value);
    this.selectedObject.emit(fullObj);
  }

  ngOnInit(): void {
    effect(
      () => {
        untracked(() => {
          if (this.ngControl()) {
            const controlName = this.ngControl()?.name as string;
            const formControl = this.fgd?.form.get(controlName);
            if (controlName && formControl) {
              const isRequired = formControl.hasValidator(Validators.required);
              this.isRequired.set(isRequired);
            }
          }
        });
      },
      { injector: this.injector }
    );
  }
}
