import { Component, OnInit } from '@angular/core';

import { KlipApiService } from 'src/app/shared/services/klip.services';
import { Router } from '@angular/router';
import { ToasterService, ToasterConfig } from 'angular2-toaster';
import { adjustColumnWidths } from '@swimlane/ngx-datatable';

@Component({
  selector: 'app-userblock',
  templateUrl: './userblock.component.html',
  styleUrls: ['./userblock.component.scss']
})
export class UserblockComponent implements OnInit {
  showSpinner = true;
  view = 'Customer';
  loginShow: boolean;
  tempUser: any;

  user = {
    firstName: '',
    lastName: '',
    email: '',
    picture: ''
  };

  toaster: any;
  toasterConfig: any;
  toasterconfig: ToasterConfig = new ToasterConfig({
    positionClass: 'toast-bottom-right',
    showCloseButton: true
  });

  constructor(
    private klipservice: KlipApiService,
    private router: Router,
    private toasterService: ToasterService
  ) {

    this.tempUser = this.klipservice.getAuthUser();

    if (this.klipservice.anyUser()) {
      this.loginShow = false;
    } else {
      this.loginShow = true;
    }

    this.toaster = {
      type: 'success',
      title: 'Title',
      text: 'Message'
  };

  }
  ngAfterViewInit() {
    setTimeout(() => {
      this.user = {
        firstName: this.tempUser.firstName,
        lastName: this.tempUser.lastName,
        email: this.tempUser.email,
        picture: 'assets/img/user/11.jpg'
      };
      this.showSpinner = false;
      this.user.email === 'admin@klip.com' ? this.view = 'Editor' : this.view = 'Customer';
    }, 1000);
  }

  ngOnInit() {
  }

  logout() {
    this.klipservice.deleteAuthUser();

    this.toaster.type = 'warning';
    this.toaster.title = 'Log Out';
    this.toaster.text = 'Loggin out...';
    this.toasterService.pop(this.toaster.type, this.toaster.title, this.toaster.text);

    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 2000);
  }

  login() {
    // router ...
    this.router.navigate(['/login']);
  }


}
