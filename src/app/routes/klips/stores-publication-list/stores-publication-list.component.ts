import { Component, ViewEncapsulation, OnInit, AfterViewInit } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { KlipApiService } from '../../../shared/services/klip.services';
import { MatDialog } from '@angular/material';
import { AddPublicationComponent } from '../add-publication/add-publication.component';
import { Publication } from 'src/app/shared/models';

const swal = require('sweetalert');
const URL = '';


@Component({
  selector: 'app-stores-publication-list',
  templateUrl: './stores-publication-list.component.html',
  styleUrls: ['./stores-publication-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class StoresPublicationListComponent implements AfterViewInit {
  public publications: Array<Publication>;
  public uploader: FileUploader = new FileUploader({ url: URL });
  public tableView = true;
  public showSpinner = true;
  data = [];
  rows = [];


  columns = [
    { name: 'Title', prop: 'title' },  		// 0
    { name: 'Description', prop: 'description' },		// 1
    { name: 'Publication Date', prop: 'fecPublic' },					// 2
    { name: 'Start Date', prop: 'fecIni' },	// 3
    { name: 'Due Date', prop: 'fecFinal' },				// 4
  ];

  private message = {
    show: false,
    status: 'warn',
    text: ''
  };

  constructor(
    private service: KlipApiService,
    private dialog: MatDialog,
  ) { }

  ngAfterViewInit() {
    setTimeout(() => {
      this.getData();
    });
  }


  getData() {
    this.publications = [];
    this.showSpinner = true;
    this.service.Get('klips')
      .subscribe(data => {
        if (data != null) {
          for (const item of data) {
            item.image = this.BufferToImg(item.image.data);
          }
          this.publications = data;
        }
      }
        , (err) => console.error(err)
        , () => this.showSpinner = false
      );
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


  addNewPublication() {
    this.message.show = false;
    const dialogRef = this.dialog.open(AddPublicationComponent, {
      data: this.data,
      width: '90%',
      height: '90%',
      disableClose: true,
      autoFocus: true
    });

    dialogRef.componentInstance.row = null;
    dialogRef.componentInstance.isUpdate = false;
    dialogRef.componentInstance.title = 'Add';

    dialogRef.afterClosed().subscribe(result => {
      if (result[0] === null || result[0] === undefined) {
        this.notification('Cancelled!', 'No publication Added', 'error', 900);
        this.rows = [...this.rows];
      } else {
        this.notification(result[0].title + ' added!', '', 'success', 1500);
        this.rows = [...result];
      }

      for (const item of this.rows) {
        // this.getDataQueries(item);
      }

      this.data = this.rows;
      this.getData();
    });
  }


  updatePublication(row: any): void {
    this.message.show = false;
    const dialogRef = this.dialog.open(AddPublicationComponent, {
      data: this.data,
      width: '90%',
      height: '95%',
      disableClose: true,
      autoFocus: true
    });

    dialogRef.componentInstance.row = row;
    dialogRef.componentInstance.isUpdate = true;
    dialogRef.componentInstance.title = 'Modify';

    dialogRef.afterClosed().subscribe(result => {
      if (result[-1] === null || result[-1] === undefined) {
        this.notification('No changes were made', '', 'error', 900);
        this.rows = [...this.rows];
      } else {
        this.notification(result[-1].title + ' modified!', '', 'success', 1500);
        this.rows = [...result];
      }

      // for (const item of this.rows) {
      // this.getDataQueries(item);
      // }

      this.data = this.rows;
      this.getData();
    });

  }

  deletePublication(row: any) {
    this.service.Delete('klips', row._id).subscribe((result) => {
      console.log(result);
    }
    , (err) => console.error(err)
    , () => {
      this.notification('Deleted!', 'The publication: ' + row.title + ' is deleted now!', 'error', 1500);
      this.getData();
    }
    );

  }



  public showImage(img: any) {
    swal({
      icon: img,
      buttons: false,
      closeOnClickOutside: true
    });
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
