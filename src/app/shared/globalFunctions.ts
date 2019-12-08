import { FormGroup, FormControl } from '@angular/forms';
import { Injectable } from '@angular/core';

@Injectable()
export class GlobalFunctions {
  validateAllFormFields(formGroup: FormGroup) {         //{1}
    Object.keys(formGroup.controls).forEach(field => {  //{2}
      const control = formGroup.get(field);             //{3}
      if (control instanceof FormControl) {             //{4}
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {        //{5}
        this.validateAllFormFields(control);            //{6}
      }
    });
  }

  successMessage(message = 'Cambios guardados correctamente') {
    return {
      show: true,
      status: 'primary',
      text: message
    };
  }

  errorMessage(message = 'Favor completar todos los campos') {
    return {
      show: true,
      status: 'warn',
      text: message
    };
  }
}
