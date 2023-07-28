import { APP_INITIALIZER, Injector, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ValidatorComponent } from './validator/validator.component';
import { DynamicDialogService } from './services/dynamic-dialog/dynamic-dialog.service';
import { NotificationService } from './services/notification/notification.service';
import { ThemeService } from './services/theme/theme.service';
import { LocalStorageDirective } from 'ngx-localstorage';
import {
  TranslateService,
  TranslateModule,
  TranslateLoader,
} from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { firstValueFrom } from 'rxjs';

import { PanelMenuModule } from 'primeng/panelmenu';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { TooltipModule } from 'primeng/tooltip';
import { ImageModule } from 'primeng/image';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';
import { AvatarModule } from 'primeng/avatar';
import { DividerModule } from 'primeng/divider';

export function appInitializerFactory(translate: TranslateService) {
  return () => {
    translate.setDefaultLang('es');
    return firstValueFrom(translate.use('es'));
  };
}

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
@NgModule({
  declarations: [ValidatorComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    LocalStorageDirective,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),

    CardModule,
    InputTextModule,
    ButtonModule,
    CheckboxModule,
    TooltipModule,
    ImageModule,
    OverlayPanelModule,
    PanelMenuModule,
    DynamicDialogModule,
    AvatarModule,
    DividerModule,
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    LocalStorageDirective,
    ValidatorComponent,
    TranslateModule,

    CardModule,
    InputTextModule,
    ButtonModule,
    CheckboxModule,
    TooltipModule,
    ImageModule,
    OverlayPanelModule,
    PanelMenuModule,
    DynamicDialogModule,
    AvatarModule,
    DividerModule,
  ],
  providers: [
    DynamicDialogService,
    TranslateService,
    NotificationService,
    MessageService,
    ThemeService,
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializerFactory,
      deps: [TranslateService, Injector],
      multi: true,
    },

    DialogService,
  ],
})
export class SharedModule {}
