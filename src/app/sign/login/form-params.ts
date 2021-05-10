import { Validators } from '@angular/forms';

export const FORM_PARAMS = {
  email: 'identifier',
  password: 'password',
  validators: {
    required: Validators.required,
    minLength: Validators.minLength(8),
    maxLength: Validators.maxLength(25),
    email: Validators.email
  }
};
