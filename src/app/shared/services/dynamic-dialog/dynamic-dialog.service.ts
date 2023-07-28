import { Injectable, Type, Component } from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

@Injectable()
export class DynamicDialogService {
  public ref!: DynamicDialogRef;
  constructor(private readonly dialogService: DialogService) {}

  public open(component: Type<Component>, options?: any): void {
    this.ref = this.dialogService.open(component, {
      styleClass: 'login-dialog',
      header: options.title || '',
      data: options.data,
    });
  }

  public close() {
    this.ref.close();
  }
}
