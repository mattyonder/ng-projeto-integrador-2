import { Injectable } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class AppErrorHandler {
  protected validationsMessages: Map<string, string> = new Map([
    ['required', 'Este campo é obrigatório.'],
    ['minlength', 'O campo não atingiu o mínimo de caracteres.'],
    ['maxlength', 'O campo excedeu o máximo de caracteres.'],
    ['min', 'O valor excedeu o mínimo permitido.'],
    ['max', 'O valor excedeu o máximo permitido.'],
    ['email', 'Digite um endereço de e-mail válido.'],
    ['passwordMatch', 'A senhas não coincide.'],
  ]);

  showErrorMessageInField(form: NgForm | FormGroup, key: string): string {
    let message: string | undefined;

    const formControl = form.controls[key];

    if ((formControl?.invalid && formControl?.touched) || formControl?.dirty) {
      this.validationsMessages.forEach((_, validationKey) => {
        if (formControl.errors?.[validationKey]) {
          message = this.validationsMessages.get(validationKey);
        }
      });
    }
    return message ? message : '';
  }
}
