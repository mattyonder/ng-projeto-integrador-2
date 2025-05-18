import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { FormGroupOf } from '../../../../shared/core/types/form-groups-of';
import { ILoginForm } from '../../../../shared/models/portal/login';
import { LoginService } from '../../../../shared/services/login/login.service';
import { FormInputDirective } from '../../../../shared/ui/directives/form-input.directive';
import { FormFieldComponent } from '../../../../shared/ui/form-field/form-field.component';
import { BaseComponent } from '../../../../shared/utils/base.component';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, FormFieldComponent, FormInputDirective],
  templateUrl: './register.component.html',
  styles: '',
})
export class RegisterComponent extends BaseComponent {
  //services
  #loginService = inject(LoginService);

  registerFg = this.fb.group<FormGroupOf<ILoginForm>>({
    usuTxEmail: this.fb.control(null, [Validators.required, Validators.email]),
    usuTxSenha: this.fb.control(null, Validators.required),
  });

  onSubmit() {
    if (this.registerFg.invalid) {
      this.registerFg.markAllAsTouched();
      return;
    }

    const form = this.registerFg.getRawValue() as ILoginForm;

    this.#loginService.register(form).subscribe({
      next: (res) => {
        this.router.navigate(['paginas']);
      },
    });
  }
}
