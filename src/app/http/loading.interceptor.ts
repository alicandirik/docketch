import { Injectable } from "@angular/core";
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from "@angular/common/http";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { Store } from "@ngxs/store";
import { LoadingActions } from "../shared/states";

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  constructor(private _store: Store) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (req.params.has("isSearch")) {
      let clone = req.clone({
        params: req.params.delete('isSearch')
      })

      return next.handle(clone);
    }

    return next.handle(req).pipe(
      tap(
        () => {
          this._store.dispatch(new LoadingActions.Show());
        },
        () => {
          this._store.dispatch(new LoadingActions.Hide());
        },
        () => {
          this._store.dispatch(new LoadingActions.Hide());
        }
      )
    );
  }
}
