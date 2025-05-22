import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FormGroupOf } from '../../../../shared/core/types/form-groups-of';
import { ILoginForm } from '../../../../shared/models/portal/login';
import { LoginService } from '../../../../shared/services/login/login.service';
import { FormInputDirective } from '../../../../shared/ui/directives/form-input.directive';
import { FormFieldComponent } from '../../../../shared/ui/form-field/form-field.component';
import { BaseComponent } from '../../../../shared/utils/base.component';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    FormFieldComponent,
    FormInputDirective,
    RouterModule,
  ],
  templateUrl: './login.component.html',
  styles: '',
})
export class LoginComponent extends BaseComponent {
  //services
  #loginService = inject(LoginService);

  loginFg = this.fb.group<FormGroupOf<ILoginForm>>({
    usuTxEmail: this.fb.control(null, [Validators.required, Validators.email]),
    usuTxSenha: this.fb.control(null, Validators.required),
  });

  showPassword = false;

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    if (this.loginFg.invalid) {
      this.loginFg.markAllAsTouched();
      return;
    }

    const form = this.loginFg.getRawValue() as ILoginForm;

    this.#loginService.login(form).subscribe({
      next: (res) => this.router.navigate(['paginas']),
      error: (error) => this.messageService.error(error.error.error),
    });
  }
}
