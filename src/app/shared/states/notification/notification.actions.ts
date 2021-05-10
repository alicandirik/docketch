import { Notification } from '../../types/notification.interface';

export namespace NotificationActions {
  enum ActionTypes {
    SHOW = '[Notification] Show',
    RESET = '[Notification] Reset'
  }

  export class Show {
    static readonly type = ActionTypes.SHOW;

    constructor(public payload: Notification) {}
  }

  export class Reset {
    static readonly type = ActionTypes.RESET;
  }
}
