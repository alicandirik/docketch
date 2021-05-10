import { Injectable } from '@angular/core';
import { NzNotificationDataOptions, NzNotificationService } from 'ng-zorro-antd/notification';

@Injectable()
export class ErrorService {
  constructor(private _notificationService: NzNotificationService) {}

  handle(title: string, message: string, options?: NzNotificationDataOptions): void {
    this._notificationService.error(title, message, { ...options });
  }
}
