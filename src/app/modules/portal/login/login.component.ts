import { Component } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { FormGroupOf } from '../../../../shared/core/types/form-groups-of';
import { ILoginForm } from '../../../../shared/models/portal/login';
import { FormInputDirective } from '../../../../shared/ui/directives/form-input.directive';
import { FormFieldComponent } from '../../../../shared/ui/form-field/form-field.component';
import { BaseComponent } from '../../../../shared/utils/base.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, FormFieldComponent, FormInputDirective],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent extends BaseComponent {
  loginFg = this.fb.group<FormGroupOf<ILoginForm>>({
    usu_tx_email: this.fb.control(null, [
      Validators.required,
      Validators.email,
    ]),
    usu_tx_senha: this.fb.control(null, Validators.required),
  });

  onSubmit() {
    if (this.loginFg.invalid) {
      this.loginFg.markAllAsTouched();
      return;
    }

    const form = this.loginFg.getRawValue() as ILoginForm;

    console.log(form);
    this.messageService.success('SUCESSO MOCKADO !!');
  }
}
