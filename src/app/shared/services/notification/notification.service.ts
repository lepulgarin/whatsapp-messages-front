import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable()
export class NotificationService {
  constructor(private messageService: MessageService) {}

  public showError({
    severity = 'error',
    title,
    message,
  }: {
    severity?: string;
    title?: string;
    message?: string;
  }): void {
    this.messageService.add({
      severity: severity,
      summary: title ?? 'Error',
      detail: message ?? 'Something went wrong',
    });
  }

  public showSuccess({
    severity = 'success',
    title,
    message,
  }: {
    severity?: string;
    title?: string;
    message?: string;
  }): void {
    this.messageService.add({
      severity: severity,
      summary: title ?? 'Success',
      detail: message ?? 'Action completed successfully',
    });
  }
}

