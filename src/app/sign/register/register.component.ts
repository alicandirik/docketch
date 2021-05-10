import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { FORM_PARAMS } from './form-params';
import { LABELS } from './labels';
import { Store } from '@ngxs/store';
import { catchError, switchMap, takeUntil } from 'rxjs/operators';
import { EMPTY, ReplaySubject, Subject } from 'rxjs';
import { NotificationActions, UserActions } from '../../shared/states';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, OnDestroy {
  private _destroyer$: ReplaySubject<boolean> = new ReplaySubject<boolean>(1);
  private _register$: Subject<any> = new Subject<any>();

  form: FormGroup;

  LABELS = LABELS;

  FORM_PARAMS = FORM_PARAMS;

  passwordVisible = false;

  isLoading = false;

  constructor(private _formBuilder: FormBuilder, private _store: Store, private _router: Router) {}

  ngOnInit() {
    this.form = this._createForm();
    this._initRegister();
  }

  ngOnDestroy(): void {
    this._destroyer$.next(true);
    this._destroyer$.complete();
  }

  onRegister(): void {
    this.isLoading = true;
    this.form.disable();
    const value = { ...this.form.getRawValue() };
    delete value.confirm;
    this._register$.next(value);
  }

  private _initRegister(): void {
    this._register$
      .asObservable()
      .pipe(
        switchMap((user) => {
          return this._store.dispatch(new UserActions.Register(user)).pipe(
            catchError((err) => {
              console.error(err);
              this.isLoading = false;
              this.form.enable();
              return EMPTY;
            })
          );
        }),
        takeUntil(this._destroyer$)
      )
      .subscribe(() => {
        this._store.dispatch(
          new NotificationActions.Show({
            title: 'Success',
            description: 'You have successfully registered',
            status: 'success'
          })
        );

        this._router.navigate(['sign/login']).then(() => {
          this.isLoading = false;
          this.form.enable();
        });
      });
  }

  private _createForm(): FormGroup {
    return this._formBuilder.group({
      [FORM_PARAMS.email]: new FormControl(null, [
        FORM_PARAMS.validators.required,
        FORM_PARAMS.validators.maxLength,
        FORM_PARAMS.validators.email
      ]),
      [FORM_PARAMS.fullName]: new FormControl(null, [
        FORM_PARAMS.validators.required,
        FORM_PARAMS.validators.maxLength
      ]),
      [FORM_PARAMS.password]: new FormControl(null, [
        FORM_PARAMS.validators.required,
        FORM_PARAMS.validators.passwordMinLength
      ])
    });
  }
}
