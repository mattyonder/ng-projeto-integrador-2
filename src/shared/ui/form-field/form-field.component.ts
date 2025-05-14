import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  contentChild,
  effect,
  ElementRef,
  inject,
  Injector,
  input,
  model,
  OnInit,
  untracked,
} from '@angular/core';
import { FormGroupDirective, NgControl, Validators } from '@angular/forms';
import { FormInputDirective } from '../directives/form-input.directive';
import { ErrorComponent } from '../error/error.component';

@Component({
  selector: 'app-form-field',
  standalone: true,
  imports: [CommonModule, ErrorComponent],
  template: `
    <label [for]="label()" class="flex items-center  ml-1 mb-1 text-base font-medium">
      {{ label() }}

      @if (isRequired()) {
      <span class="text-red-500 ml-1">*</span>
      }
    </label>
    <ng-content></ng-content>
    @if (error()) {
    <app-error [error]="error()" />
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormFieldComponent implements OnInit {
  injector = inject(Injector);
  fgd = inject(FormGroupDirective, { optional: true });

  inputElement = contentChild.required(FormInputDirective, {
    read: ElementRef,
  });
  ngControl = contentChild(FormInputDirective, { read: NgControl });

  label = input<string | null>('');
  error = input<string | null>(null);

  isRequired = model<boolean>(false);

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
