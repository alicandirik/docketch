import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments";

@Injectable({
  providedIn: "root",
})
export class FolderService {
  api = environment.api;

  constructor(private _http: HttpClient) {}

  getFolders(params: any): Observable<any> {
    return this._http.get(`${this.api}/folders`, {
      params: params,
    });
  }

  current(id: string): Observable<any> {
    return this._http.get(`${this.api}/folders/${id}`);
  }

  create(body: any): Observable<any> {
    return this._http.post(`${this.api}/folders`, body);
  }

  update(body: any): Observable<any> {
    return this._http.put(`${this.api}/folders/${body.id}`, body);
  }

  delete(id: string): Observable<any> {
    return this._http.delete(`${this.api}/folders/${id}`);
  }
}
