import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext, Store } from "@ngxs/store";
import { tap } from "rxjs/operators";
import { NoteActions } from "./note.actions";
import { NotificationActions } from "../notification/notification.actions";
import { NoteService } from "../../services/note/note.service";

export interface NoteStateModel {
  entities: any;
  current: any;
  searchResult: any;
}

@State<NoteStateModel>({
  name: "note",
  defaults: {
    entities: [],
    current: null,
    searchResult: [],
  },
})
@Injectable()
export class NoteState {
  constructor(private _noteService: NoteService, private _store: Store) {}

  @Selector()
  static entities(state: NoteStateModel) {
    return state.entities;
  }

  @Selector()
  static current(state: NoteStateModel) {
    return state.current;
  }

  @Selector()
  static searchResults(state: NoteStateModel) {
    return state.searchResult;
  }

  @Action(NoteActions.Get)
  entities(
    { getState, setState }: StateContext<NoteStateModel>,
    { payload, isSearch }: NoteActions.Get
  ) {
    return this._noteService.getNotes({ isSearch: isSearch, ...payload }).pipe(
      tap((result: any) => {
        const state = getState();

        if (!isSearch) {
          setState({
            ...state,
            entities: result,
          });

          return;
        }

        setState({
          ...state,
          searchResult: result,
        });
      })
    );
  }

  @Action(NoteActions.SetCurrent)
  setCurrent(
    { getState, setState }: StateContext<NoteStateModel>,
    { payload }: NoteActions.SetCurrent
  ) {
    const state = getState();

    setState({
      ...state,
      current: payload,
    });
  }

  @Action(NoteActions.Current)
  getCurrent(
    { getState, setState }: StateContext<NoteStateModel>,
    { id }: NoteActions.Current
  ) {
    return this._noteService.current(id).pipe(
      tap((res) => {
        const state = getState();

        setState({
          ...state,
          current: res,
        });
      })
    );
  }

  @Action(NoteActions.New)
  create(
    { getState, setState }: StateContext<NoteStateModel>,
    { payload }: NoteActions.New
  ) {
    return this._noteService.create(payload).pipe(
      tap((result: any) => {
        const state = getState();

        setState({
          ...state,
          entities: [...state.entities, result],
        });

        this._store.dispatch(
          new NotificationActions.Show({
            title: "Success",
            description: `Note "${payload.title}" is created`,
            status: "success",
          })
        );
      })
    );
  }

  @Action(NoteActions.Update)
  update(
    { getState, setState }: StateContext<NoteStateModel>,
    { payload }: NoteActions.Update
  ) {
    return this._noteService.update(payload).pipe(
      tap(() => {
        this._store.dispatch(
          new NotificationActions.Show({
            title: "Success",
            description: `"${payload.title}" note is updated`,
            status: "success",
          })
        );
      })
    );
  }

  @Action(NoteActions.Delete)
  delete(
    { getState, setState }: StateContext<NoteStateModel>,
    { id }: NoteActions.Delete
  ) {
    return this._noteService.delete(id).pipe(
      tap(() => {
        this._store.dispatch(
          new NotificationActions.Show({
            title: "Success",
            description: `"Note is deleted`,
            status: "success",
          })
        );
      })
    );
  }

  @Action(NoteActions.Reset)
  reset(
    { getState, setState }: StateContext<NoteStateModel>,
    { field }: NoteActions.Reset
  ) {
    const state = getState();

    setState({
      ...state,
      [field]: null,
    });
  }
}
