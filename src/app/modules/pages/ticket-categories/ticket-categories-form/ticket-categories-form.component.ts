import { Component } from '@angular/core';
import { FormInputDirective } from '../../../../../shared/ui/directives/form-input.directive';
import { FormFieldComponent } from '../../../../../shared/ui/form-field/form-field.component';
import { BaseComponent } from '../../../../../shared/utils/base.component';

@Component({
  selector: 'app-ticket-categories-form',
  standalone: true,
  imports: [FormFieldComponent, FormInputDirective],
  templateUrl: './ticket-categories-form.component.html',
  styles: '',
})
export class TicketCategoriesFormComponent extends BaseComponent {
  onSubmit() {}
}
