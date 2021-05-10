import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "src/environments";
import { User } from "../../types";

@Injectable()
export class AuthService {
  protected api = environment.api;

  constructor(private _http: HttpClient) {}

  register(payload: User): Observable<any> {
    return this._http.post(`${this.api}/auth/sign-up`, {
      ...payload,
    });
  }

  login(payload: { email: string; password: string }): Observable<any> {
    return this._http.post(`${this.api}/auth/local`, {
      ...payload,
    });
  }

  me(): Observable<any> {
    return this._http.get(`${this.api}/users/me`);
  }
}
