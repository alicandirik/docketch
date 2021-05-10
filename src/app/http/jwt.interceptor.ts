import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { Store } from "@ngxs/store";
import { CookieService } from "../shared/services";
import { NotificationActions } from "../shared/states";

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(
    private _store: Store,
    private _router: Router,
    private _cookieService: CookieService
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = this._cookieService.get("APP_TOKEN");

    if (token && !req.url.includes("auth")) {
      const userId = this._cookieService.get("APP_USER");

      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
        setParams: { user: userId },
      });

      return next.handle(req).pipe(
        catchError((err) => {
          if (err instanceof HttpErrorResponse && err.status === 401) {
            this._router.navigate(["sign/login"]).then(() => {
              this._store.dispatch(
                new NotificationActions.Show({
                  title: "Need Login",
                  description: "You need to re-login to continue",
                  status: "warning",
                })
              );
            });
            return throwError(err);
          }
        })
      );
    }

    return next.handle(req);
  }
}
