import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpService } from './services/http.service';
import { SharedModule } from '@shared/shared.module';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { LoaderErrorInterceptor } from './interceptors/loader-error.interceptor';
import { HeadersInterceptor } from './interceptors/headers.interceptor';
import { EventsService } from './services/events/events.service';

@NgModule({
  declarations: [HeaderComponent, FooterComponent],
  imports: [CommonModule, SharedModule, HttpClientModule],
  exports: [HeaderComponent, FooterComponent],
  providers: [
    HttpService,
    EventsService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoaderErrorInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HeadersInterceptor,
      multi: true,
    },
  ],
})
export class CoreModule {}
