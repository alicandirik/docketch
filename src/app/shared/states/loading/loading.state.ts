import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext, Store } from "@ngxs/store";
import { LoadingActions } from "./loading.actions";

@State<boolean>({
  name: "loading",
  defaults: false,
})
@Injectable()
export class LoadingState {
  constructor(private _store: Store) {}

  @Selector()
  static isLoading(state: boolean) {
    return state;
  }

  @Action(LoadingActions.Show)
  show({ getState, setState }: StateContext<boolean>) {
    setState(true);
  }

  @Action(LoadingActions.Hide)
  hide({ getState, setState }: StateContext<boolean>) {
      setState(false);
  }
}
