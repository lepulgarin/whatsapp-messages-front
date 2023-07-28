import { HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { HttpService } from '@core/services/http.service';
import { Observable } from 'rxjs';

@Injectable()
export class WsService {
  private httpService: HttpService = inject(HttpService);

  public sendMessage(formData: FormData): void {
    this.httpService
      .doPost('http://localhost:3001/lead', formData)
      .subscribe();
  }

  public uploadFile(formData: FormData): Observable<any> {
    return this.httpService
      .doPost('http://localhost:3001/upload', formData)
  }

  public downloadImage(): Observable<any> {
    return this.httpService
      .doGetFile('http://localhost:3001/download', {
        headers: new HttpHeaders({ 'Content-Type': 'image/jpeg' }),
      })
  }

  public getStatus(): Observable<any> {
    return this.httpService.doGet('http://localhost:3001/lead/status');
  }

  public obtainQr(): void {
    this.httpService
      .doGetFile('http://localhost:3001/qr', {
        headers: new HttpHeaders({ 'Content-Type': 'image/svg+xml' }),
      })
      .subscribe();
  }
}

