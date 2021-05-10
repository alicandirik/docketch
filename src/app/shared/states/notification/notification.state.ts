import { Action, Selector, State, StateContext } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { NotificationActions } from './notification.actions';
import { Notification } from '../../types/notification.interface';

@State<Notification[]>({
  name: 'notification',
  defaults: []
})
@Injectable()
export class NotificationState {
  @Selector()
  static notifications(state: Notification[]) {
    return state;
  }

  @Action(NotificationActions.Show)
  setNotification(
    { getState, setState }: StateContext<Notification[]>,
    { payload }: NotificationActions.Show
  ) {
    const state = getState();

    setState([...state, payload]);
  }

  @Action(NotificationActions.Reset)
  reset({ setState }: StateContext<Notification[]>) {
    setState([]);
  }
}
