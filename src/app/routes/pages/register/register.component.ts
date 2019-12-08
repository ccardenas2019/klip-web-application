import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../../../core/settings/settings.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { GlobalFunctions } from 'src/app/shared/globalFunctions';
import { KlipApiService } from 'src/app/shared/services/klip.services';
import { ToasterConfig, ToasterService } from 'angular2-toaster';
import { AppService } from 'src/app/app.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  form: FormGroup;

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
    public service: KlipApiService,
    fb: FormBuilder,
    private globalFunctions: GlobalFunctions,
    private appService: AppService,
    private router: Router,
    private toasterService: ToasterService
  ) {

    this.form = fb.group({
      firstName: [null, Validators.required],
      lastName: [null, Validators.required],
      email: [null, Validators.compose([Validators.required, CustomValidators.email])],
      accountagreed: [null, Validators.required],
      password: [null, Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z0-9]{6,10}$')])],
      myPreferences: ['all', Validators.required],
    });

    this.toaster = {
      type: 'success',
      title: 'Title',
      text: 'Message'
    };

  }

  submitForm(values: any) {
    if (!this.form.valid) {
      this.globalFunctions.validateAllFormFields(this.form);
      this.alert = this.globalFunctions.errorMessage();
      return;
    }

    this.service.Post('customers', values).subscribe(result => {
      this.alert = this.globalFunctions.successMessage();
      this.form.reset();
    },
      error => {
        this.alert = this.globalFunctions.errorMessage(error);
      }
      , () => {
        this.service.Get('customers').subscribe((result) => {
          const user = result.filter(reg => (reg.email === values.email && reg.password === values.password));
          if (user.length !== 0) {
            this.service.setAuthUser(user[0]);
            /* Login Automatically */
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
    );

  }

  ngOnInit() {
  }

}
