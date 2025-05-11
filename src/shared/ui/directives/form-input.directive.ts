import { Directive, ElementRef, HostBinding } from '@angular/core';

@Directive({
  selector: '[appFormInput]',
  standalone: true,
})
export class FormInputDirective {
  @HostBinding('class') formInputClass = 'form-input';

  constructor(el: ElementRef) {
    this.formInputClass = 'form-input';
  }
}
