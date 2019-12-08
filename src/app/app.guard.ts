import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AppService } from './app.service';

@Injectable({
  providedIn: 'root'
})
export class AppGuard implements CanActivate {

  constructor(
    private appService: AppService,
    private router: Router,

    ) {

  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot) {
      const url = state.url;
      if (url === '/klips/list-klips') {
        return this.checkLogin(url) && this.appService.isAdmin;
      } else {
        return this.checkLogin(url);
      }

  }

  private checkLogin(url: string): boolean {
    if (this.appService.isLogged) {
      return true;
    }
    this.appService.redirectURL = url;
    this.router.navigate(['/login']);
  }


}
