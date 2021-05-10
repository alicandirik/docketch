import {
  AfterContentChecked,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Select, Store } from "@ngxs/store";
import {
  NzContextMenuService,
  NzDropdownMenuComponent,
} from "ng-zorro-antd/dropdown";
import { NzModalService } from "ng-zorro-antd/modal";
import { ReplaySubject, Observable, Subject } from "rxjs";
import { switchMap } from "rxjs/operators";
import {
  NoteState,
  FolderState,
  FolderActions,
  NoteActions,
  LoadingState,
} from "src/app/shared/states";

@Component({
  selector: "app-note-list",
  templateUrl: "./note-list.component.html",
  styleUrls: ["./note-list.component.scss"],
})
export class NoteListComponent implements OnInit, AfterContentChecked, OnDestroy {
  private _destroyer$: ReplaySubject<boolean> = new ReplaySubject(1);

  private _get$: Subject<any> = new Subject();

  private _delete$: Subject<any> = new Subject();

  folderId: string;

  showDetail = false;

  selectedNoteId: string;

  notes = [];

  folders = [];

  @Select(FolderState.current) current$: Observable<any>;

  @Select(FolderState.entities) folders$: Observable<any>;

  @Select(LoadingState.isLoading) isLoading$: Observable<boolean>;

  contextMenu(ev: MouseEvent, menu: NzDropdownMenuComponent): void {
    this._nzContextMenuService.create(ev, menu);
  }

  @HostListener("window:click", ["$event"])
  onOutsideClick(ev): void {
    if (!this._elRef.nativeElement.contains(ev.target)) {
      this._nzContextMenuService.close();
    }
  }

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _store: Store,
    private _nzContextMenuService: NzContextMenuService,
    private _elRef: ElementRef,
    private _modalService: NzModalService,
    private _cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this._initRequest();

    this.folderId = this._activatedRoute.snapshot.paramMap.get("folderId");
    this._store.dispatch(new FolderActions.Current(this.folderId));
    this._store.dispatch(new NoteActions.Get({ folder: this.folderId }));
    this._store.dispatch(new FolderActions.Get());

    this._store.select(NoteState.entities).subscribe((notes) => {
      this.notes = notes;
    });

    this._store.select(FolderState.entities).subscribe((folders) => {
      this.folders = folders;
    });

    this._activatedRoute.paramMap.subscribe((params: any) => {
      this.selectedNoteId = params.params.noteId;

      if (this.selectedNoteId) {
        this.showDetail = true;
      }
    });
  }

  ngAfterContentChecked(): void {
    this._cdr.detectChanges();
  }

  ngOnDestroy(): void {
    this._store.dispatch(new NoteActions.Reset("entities"));
    this._destroyer$.next(true);
    this._destroyer$.complete();
  }

  onDelete(note: any): void {
    this._modalService.confirm({
      nzTitle: `Are you sure to delete note?`,
      nzContent: `<b>${note.title}</b> will be deleted permanently.`,
      nzOkDanger: true,
      nzOnOk: () => {
        this._delete$.next(note.id);
      },
    });
  }

  onSelectNote(id: string): void {
    this.selectedNoteId = id;
    this.showDetail = true;
  }

  onSubmit(): void {
    this.showDetail = false;
  }

  onMove(note: any, folder: any): void {
    let n = JSON.parse(JSON.stringify(note));
    delete n.folder;
    n.folder = folder.id;
    this._get$.next(n);
  }

  onDrawerClose(): void {
    this.selectedNoteId = null;
    this.showDetail = false;
    this._store.dispatch(new NoteActions.SetCurrent(null));
  }

  private _initRequest(): void {
    this._get$
      .asObservable()
      .pipe(
        switchMap((payload) => {
          return this._store.dispatch(new NoteActions.Update(payload));
        })
      )
      .subscribe(() => {
        this._store.dispatch(new NoteActions.Get({ folder: this.folderId }));
      });

    this._delete$
      .asObservable()
      .pipe(
        switchMap((noteId) => {
          return this._store.dispatch(new NoteActions.Delete(noteId));
        })
      )
      .subscribe(() => {
        this._store.dispatch(new NoteActions.Get({ folder: this.folderId }));
      });
  }
}
