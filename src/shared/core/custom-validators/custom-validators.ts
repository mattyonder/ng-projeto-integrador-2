import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class CustomValidators {
  static passwordMatch(passwordControlName: string): ValidatorFn {
    return (
      confirmPasswordControl: AbstractControl
    ): ValidationErrors | null => {
      if (!confirmPasswordControl.parent) {
        return null; // Ainda não tem acesso ao form completo
      }

      const passwordControl =
        confirmPasswordControl.parent.get(passwordControlName);
      if (!passwordControl) {
        return null;
      }

      const password = passwordControl.value;
      const confirmPassword = confirmPasswordControl.value;

      if (!password || !confirmPassword) {
        return null;
      }

      if (password !== confirmPassword) {
        return { passwordMatch: true };
      }

      return null;
    };
  }
}
