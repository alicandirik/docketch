
import { Component, HostListener, OnDestroy, OnInit } from "@angular/core";
import { BehaviorSubject, Observable, ReplaySubject, Subject } from "rxjs";
import { Select, Store } from "@ngxs/store";
import {
  FolderState,
  NoteActions,
  NoteState,
  UserActions,
  UserState,
} from "../shared/states";
import { User } from "../shared/types";
import {
  debounceTime,
  distinctUntilChanged,
  switchMap,
  takeUntil,
  tap,
} from "rxjs/operators";
import { ActivatedRoute, Router } from "@angular/router";
import { environment } from "src/environments";

@Component({
  selector: "app-master",
  templateUrl: "./master.component.html",
  styleUrls: ["./master.component.scss"],
})
export class MasterComponent implements OnInit, OnDestroy {
  private _destroyer$: ReplaySubject<boolean> = new ReplaySubject<boolean>(1);

  private _search$: Subject<any> = new Subject();

  private _getUser$: BehaviorSubject<string> = new BehaviorSubject(null);

  api = environment.api;

  query: string = "";

  isSearching = false;

  searchResults = [];

  @Select(UserState.current) user$: Observable<User>;

  @Select(FolderState.entities) folders$: Observable<any>;

  @HostListener("document:keydown.f2", ["$event"])
  handleShortcut(event: KeyboardEvent): void {
    event.preventDefault();

    document.getElementById("searchInput").focus();
  }

  constructor(
    private _store: Store,
    private _router: Router,
    private _activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this._initRequest();

    this._store
      .select(NoteState.searchResults)
      .pipe(
        tap(() => (this.isSearching = true)),
        takeUntil(this._destroyer$)
      )
      .subscribe((results) => {
        if (!results || results.lenth === 0) {
          return;
        }

        this.searchResults = results;
        this.isSearching = false;
      });
  }

  ngOnDestroy(): void {
    this._destroyer$.next(true);
    this._destroyer$.complete();
  }

  onSearch(): void {
    if (!this.query) {
      this.searchResults = [];
      return;
    }

    this._search$.next({ title_contains: this.query });
  }

  toNote(note: any): void {
    this._router
      .navigateByUrl("/dashboard/" + note.folder.id + "/notes/" + note.id)
      .then(() => {
        document.getElementById("searchInput").blur();
        this._store.dispatch(new NoteActions.SetCurrent(note));
      });
  }

  onSelectFolder(folder: any) {
    this._store.dispatch(new NoteActions.SetCurrent(folder));
    this._store.dispatch(new NoteActions.Get({ folder: folder.id }));
    this._router.navigate([`./${folder.id}/notes`], {
      relativeTo: this._activatedRoute,
    });
  }

  private _initRequest(): void {
    this._getUser$
      .asObservable()
      .pipe(
        switchMap(() => {
          return this._store.dispatch(new UserActions.Me());
        }),
        takeUntil(this._destroyer$)
      )
      .subscribe();

    this._search$
      .asObservable()
      .pipe(
        tap(() => (this.isSearching = true)),
        debounceTime(500),
        distinctUntilChanged(),
        switchMap((payload) => {
          return this._store.dispatch(new NoteActions.Get(payload, true));
        }),
        takeUntil(this._destroyer$)
      )
      .subscribe(() => (this.isSearching = false));
  }
}
