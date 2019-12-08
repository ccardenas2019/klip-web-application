import { NgModule } from '@angular/core';
import { AddPublicationComponent } from './add-publication/add-publication.component';
import { Routes, RouterModule } from '@angular/router';


import { ColorPickerModule, ColorPickerService } from 'ngx-color-picker';
import { NgxSelectModule } from 'ngx-select-ex'
import { TextMaskModule } from 'angular2-text-mask';
import { TagInputModule } from 'ngx-chips';
import { CustomFormsModule } from 'ng2-validation';
import { FileUploadModule } from 'ng2-file-upload';
import { ImageCropperModule } from 'ng2-img-cropper';

import { SharedModule } from '../../shared/shared.module';
import { StoresPublicationListComponent } from './stores-publication-list/stores-publication-list.component';
import { UserResolverService } from '../user-publications/user-resolver.service';
import { AppGuard } from 'src/app/app.guard';


const routes: Routes = [
  {
    path: 'add-klip',
    component: AddPublicationComponent,
    resolve: { customerInfo: UserResolverService },
    canActivate: [AppGuard]
  },
  {
    path: 'list-klips',
    component: StoresPublicationListComponent,
    resolve: { customerInfo: UserResolverService },
    canActivate: [AppGuard]
  },
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
    NgxSelectModule,
    ColorPickerModule,
    TextMaskModule,
    TagInputModule,
    CustomFormsModule,
    FileUploadModule,
    ImageCropperModule
  ],
  providers: [ColorPickerService],
  declarations: [AddPublicationComponent, StoresPublicationListComponent],
  exports: [
    RouterModule
  ]
})
export class KlipsModule { }
