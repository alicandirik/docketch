import { AfterContentChecked, ChangeDetectorRef, Component, ElementRef, HostListener, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Select, Store } from "@ngxs/store";
import { NzContextMenuService, NzDropdownMenuComponent } from "ng-zorro-antd/dropdown";
import { NzModalService } from "ng-zorro-antd/modal";
import { ReplaySubject, Observable, Subject } from "rxjs";
import { switchMap, takeUntil } from "rxjs/operators";
import { FolderActions, FolderState, LoadingState } from "src/app/shared/states";

@Component({
  selector: "app-folder-list",
  templateUrl: "./folder-list.component.html",
  styleUrls: ["./folder-list.component.scss"],
})
export class FolderListComponent implements OnInit, OnDestroy, AfterContentChecked {
  private _destroyer$: ReplaySubject<boolean> = new ReplaySubject(1);

  private _delete$: Subject<any> = new Subject<any>();

  selectedFolderId: string;

  showDetail = false;

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
    private _router: Router,
    private _store: Store,
    private _activatedRoute: ActivatedRoute,
    private _modalService: NzModalService,
    private _nzContextMenuService: NzContextMenuService,
    private _elRef: ElementRef,
    private _cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this._initRequests();
    this._store.dispatch(new FolderActions.Get());
  }

  ngAfterContentChecked(): void {
    this._cdr.detectChanges();
  }

  ngOnDestroy(): void {
    this._destroyer$.next(true);
    this._destroyer$.complete();
  }

  onDelete(folder: any): void {
    this._modalService.confirm({
      nzTitle: `Are you sure to delete note?`,
      nzContent: `<b>${folder.name}</b> will be deleted permanently.`,
      nzOkDanger: true,
      nzOnOk: () => {
        this._delete$.next(folder.id);
      },
  });
  }

  onDrawerClose(): void {
    this.selectedFolderId = null;
    this.showDetail = false;
    this._store.dispatch(new FolderActions.SetCurrent(null));
  }

  onEdit(folder: any): void {
    this.selectedFolderId = folder.id;
    this._store.dispatch(new FolderActions.SetCurrent(folder));
    this.showDetail = true;
  }

  toNote(folder: any): void {
    this.selectedFolderId = folder.id;
    this._store.dispatch(new FolderActions.SetCurrent(folder));

    this._router.navigate([`./${folder.id}/notes`], {
      relativeTo: this._activatedRoute,
    });
  }

  private _initRequests(): void {
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
      });
  }
}
