import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { FormGroupOf } from '../../../../shared/core/types/form-groups-of';
import { ILoginForm } from '../../../../shared/models/portal/login';
import { FormInputDirective } from '../../../../shared/ui/directives/form-input.directive';
import { FormFieldComponent } from '../../../../shared/ui/form-field/form-field.component';
import { BaseComponent } from '../../../../shared/utils/base.component';
import { LoginService } from '../../../../shared/services/login/login.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, FormFieldComponent, FormInputDirective],
  templateUrl: './login.component.html',
  styles: '',
})
export class LoginComponent extends BaseComponent {

  //services
  #loginService = inject(LoginService)

  loginFg = this.fb.group<FormGroupOf<ILoginForm>>({
    usuTxEmail: this.fb.control(null, [
      Validators.required,
      Validators.email,
    ]),
    usuTxSenha: this.fb.control(null, Validators.required),
  });

  

  onSubmit() {
    if (this.loginFg.invalid) {
      this.loginFg.markAllAsTouched();
      return;
    }

    const form = this.loginFg.getRawValue() as ILoginForm;

    this.#loginService.login(form).subscribe({
      next: (res) => {
        this.router.navigate(['paginas']);
      }
    })
  }
}
