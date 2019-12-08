import { Injectable } from '@angular/core';
import { Observable, throwError, Subscriber, Subscription } from 'rxjs';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';

import { Customer } from '../models';
import { AppService } from 'src/app/app.service';

@Injectable()
export class KlipApiService {
  private BASE_URL = 'https://klip-backend-cse2019.herokuapp.com/';
  private authUser: Customer;
  private defaultUser = {
    id: '',
    firstName: 'Usuario',
    lastName: 'Customer',
    email: 'login@login.com',
    password: null,
    myCategorie: []
  };

  constructor(private http: HttpClient, private appService: AppService) {
    this.deleteAuthUser();
    if (localStorage.getItem('currentUser')) {
      this.authUser = KlipApiService.factoryCustomer(JSON.parse(localStorage.getItem('currentUser'))[0]);
    } else {
      this.authUser = KlipApiService.factoryCustomer(this.defaultUser);
    }
  }

  // Factory Pattern
  static factoryCustomer(jsonCustomer: any): Customer {
    return new Customer(
      jsonCustomer.id,
      jsonCustomer.firstName,
      jsonCustomer.lastName,
      jsonCustomer.email,
      jsonCustomer.password,
      jsonCustomer.myCategories
    );
  }

  anyUser(): boolean {
    if (localStorage.getItem('currentUser') !== null) {
      return true;
    } else {
      return false;
    }
  }

  getAuthUser(): Customer {
    return this.authUser;
  }

  setAuthUser(authCustomer: Customer): void {
    this.authUser = authCustomer;
    localStorage.removeItem('currentUser');
    localStorage.setItem('currentUser', JSON.stringify(authCustomer));
    this.appService.isLogged = true;
    if (this.authUser.email === 'admin@klip.com') {
      this.appService.isAdmin = true;
    }
  }

  deleteAuthUser() {
    localStorage.removeItem('currentUser');
    this.authUser = KlipApiService.factoryCustomer(this.defaultUser);
    this.appService.isLogged = false;
    this.appService.isAdmin = false;
  }

  Get(obj): Observable<any> {
    return this.http.get(this.BASE_URL + obj)
      .pipe(map(this.extractData), catchError(this.handleError));
  }

  GetById(obj, id): Observable<any> {
    return this.http.get(this.BASE_URL + obj + '/' + id)
      .pipe(map(this.extractData), catchError(this.handleError));
  }

  Post(obj, values): Observable<any> {
    return this.http.post(this.BASE_URL + obj, values)
      .pipe(map(this.extractData), catchError(this.handleError));
  }

  Put(obj, id, values): Observable<any> {
    return this.http.put(this.BASE_URL + obj + '/' + id, values)
      .pipe(map(this.extractData), catchError(this.handleError));
  }

  Delete(obj, id): Observable<any> {
    return this.http.delete(this.BASE_URL + obj + '/' + id)
      .pipe(map(this.extractData), catchError(this.handleError));
  }

  private extractData(res: any): any {
    const body = res;
    return body || {};
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      return throwError(
        'Ha ocurrido un error al realizar la operación');
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      return throwError(
        'Ha ocurrido un error al realizar la operación');
    }
    // return an observable with a user-facing error message
  };
}
