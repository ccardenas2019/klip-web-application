import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


import { ColorPickerModule, ColorPickerService } from 'ngx-color-picker';
import { NgxSelectModule } from 'ngx-select-ex'
import { TextMaskModule } from 'angular2-text-mask';
import { TagInputModule } from 'ngx-chips';
import { CustomFormsModule } from 'ng2-validation';
import { FileUploadModule } from 'ng2-file-upload';
import { ImageCropperModule } from 'ng2-img-cropper';

import { SharedModule } from '../../shared/shared.module';
import { UserPublicationListComponent } from './user-publication-list/user-publication-list.component';
import { UserPreferencesComponent } from './user-preferences/user-preferences.component';
import { AppGuard } from 'src/app/app.guard';
import { UserResolverService } from './user-resolver.service';


const routes: Routes = [
  {
    path: 'user-list-publications',
    component: UserPublicationListComponent,
    resolve: { customerInfo: UserResolverService },
    canActivate: [AppGuard]
  },
  {
    path: 'user-preferences',
    component: UserPreferencesComponent,
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
  declarations: [UserPublicationListComponent, UserPreferencesComponent],
  exports: [
    RouterModule
  ]
})
export class UserPublicationsModule { }
