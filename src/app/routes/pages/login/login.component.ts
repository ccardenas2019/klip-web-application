import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../../../core/settings/settings.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { KlipApiService } from 'src/app/shared/services/klip.services';
import { GlobalFunctions } from 'src/app/shared/globalFunctions';
import { ToasterConfig, ToasterService } from 'angular2-toaster';
import { AppService } from 'src/app/app.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  valForm: FormGroup;

  public alert = {
    show: false,
    status: 'primary',
    text: ''
  };

  toaster: any;
  toasterConfig: any;
  toasterconfig: ToasterConfig = new ToasterConfig({
    positionClass: 'toast-bottom-right',
    showCloseButton: true
  });


  constructor(
    public settings: SettingsService,
    private service: KlipApiService,
    private appService: AppService,
    private router: Router,
    fb: FormBuilder,
    private globalFunctions: GlobalFunctions,
    private toasterService: ToasterService
  ) {

    this.valForm = fb.group({
      email: [null, Validators.compose([Validators.required, CustomValidators.email])],
      password: [null, Validators.required]
    });

    this.toaster = {
      type: 'success',
      title: 'Title',
      text: 'Message'
  };
  }

  submitForm(values: any) {
    if (!this.valForm.valid) {
      this.globalFunctions.validateAllFormFields(this.valForm);
      this.alert = this.globalFunctions.errorMessage();
      return;
    }

    this.service.Get('customers').subscribe((result) => {
      const user = result.filter(reg => (reg.email === values.email && reg.password === values.password));
      if (user.length !== 0) {
        this.service.setAuthUser(user[0]);

        this.toaster.type = 'success';
        this.toaster.title = 'Valid Customer!';
        this.toaster.text = 'Loggin in...';
        this.toasterService.pop(this.toaster.type, this.toaster.title, this.toaster.text);

        setTimeout(() => {
          if (this.appService.redirectURL) {
            this.router.navigate([this.appService.redirectURL]);
            this.appService.redirectURL = null;
          } else {
            this.router.navigate(['/home']);
          }
        }, 2000);


      } else {
        this.toaster.type = 'error';
        this.toaster.title = 'Invalid Customer!';
        this.toaster.text = 'Try again...';

        this.toasterService.pop(this.toaster.type, this.toaster.title, this.toaster.text);
      }
    });


  }

  ngOnInit() {

  }

}
