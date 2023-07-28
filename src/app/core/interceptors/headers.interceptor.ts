import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';

@Injectable()
export class HeadersInterceptor implements HttpInterceptor {
  constructor(private readonly translateService: TranslateService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const languaje = this.translateService.currentLang;
    const authRequest = request.clone({
      headers: request.headers.set('Accepted-Language', `${languaje}`),
    });
    return next.handle(authRequest);
  }
}

