import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { FORM_PARAMS } from "./form-params";
import { LABELS } from "./labels";
import { EMPTY, ReplaySubject, Subject } from "rxjs";
import { catchError, switchMap, takeUntil } from "rxjs/operators";
import { Store } from "@ngxs/store";
import { NotificationActions, UserActions } from "../../shared/states";
import { Router } from "@angular/router";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit, OnDestroy {
  private _destroyer$: ReplaySubject<boolean> = new ReplaySubject<boolean>(1);
  private _login$: Subject<any> = new Subject<any>();

  FORM_PARAMS = FORM_PARAMS;

  LABELS = LABELS;

  form: FormGroup;

  isLoading = false;

  passwordVisible = false;

  constructor(
    private _formBuilder: FormBuilder,
    private _store: Store,
    private _router: Router
  ) {}

  ngOnInit(): void {
    this._initLogin();
    this.form = this._createForm();
  }

  ngOnDestroy(): void {
    this._destroyer$.next(true);
    this._destroyer$.complete();
  }

  onSignIn(): void {
    this.isLoading = true;
    this.form.disable();
    this._login$.next(this.form.getRawValue());
  }

  private _initLogin(): void {
    this._login$
      .asObservable()
      .pipe(
        switchMap((user) => {
          return this._store.dispatch(new UserActions.Login(user)).pipe(
            catchError((err) => {
              console.error(err);
              this.form.enable();
              this.isLoading = false;
              this._store.dispatch(
                new NotificationActions.Show({
                  title: "Error",
                  description: err.message,
                  status: "error",
                })
              );
              return EMPTY;
            })
          );
        }),
        takeUntil(this._destroyer$)
      )
      .subscribe(() => {
        this._store.dispatch(
          new NotificationActions.Show({
            title: "Success",
            description: "You have successfully logged in",
            status: "success",
          })
        );

        this._router.navigate(["dashboard"]).then(() => {
          this.isLoading = false;
          this.form.enable();
        });
      });
  }

  private _createForm(): FormGroup {
    return this._formBuilder.group({
      [FORM_PARAMS.email]: new FormControl(null, [
        FORM_PARAMS.validators.email,
        FORM_PARAMS.validators.required,
        FORM_PARAMS.validators.maxLength,
      ]),
      [FORM_PARAMS.password]: new FormControl(null, [
        FORM_PARAMS.validators.required,
        FORM_PARAMS.validators.minLength,
        FORM_PARAMS.validators.maxLength,
      ]),
    });
  }
}
