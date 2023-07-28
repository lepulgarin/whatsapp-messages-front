import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponseBase,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { finalize, catchError } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from '@shared/services/notification/notification.service';

@Injectable()
export class LoaderErrorInterceptor implements HttpInterceptor {
  private totalRequests = 0;
  constructor(
    private readonly notificationService: NotificationService,
    private readonly translateService: TranslateService
  ) {}
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    this.totalRequests++;
    return next.handle(request).pipe(
      finalize(() => {
        this.totalRequests--;
      }),
      catchError((error: HttpResponseBase) => {
        this.notificationService.showError({
          message: this.translateService.instant(`httpErrors.${error.status}`),
        });
        console.log(error);
        return throwError(() => new Error());
      })
    );
  }
}

