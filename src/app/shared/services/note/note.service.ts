import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments";

@Injectable({
  providedIn: "root",
})
export class NoteService {
  protected api = environment.api;

  constructor(private _http: HttpClient) {}

  getNotes(params?: any): Observable<any> {
    return this._http.get(`${this.api}/notes`, {
      params: params,
    });
  }

  current(id: string): Observable<any> {
    return this._http.get(`${this.api}/notes/${id}`);
  }

  create(body: any): Observable<any> {
    return this._http.post(`${this.api}/notes`, body);
  }

  update(body: any): Observable<any> {
    return this._http.put(`${this.api}/notes/${body.id}`, body);
  }

  delete(id: string): Observable<any> {
    return this._http.delete(`${this.api}/notes/${id}`);
  }
}
