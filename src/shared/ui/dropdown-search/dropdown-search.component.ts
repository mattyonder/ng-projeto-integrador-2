import { NgClass, NgTemplateOutlet } from '@angular/common';
import {
  AfterViewInit,
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  ContentChild,
  inject,
  input,
  model,
  OnChanges,
  OnInit,
  output,
  signal,
  SimpleChanges,
  TemplateRef,
  viewChild,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormsModule,
  NgControl,
  Validators,
} from '@angular/forms';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormInputDirective } from '../directives/form-input.directive';
import { ErrorComponent } from '../error/error.component';

@Component({
  selector: 'app-dropdown-search',
  standalone: true,
  imports: [
    FormInputDirective,
    FaIconComponent,
    NgTemplateOutlet,
    FormsModule,
    ErrorComponent,
    NgClass,
  ],
  host: {
    class: 'block',
  },
  template: `
    <div #father class="relative w-full" (clickOutside)="onUnfocus()">
      @if (label()) {
      <label class="block mb-1 font-medium"
        >{{ label() }} @if(isRequired()){
        <span class="text-red-500 ml-1">*</span>
        }
      </label>
      }

      <div class="relative">
        <input
          id="dpsInput"
          #searchInput
          appFormInput
          [value]="truncatedSelectedOption()"
          [disabled]="isDisabled()"
          (focus)="onFocus()"
          (keyup)="changeSearch(searchInput.value)"
          [placeholder]="placeholder()"
          autocomplete="off"
        />
        <fa-icon
          class="text-pec-blue1 absolute right-3 inset-y-1.5"
          [icon]="iconName()!"
        ></fa-icon>
      </div>
      @if (dropOptionsOpen()) {
      <div
        class="absolute z-[100] w-full"
        [ngClass]="{
              'bottom-full mb-1': openUp(),
              'top-full mt-1': !openUp(),
            }"
      >
        <div
          class="overflow-y-auto max-h-72 mt-1 border-4 border-pec-gray3 bg-pec-gray shadow-md shadow-neutral-400"
        >
          @for (option of options(); track $index) {
          <button
            type="button"
            (click)="selectOption(option)"
            class="block w-full text-start p-1 border-b-2 border-pec-gray3 bg-gray-200 hover:bg-gray-300"
          >
            <ng-container
              *ngTemplateOutlet="template; context: { $implicit: option }"
            />
          </button>
          } @empty {
          <div class="text-center text-pec-tx-secondary">
            {{ noContentMessage() }}
          </div>
          }
        </div>
        <ng-content select="dropdownBottomContent" />
      </div>
      } @if (error()) {
      <app-error [error]="error()" />
      }
    </div>
    <div #textMeasurer class="invisible absolute"></div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropdownSearchComponent<T>
  implements OnInit, ControlValueAccessor, OnChanges, AfterViewInit
{
  @ContentChild(TemplateRef) template: TemplateRef<any> | null = null;
  father = viewChild.required('father');
  textMeasurer = viewChild.required('textMeasurer');

  protected dropOptionsOpen = signal<boolean>(false);

  openUp = input<boolean, unknown>(false, { transform: booleanAttribute });

  label = input<string | null>(null);
  error = input<string | null>(null);
  optionIdentify = input<keyof T>();
  optionLabel = input.required<keyof T>();
  noContentMessage = input<string>('Nenhum item encontrado');

  options = input<T[]>([]);
  selectedOption = signal<T | undefined>(undefined);
  selectedOptionTemp = signal<T | undefined>(undefined);

  selectedOptionChange = output<T | undefined>();
  // selectedOptionIdentifyChange = output<T | undefined>();

  protected displaySelectedOption = computed(() => {
    return this.selectedOption()?.[this.optionLabel()] ?? '';
  });

  protected truncatedSelectedOption = computed(() => {
    return this.truncateText(String(this.displaySelectedOption()));
  });

  search = model<string>();
  iconName = model<string>();

  placeholder = input.required<string>();

  protected onTouched?: () => {};
  protected onChange?: (value: T | T[keyof T] | null) => {};
  protected isDisabled = signal(false);
  protected isRequired = signal(false);

  private ngControl = inject(NgControl, { optional: true });

  private inputElement = signal<HTMLElement | null>(null);
  private textMeasurerElement = signal<HTMLElement | null>(null);

  constructor() {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  ngOnInit(): void {
    this.#isDownIcon(true);
    if (this.ngControl) {
      const isRequired = this.ngControl.control?.hasValidator(
        Validators.required
      );
      this.isRequired.set(isRequired ?? false);
    }
  }

  ngAfterViewInit(): void {
    this.inputElement.set(
      (
        this.father() as { nativeElement: HTMLElement }
      ).nativeElement.querySelector('input')
    );
    this.textMeasurerElement.set(
      (this.textMeasurer() as { nativeElement: HTMLElement }).nativeElement
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['options']?.currentValue &&
      this.selectedOptionTemp() &&
      this.options()?.length > 0
    ) {
      const optionIdentify = this.selectedOptionTemp();

      const option = this.options().find((o) => {
        return o[this.optionIdentify()!] === optionIdentify;
      });

      this.selectedOption.set(option);
    }
  }

  protected changeSearch(search: string): void {
    this.dropOptionsOpen.set(true);
    this.#isDownIcon(false);
    if (this.selectedOption()) {
      this.reset();
      if (this.ngControl) this.ngControl.control?.reset();
      this.search.set('');
    } else this.search.set(search);
  }

  protected selectOption(option: T): void {
    this.onTouched?.();

    this.dropOptionsOpen.set(false);
    this.#isDownIcon(true);
    this.selectedOption.set(option);

    const optionForEmit = this.optionIdentify()
      ? option[this.optionIdentify()!]
      : option;
    this.onChange?.(optionForEmit);
    this.selectedOptionChange.emit(option);

    this.search.set(undefined);
  }

  truncateText(text: string): string {
    if (!this.inputElement() || !this.textMeasurerElement()) {
      return text;
    }

    const iconWidth = 24; // Largura do ícone (ajuste conforme necessário)
    const padding = 18; // Padding do input (ajuste conforme necessário)
    const availableWidth =
      this.inputElement()!.offsetWidth - iconWidth - padding;

    this.textMeasurerElement()!.style.font = window.getComputedStyle(
      this.inputElement()!
    ).font;
    this.textMeasurerElement()!.textContent = text;

    let truncatedText = text;
    while (
      this.textMeasurerElement()!.offsetWidth > availableWidth &&
      truncatedText.length > 0
    ) {
      truncatedText = truncatedText.slice(0, -1);
      this.textMeasurerElement()!.textContent = truncatedText + '...';
    }

    return truncatedText.length < text.length ? truncatedText + '...' : text;
  }

  writeValue(obj: T): void {
    this.selectedOption.set(obj);
    this.selectedOptionTemp.set(obj);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn as (value: T | T[keyof T] | null) => {};
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn as () => {};
  }

  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }

  reset(): void {
    this.selectedOption.set(undefined);
    this.search.set(undefined);
    this.selectedOptionChange.emit(undefined);
  }
  #isDownIcon(bool: boolean): void {
    if (bool) {
      this.iconName.set('angle-down');
    } else {
      this.iconName.set('magnifying-glass');
    }
  }
  onUnfocus() {
    this.dropOptionsOpen.set(false);
    this.#isDownIcon(true);
  }
  onFocus() {
    this.dropOptionsOpen.set(true);
    this.#isDownIcon(false);
  }
}
