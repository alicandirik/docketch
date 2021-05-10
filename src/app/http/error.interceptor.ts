import { Injectable } from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { EMPTY, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ErrorService } from '../shared/services';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private _errorService: ErrorService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((err: HttpErrorResponse) => {
        if (!navigator.onLine) {
          this._errorService.handle(
            'No Internet Connection',
            'There is no internet connection. Please check your internet or contact your administrator.'
          );

          return;
        }

        if (err.error.statusCode === 0 || err.error.statusCode === 500 || err.error.statusCode === 504) {
          this._errorService.handle(
            'Server Error',
            'Something went wrong with server. Please try a little bit later.'
          );

          return;
        }

        if (err.error.message) {
          this._errorService.handle('Error', err.error.message);
        }

        return EMPTY;
      })
    );
  }
}
