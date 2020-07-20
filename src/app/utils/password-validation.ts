import { FormGroup } from '@angular/forms';

export class PasswordValidator {
  static validate(registrationFormGroup: FormGroup) {
    let Password = registrationFormGroup.controls.Password.value;
    let Confirmpassword = registrationFormGroup.controls.Confirmpassword.value;

    if (Confirmpassword.length <= 0) {
      return null;
    }

    if (Confirmpassword !== Password) {
      return {
        doesMatchPassword: true
      };
    }

    return null;

  }
}