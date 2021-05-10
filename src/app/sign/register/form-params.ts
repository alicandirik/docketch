import { Validators } from '@angular/forms';

export const FORM_PARAMS = {
  email: 'email',
  fullName: 'fullName',
  password: 'password',
  confirm: 'confirm',
  validators: {
    required: Validators.required,
    passwordMinLength: Validators.minLength(8),
    maxLength: Validators.maxLength(25),
    email: Validators.email
  }
};
