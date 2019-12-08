import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslatorService } from '../core/translator/translator.service';
import { MenuService } from '../core/menu/menu.service';
import { SharedModule } from '../shared/shared.module';
import { PagesModule } from './pages/pages.module';

import { menu } from './menu';
import { KlipApiService } from '../shared/services/klip.services'
import { routes } from './routes';

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forRoot(routes),
    PagesModule
  ],
  exports: [
    RouterModule
  ]
})

export class RoutesModule {
  constructor(
    public menuService: MenuService,
    tr: TranslatorService,
    klipService: KlipApiService) {
    try {
        menuService.addMenu(menu);
    } catch (error) {

    }

  }
}
