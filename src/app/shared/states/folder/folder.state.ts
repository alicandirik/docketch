import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext, Store } from "@ngxs/store";
import { tap } from "rxjs/operators";
import { FolderActions } from "./folder.actions";
import { NotificationActions } from "../notification/notification.actions";
import { FolderService } from "../../services/folder/folder.service";

export interface FolderStateModel {
  entities: any;
  current: any;
}

@State<FolderStateModel>({
  name: "folder",
  defaults: {
    entities: [],
    current: null,
  },
})
@Injectable()
export class FolderState {
  constructor(private _folderService: FolderService, private _store: Store) {}

  @Selector()
  static entities(state: FolderStateModel) {
    return state.entities;
  }

  @Selector()
  static current(state: FolderStateModel) {
    return state.current;
  }

  @Action(FolderActions.Get)
  entities(
    { getState, setState }: StateContext<FolderStateModel>,
    { payload }: FolderActions.Get
  ) {
    return this._folderService.getFolders(payload).pipe(
      tap((result: any) => {
        const state = getState();

        setState({
          ...state,
          entities: result,
        });
      })
    );
  }

  @Action(FolderActions.New)
  new(
    { getState, setState }: StateContext<FolderStateModel>,
    { payload }: FolderActions.New
  ) {
    return this._folderService.create(payload).pipe(
      tap((result: any) => {
        const state = getState();

        setState({
          ...state,
          entities: [...state.entities, result],
        });

        this._store.dispatch(
          new NotificationActions.Show({
            title: "Success",
            description: `Folder "${payload.name}" is created`,
            status: "success",
          })
        );
      })
    );
  }

  @Action(FolderActions.SetCurrent)
  setCurrent(
    { getState, setState }: StateContext<FolderStateModel>,
    { payload }: FolderActions.SetCurrent
  ) {
    const state = getState();

    setState({
      ...state,
      current: payload,
    });
  }

  @Action(FolderActions.Current)
  getCurrent(
    { getState, setState }: StateContext<FolderStateModel>,
    { id }: FolderActions.Current
  ) {
    return this._folderService.current(id).pipe(
      tap((res) => {
        const state = getState();

        setState({
          ...state,
          current: res,
        });
      })
    );
  }

  @Action(FolderActions.Update)
  update(
    { getState, setState }: StateContext<FolderStateModel>,
    { payload }: FolderActions.Update
  ) {
    return this._folderService.update(payload).pipe(
      tap((result: any) => {
        const state = getState();

        setState({
          ...state,
          entities: [...state.entities, result],
        });

        this._store.dispatch(
          new NotificationActions.Show({
            title: "Success",
            description: `"${payload.title}" folder is updated`,
            status: "success",
          })
        );
      })
    );
  }

  @Action(FolderActions.Delete)
  delete(
    { getState, setState }: StateContext<FolderStateModel>,
    { folderId }: FolderActions.Delete
  ) {
    return this._folderService.delete(folderId).pipe(
      tap(() => {
        this._store.dispatch(
          new NotificationActions.Show({
            title: "Success",
            description: "Folder is deleted",
            status: "success",
          })
        );
      })
    );
  }
}
