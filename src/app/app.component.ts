import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NotificationState, NotificationActions } from './shared/states';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  private _destroyer$: ReplaySubject<boolean> = new ReplaySubject<boolean>(1);

  title = 'Docketch';

  constructor(private _store: Store, private _notificationService: NzNotificationService) {}

  ngOnInit(): void {
    this._store
      .select(NotificationState.notifications)
      .pipe(takeUntil(this._destroyer$))
      .subscribe((notifications: any) => {
        if (!notifications || notifications.length === 0) {
          return;
        }

        notifications.forEach((notification) => {
          this._notificationService.create(
            notification.status,
            notification.title,
            notification.description,
            {
              nzDuration: notification.duration || 3000
            }
          );
        });

        this._store.dispatch(new NotificationActions.Reset());
      });
  }

  ngOnDestroy(): void {
    this._destroyer$.next(true);
    this._destroyer$.complete();
  }
}
