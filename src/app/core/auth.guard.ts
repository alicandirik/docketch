import { Injectable } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from "@angular/router";
import { Store } from "@ngxs/store";
import { Observable } from "rxjs";
import { CookieService } from "../shared/services";
import { UserActions } from "../shared/states";

@Injectable({
  providedIn: "root",
})
export class AuthGuard implements CanActivate {
  constructor(
    private _cookieService: CookieService,
    private _store: Store,
    private _router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const user = this._cookieService.get("APP_USER");
    const token = this._cookieService.get("APP_TOKEN");

    if (user && token) {
      return true;
    }

    this._router.navigate(["sign/login"]).then(() => {
      return false;
    });
  }
}
