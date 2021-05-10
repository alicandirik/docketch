import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { Select, Store } from "@ngxs/store";
import { Observable, ReplaySubject, Subject } from "rxjs";
import { switchMap, takeUntil, tap } from "rxjs/operators";
import {
  FolderState,
  LoadingState,
  NoteActions,
  UserState,
} from "src/app/shared/states";
import { NoteState } from "src/app/shared/states/note/note.state";
import { COLORS } from "src/app/shared/types";

@Component({
  selector: "app-note-detail",
  templateUrl: "./note-detail.component.html",
  styleUrls: ["./note-detail.component.scss"],
})
export class NoteDetailComponent implements OnInit, OnChanges, OnDestroy {
  private _destroyer$: ReplaySubject<boolean> = new ReplaySubject(1);

  private _update$: Subject<any> = new Subject();

  private _create$: Subject<any> = new Subject();

  private _delete$: Subject<string> = new Subject();

  note: any;

  form: FormGroup;

  colors = COLORS;

  isCreating = false;

  isDeleting = false;

  folder: any;

  @Input() visible = false;

  @Input() noteId: string;

  @Input() title: string;

  @Input() drawerWidth = "100";

  @Output() onClose: EventEmitter<boolean> = new EventEmitter();

  @Select(FolderState.entities) folders$: Observable<any>;

  @Select(LoadingState.isLoading) isLoading$: Observable<boolean>;

  compareFn = (o1: any, o2: any) => (o1 && o2 ? o1.id === o2.id : o1 === o2);

  constructor(private _store: Store, private _formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this._initRequests();

    this._store
      .select(NoteState.current)
      .pipe(takeUntil(this._destroyer$))
      .subscribe((n) => {
        if (!n) {
          this.note = null;
          this.form.reset();
          return;
        }

        this.note = { ...n };
        this.form.patchValue(n);
        this.form.markAsPristine();
      });
  }

  ngOnChanges({ noteId }: SimpleChanges): void {
    this.form = this._createForm();

    if (!noteId) {
      this.isCreating = true;
      const folder = this._store.selectSnapshot(FolderState.current);
      this.form.get("folder").patchValue(folder);
    }

    if (noteId?.currentValue) {
      this.isCreating = false;
      const id = noteId.currentValue;
      this._store.dispatch(new NoteActions.Current(id));
    } else {
      this._store.dispatch(new NoteActions.SetCurrent(null));
    }
  }

  ngOnDestroy(): void {
    this._destroyer$.next(true);
    this._destroyer$.complete();
  }

  onSelectColor(color: string): void {
    this.form.get("color").patchValue(color);
  }

  close(): void {
    this.isDeleting = false;
    this.form.reset();
    this.onClose.emit(true);
  }

  onDelete(note: any): void {
    if (!this.isDeleting) {
      this.isDeleting = true;
      return;
    }

    this._delete$.next(note.id);
  }

  onSubmit(): void {
    const folder = this._store.selectSnapshot(FolderState.current);
    const user = this._store.selectSnapshot(UserState.current);

    let n;

    if (!this.noteId) {
      n = {
        ...this.form.getRawValue(),
        folder: folder.id,
        user: user.id,
      };

      this._create$.next(n);
      return;
    }

    n = { ...this.note, ...this.form.getRawValue() };

    this._update$.next(n);
  }

  private _initRequests(): void {
    this._update$
      .asObservable()
      .pipe(
        switchMap((payload) => {
          return this._store.dispatch(new NoteActions.Update(payload));
        }),
        takeUntil(this._destroyer$)
      )
      .subscribe(() => {
        const folder = this._store.selectSnapshot(FolderState.current);
        this._store.dispatch(new NoteActions.Get({ folder: folder.id }, false));
        this.close();
      });

    this._create$
      .asObservable()
      .pipe(
        switchMap((payload) => {
          return this._store.dispatch(new NoteActions.New(payload));
        }),
        takeUntil(this._destroyer$)
      )
      .subscribe(() => {
        const folder = this._store.selectSnapshot(FolderState.current);
        this._store.dispatch(new NoteActions.Get({ folder: folder.id }, false));
        this.close();
      });

    this._delete$
      .asObservable()
      .pipe(
        switchMap((noteId) => {
          return this._store.dispatch(new NoteActions.Delete(noteId));
        }),
        takeUntil(this._destroyer$)
      )
      .subscribe(() => {
        const folder = this._store.selectSnapshot(FolderState.current);
        this._store.dispatch(new NoteActions.Get({ folder: folder.id }, false));
        this.close();
      });
  }

  private _createForm(): FormGroup {
    return this._formBuilder.group({
      title: new FormControl(null, Validators.required),
      color: new FormControl(null, Validators.required),
      folder: new FormControl(null, Validators.required),
      description: new FormControl(null, Validators.required),
    });
  }
}
