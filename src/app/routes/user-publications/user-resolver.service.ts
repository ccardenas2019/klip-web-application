import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { KlipApiService } from 'src/app/shared/services/klip.services';
import { Customer } from 'src/app/shared/models';

@Injectable({
  providedIn: 'root'
})
export class UserResolverService implements Resolve<Customer> {

  constructor(private service: KlipApiService) {
  }

  resolve() {
    return this.service.getAuthUser();
  }
}
