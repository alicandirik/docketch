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
import { Store } from "@ngxs/store";
import { ReplaySubject, Subject } from "rxjs";
import { switchMap, takeUntil } from "rxjs/operators";
import { UserState, FolderActions, FolderState } from "src/app/shared/states";
import { COLORS } from "src/app/shared/types";

@Component({
  selector: "app-folder-detail",
  templateUrl: "./folder-detail.component.html",
  styleUrls: ["./folder-detail.component.scss"],
})
export class FolderDetailComponent implements OnInit, OnChanges, OnDestroy {
  private _destroyer$: ReplaySubject<boolean> = new ReplaySubject(1);

  private _create$: Subject<any> = new Subject<any>();

  private _update$: Subject<any> = new Subject();

  private _delete$: Subject<string> = new Subject();

  form: FormGroup;

  colors = COLORS;

  date = new Date();

  folder: any;

  isCreating = false;

  isDeleting = false;

  @Input() visible = false;

  @Input() folderId: string;

  @Input() title: string;

  @Output() onClose: EventEmitter<boolean> = new EventEmitter();

  constructor(private _formBuilder: FormBuilder, private _store: Store) {}

  ngOnInit(): void {
    this._initRequest();

    this._store
      .select(FolderState.current)
      .pipe(takeUntil(this._destroyer$))
      .subscribe((f) => {
        if (!f) {
          this.folder = null;
          this.form.reset();
          return;
        }

        this.folder = { ...f };
        this.form.patchValue(f);
        this.form.markAsPristine();
      });
  }

  ngOnChanges({ folderId }: SimpleChanges): void {
    this.form = this._createForm();

    if (!folderId) {
      this.isCreating = true;
    }

    if (folderId?.currentValue) {
      this.isCreating = false;
      const id = folderId.currentValue;
      this._store.dispatch(new FolderActions.Current(id));
    } else {
      this._store.dispatch(new FolderActions.SetCurrent(null));
    }
  }

  ngOnDestroy(): void {
    this._destroyer$.next(true);
    this._destroyer$.complete();
  }

  close(): void {
    this.isDeleting = false;
    this.form.reset();
    this.onClose.emit(true);
  }

  onDelete(folder: any): void {
    if (!this.isDeleting) {
      this.isDeleting = true;
      return;
    }

    this._delete$.next(folder.id);
  }

  onSelectColor(color: string): void {
    this.form.get("color").patchValue(color);
  }

  onSubmit(): void {
    if (!this.folderId) {
      this._create$.next(this.form.getRawValue());
      return;
    }

    const f = {
      ...this.folder,
      ...this.form.getRawValue(),
    };
    this._update$.next(f);
  }

  private _initRequest(): void {
    this._create$
      .asObservable()
      .pipe(
        switchMap((payload) => {
          const user = this._store.selectSnapshot(UserState.current);
          const data = { ...payload, user: user.id };

          return this._store.dispatch(new FolderActions.New(data));
        }),
        takeUntil(this._destroyer$)
      )
      .subscribe(() => {
        this.onClose.emit(true);
        this.form.reset();
      });

    this._update$
      .asObservable()
      .pipe(
        switchMap((payload) => {
          return this._store.dispatch(new FolderActions.Update(payload));
        }),
        takeUntil(this._destroyer$)
      )
      .subscribe(() => {
        this._store.dispatch(new FolderActions.Get());
        this.close();
      });

    this._delete$
      .asObservable()
      .pipe(
        switchMap((folderId) => {
          return this._store.dispatch(new FolderActions.Delete(folderId));
        }),
        takeUntil(this._destroyer$)
      )
      .subscribe(() => {
        this._store.dispatch(new FolderActions.Get());
        this.close();
      });
  }

  private _createForm(): FormGroup {
    return this._formBuilder.group({
      name: new FormControl(null, [
        Validators.required,
        Validators.maxLength(50),
      ]),
      description: new FormControl(null, [
        Validators.required,
        Validators.maxLength(200),
      ]),
      color: new FormControl(null, Validators.required),
    });
  }
}
