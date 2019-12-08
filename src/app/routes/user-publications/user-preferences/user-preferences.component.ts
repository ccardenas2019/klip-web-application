import { Component, ViewEncapsulation, OnInit, AfterViewInit } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { KlipApiService } from '../../../shared/services/klip.services';
import { MatDialog } from '@angular/material';
import { Category, Customer } from 'src/app/shared/models';
import { GlobalFunctions } from 'src/app/shared/globalFunctions';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from 'src/app/app.service';

const swal = require('sweetalert');
const URL = '';


@Component({
  selector: 'app-list-klips',
  templateUrl: './user-preferences.component.html',
  styleUrls: ['./user-preferences.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UserPreferencesComponent implements OnInit, AfterViewInit {

  public categories: Array<Category> = [];
  public catSelected: Array<Category> = [];
  public arrayCat = [];
  public arrayCatSel = [];
  public currentCustomer: Customer;

  public alert = {
    show: false,
    status: 'warn',
    text: ''
  };

  constructor(
    public service: KlipApiService,
    public dialog: MatDialog,
    private globalFunctions: GlobalFunctions,
    private activatedRoute: ActivatedRoute,
    private appService: AppService,
    private router: Router,
  ) {
  }

  ngOnInit() {
    this.activatedRoute.data.subscribe((resolverData: { customerInfo: Customer }) => {
      this.currentCustomer = resolverData.customerInfo;
    });

    this.service.Get('tags')
      .subscribe(data => {
        if (data != null) {
          this.categories = data;
          for (const item of data) {
            this.arrayCat.push(item.name);
          }
        }
      });
  }

  public initCatSelected() {
    if (this.catSelected.length === 1) {
      this.arrayCatSel = [];
    }
  }

  public updateCatSelected(values: any): void {
    this.catSelected = this.categories.filter(item => values.some(f => f.value === item.name));
  }

  savePreferences() {
    this.currentCustomer.myCategories = [];
    this.catSelected.forEach(cat => {
      this.currentCustomer.myCategories.push(cat._id);
    });

    this.service.Put('customers', this.currentCustomer._id, this.currentCustomer).subscribe(result => {
      this.service.setAuthUser(this.currentCustomer);
      this.alert = this.globalFunctions.successMessage();
    },
      error => {
        this.alert = this.globalFunctions.errorMessage(error);
        console.log(error);
      }
      , () => {
        this.notification('Preferences Saved!', 'Your Categories have been saved', 'success', 1500);
        setTimeout(() => {
            this.router.navigate(['/user-publications/user-list-publications']);
        }, 1600);
      }
    );
  }

  ngAfterViewInit() {
    if (this.currentCustomer.myCategories !== undefined) {
      setTimeout(() => {
        if (this.currentCustomer.myCategories.length > 0) {
          for (const item of this.currentCustomer.myCategories) {
            const tempCat = this.categories.filter(cat => cat._id === item);
            this.arrayCatSel.push(tempCat[0].name);
          }
        }
      }, 500);
    }
  }

  notification(message: string, description: string, iconType: string, time: number) {
    swal({
      title: message,
      text: description,
      icon: iconType,
      timer: time,
      buttons: false,
      closeOnClickOutside: true,
    });
  }


}
