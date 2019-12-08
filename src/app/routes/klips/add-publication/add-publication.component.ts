import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { KlipApiService } from '../../../shared/services/klip.services';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { GlobalFunctions } from '../../../shared/globalFunctions';
import { Category } from 'src/app/shared/models';

const swal = require('sweetalert');
const URL = '';


@Component({
  selector: 'app-add-publication',
  templateUrl: './add-publication.component.html',
  styleUrls: ['./add-publication.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AddPublicationComponent implements OnInit {
  public uploader: FileUploader = new FileUploader({ url: URL });
  public hasBaseDropZoneOver = false;
  public hasAnotherDropZoneOver = false;
  public color = 'red';

  public title = 'Add';
  public klips = [];
  public categories: Array<Category> = [];
  public catSelected: Array<Category> = [];
  public arrayCat = [];
  public arrayCatSel = [];
  public isUpdate: boolean;
  form: FormGroup;

  public alert = {
    show: false,
    status: 'primary',
    text: ''
  };

  public row: any;
  public ftype = 0;

  public bsConfig = {
    containerClass: 'theme-angle'
  }

  public publicationImage: any;

  constructor(
    public dialogRef: MatDialogRef<AddPublicationComponent>,
    fb: FormBuilder,
    public service: KlipApiService,
    private globalFunctions: GlobalFunctions,
    @Inject(MAT_DIALOG_DATA) public data: any

  ) {

    this.form = fb.group({
      title: [null, Validators.required],
      description: [null, Validators.maxLength(200)],
      tag: [null],
      fecUpload: [new Date(), Validators.required],
      fecPublic: [new Date(), Validators.required],
      fecIni: [new Date(), Validators.required],
      fecFinal: [new Date(), Validators.required],
      image: [null, Validators.required]
    });



  }

  ngOnInit() {
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

  public remove() {
    if (this.catSelected.length === 1) {
      this.arrayCatSel = [];
    }
  }

  public refreshValue(values: any): void {
    this.catSelected = this.categories.filter(item => values.some(f => f.value === item.name));
  }


  ngAfterViewInit() {
    if (this.isUpdate) {
      setTimeout(() => {
        // this.title = 'Editar';
        this.ftype = 1;

        this.setValues(this.row);
        this.publicationImage = this.row.image;
      });
    }
  }

  setValues(row) {
    this.form.controls.title.setValue(row.title);
    this.form.controls.description.setValue(row.description);
    this.form.controls.fecIni.setValue(new Date(row.fecIni));
    this.form.controls.fecFinal.setValue(new Date(row.fecFinal));
    this.form.controls.fecUpload.setValue(new Date(row.fecUpload));
    this.form.controls.fecPublic.setValue(new Date(row.fecPublic));
    this.form.controls.image.setValue(row.image);
    this.catSelected = row.tag;
    for (const item of row.tag) {
      this.arrayCatSel.push(item.name);
    }
  }

  closeModal() {
    this.dialogRef.close(this.data);
  }

  submitForm(values: any, closeModal = false) {

    if (!this.form.valid) {
      this.globalFunctions.validateAllFormFields(this.form);

      this.alert = this.globalFunctions.errorMessage();
      return;
    }

    values.tag = this.catSelected;

    if (this.isUpdate) {
      this.service.Put('klips', this.row._id, values).subscribe(result => {
        this.data[this.data.indexOf(this.data.filter(x => x === this.row)[0])] = values;

        this.row = values;

        this.alert = this.globalFunctions.successMessage();


        if (closeModal) {
          this.dialogRef.close(this.data);
        }
      },
        error => {
          this.alert = this.globalFunctions.errorMessage(error);
        });
    } else {
      this.service.Post('klips', values).subscribe(result => {
        this.data.push(result);

        this.alert = this.globalFunctions.successMessage();

        this.form.reset();

        // this.form.controls['idreg_posicion'].setValue(0);

        if (closeModal) {
          this.dialogRef.close(this.data);
        }

      },
        error => {
          this.alert = this.globalFunctions.errorMessage(error);
        });
    }


  }

  previewImage() {
    // Make sure it replace the first on the queue (it supports many)
    const last = this.uploader.queue.length;
    // File object
    const f = this.uploader.queue[last - 1]._file;
    const reader = new FileReader();

    reader.onload = ((file) => {
      return (e: any) => {
        const binaryData = e.target.result;
        // Sending the Binary Data
        this.form.controls.image.setValue(binaryData);
      };
    })(f);

    // enables the image to ve previewed
    if (f) {
      reader.readAsDataURL(f);
    }
    reader.addEventListener('load', () => {
      this.publicationImage = reader.result;
    }, false);

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


  showImage() {
    swal({
      icon: this.publicationImage,
      buttons: false,
      closeOnClickOutside: true
    });
  }


}
