import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LocalStorageService } from 'ngx-localstorage';
import { AppComponent } from './app.component';
import { CoreModule } from '@core/core.module';
import { AppRoutingModule } from './app-routing.module';
import { ToastModule } from 'primeng/toast';

@NgModule({
  declarations: [AppComponent],
  imports: [
    CoreModule,
    BrowserAnimationsModule,
    BrowserModule,
    AppRoutingModule,
    ToastModule,
  ],
  providers: [
    LocalStorageService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
