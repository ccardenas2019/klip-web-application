import { Component, ViewEncapsulation, OnInit, AfterViewInit } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { KlipApiService } from '../../../shared/services/klip.services';
import { MatDialog } from '@angular/material';
import { Category, Customer, Publication } from 'src/app/shared/models';
import { map } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';

const swal = require('sweetalert');
const URL = '';


@Component({
  selector: 'app-user-publication-list',
  templateUrl: './user-publication-list.component.html',
  styleUrls: ['./user-publication-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UserPublicationListComponent implements OnInit, AfterViewInit {
  public publications: Array<Publication> = [];
  private categories: Array<Category> = [];
  private catSelected: Array<Category> = [];
  private arrayCat = [];
  private arrayCatSel = [];
  public viewAll = false;
  public showSpinner = true;
  private currentCustomer: Customer;
  data = [];
  rows = [];


  columns = [
    { name: 'Title', prop: 'title' },  		// 0
    { name: 'Description', prop: 'description' },		// 1
    { name: 'Publication Date', prop: 'fecPublic' },					// 2
    { name: 'Start Date', prop: 'fecIni' },	// 3
    { name: 'Due Date', prop: 'fecFinal' },				// 4
  ];

  public message = {
    show: false,
    status: 'warn',
    text: ''
  };

  constructor(
    public service: KlipApiService,
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute
  ) {

  }

  ngOnInit() {
    this.activatedRoute.data.subscribe((resolverData: {customerInfo: Customer }) => {
      this.currentCustomer = resolverData.customerInfo;
      resolverData.customerInfo.myCategories.forEach(cat => {
        this.arrayCat.push(cat);
      });
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.getData();
    }, 5500);
  }


  getData(): void {
    this.publications = [];
    this.showSpinner = true;
    let timeout;
    // this.service.Get('klips').forEach(reg => reg.forEach(inreg => inreg.tag.forEach(tag => { this.publications.push(tag._id); })));
    if (!this.viewAll) {
      const subGet = this.service.Get('klips').subscribe((result => {
        clearTimeout(timeout);
        this.publications = result.filter((klip) => {
          if (klip.tag.find((cat) => {
            if (this.currentCustomer.myCategories.includes(cat._id)) {
              return cat;
            }
          })) {
            klip.image = this.BufferToImg(klip.image.data);
            return klip;
          }
        });

        if (this.publications.length === 0) {
          this.viewAll = true;
          this.getData();
        }

      })
        , (err) => console.error(err)
        , () => this.showSpinner = false
      );

      timeout = setTimeout(
        () => { subGet.unsubscribe(); }, 5000
      );

    } else {
      const subGet = this.service.Get('klips').subscribe((result => {
        for (const item of result) {
          item.image = this.BufferToImg(item.image.data);
        }
        this.publications = result;
      })
        , (err) => console.error(err)
        , () => this.showSpinner = false
      );

      timeout = setTimeout(
        () => { subGet.unsubscribe(); }, 5000
      );

    }

  }

  BufferToImg(imageBuffered: any): string {
    const dataURI = imageBuffered;
    const btoaString = btoa(new Uint8Array(dataURI).reduce((data, byte) => {
      return data + String.fromCharCode(byte);
    }, ''));

    const byteString = 'data:image/png;base64,' + btoaString;

    const URLDecoded = atob(byteString.replace(/^data:image\/(png|jpeg|jpg);base64,/, ''));

    return URLDecoded;
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
