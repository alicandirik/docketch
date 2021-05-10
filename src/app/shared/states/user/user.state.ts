import { Action, Selector, State, StateContext } from "@ngxs/store";
import { Injectable } from "@angular/core";
import { UserActions } from "./user.actions";
import { tap } from "rxjs/operators";
import { AuthService, CookieService } from "../../services";
import { User } from "../../types";

export class UserStateModel {
  current: User;
}

@State<UserStateModel>({
  name: "user",
  defaults: {
    current: null,
  },
})
@Injectable()
export class UserState {
  constructor(
    private _authService: AuthService,
    private _cookieService: CookieService
  ) {}

  @Selector()
  static current(state: UserStateModel) {
    return state.current;
  }

  @Action(UserActions.Register)
  register(
    { getState, setState }: StateContext<UserStateModel>,
    { payload }: UserActions.Register
  ) {
    return this._authService.register(payload).pipe(
      tap((result: any) => {
        setState({
          current: result.jwt,
        });
      })
    );
  }

  @Action(UserActions.Login)
  login(
    { getState, setState }: StateContext<UserStateModel>,
    { payload }: UserActions.Login
  ) {
    return this._authService.login(payload).pipe(
      tap((result: any) => {
        const tomorrow = new Date().setDate(new Date().getDate() + 1);

        console.log(result);

        this._cookieService.set("APP_TOKEN", result.jwt, tomorrow);
        this._cookieService.set("APP_USER", result.user.id, tomorrow);

        setState({
          current: result.user,
        });
      })
    );
  }

  @Action(UserActions.SetUser)
  setUser(
    { getState, setState }: StateContext<UserStateModel>,
    { payload }: UserActions.SetUser
  ) {
    const state = getState();

    setState({
      ...state,
      current: payload,
    });
  }

  @Action(UserActions.Me)
  me({ getState, setState }: StateContext<UserStateModel>) {
    return this._authService.me().pipe(
      tap((user) => {
        const state = getState();

        setState({
          ...state,
          current: user,
        });
      })
    );
  }
}
