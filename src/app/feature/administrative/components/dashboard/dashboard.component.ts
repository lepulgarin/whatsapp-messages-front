import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, Type, ViewChild, inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { WsService } from '@feature/administrative/shared/services/ws.service';
import { DynamicDialogService } from '@shared/services/dynamic-dialog/dynamic-dialog.service';
import { AddClientComponent } from '../add-client/add-client.component';
import { Subject, takeUntil } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { IdGeneratorService } from '@feature/administrative/shared/services/id-generator.service';
import { NotificationService } from '@shared/services/notification/notification.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  @ViewChild('fileUpload') fileInput!: any;

  private http = inject(HttpClient);
  private fb: FormBuilder = inject(FormBuilder);
  private wsService = inject(WsService);
  private dialogService = inject(DynamicDialogService);
  private closeSubjet = new Subject<void>();
  private sanitizer = inject(DomSanitizer);
  private idGeneratorService = inject(IdGeneratorService);
  private notificationService = inject(NotificationService);

  public currentMessage = localStorage.getItem('currentMessage') ?? '';
  public wsForm: FormGroup = this.fb.group({
    message: [''],
    sendImage: [false],
  });
  public clients = [];
  public showImage = true;
  public imgUrl!: any;
  public sendAll = false;

  ngOnInit(): void {
    this.obtainMessage();
    this.obtainClients();
    this.downloadImage();
  }

  public get message(): string {
    return this.wsForm.get('message')?.value;
  }

  private obtainClients(): void {
    const clients = JSON.parse(localStorage.getItem('clients') ?? '[]');
    this.clients = clients;
  }

  public storeMessage(): void {
    if (!this.wsForm.value.message) {
      this.notificationService.showError({
        title: 'Error',
        message: 'El mensaje no puede estar vacío',
      });
      return;
    }
    const messages = JSON.parse(localStorage.getItem('messages') ?? '[]');
    const indexMessage = messages.findIndex(
      (message: any) => message.id === this.currentMessage
    );
    if (indexMessage !== -1) {
      messages[indexMessage] = {
        ...messages[indexMessage],
        message: this.wsForm.value.message,
      };
    } else {
      const id = this.idGeneratorService.generateRandomString(10);
      messages.push({
        id: id,
        message: this.wsForm.value.message,
      });
      this.currentMessage = id;
      localStorage.setItem('currentMessage', this.currentMessage);
    }
    localStorage.setItem('messages', JSON.stringify(messages));
    this.notificationService.showSuccess({
      title: 'Éxito',
      message: 'Mensaje guardado correctamente',
    });
  }

  public cleanMessage(): void {
    this.wsForm.get('message')?.setValue('');
    this.currentMessage = '';
    localStorage.setItem('currentMessage', '');
  }

  public sendMessage(): void {
    this.clients.forEach((client: any) => {
      if (!client.send) return;
      const params = {
        ...this.wsForm.value,
        phone: `57${client.phone}`,
      };
      params.message = this.formatMessage(params.message, client);
      this.wsService.sendMessage(params);
    });
  }

  public onUpload(event: any): void {
    const file = event.currentFiles[0];
    const formData = new FormData();
    formData.set('file', file);
    this.http
      .post<ArrayBuffer>('http://localhost:3001/upload', formData)
      .subscribe({
        next: () => {
          this.downloadImage();
        },
      });
    this.fileInput.clear();
  }

  public addClient(): void {
    this.dialogService.open(AddClientComponent as Type<Component>, {
      title: 'Nuevo cliente',
    });

    this.dialogService.ref.onClose.pipe(takeUntil(this.closeSubjet)).subscribe({
      next: () => {
        this.obtainClients();
        this.closeSubjet.next();
      },
    });
  }

  public editClient(client: any): void {
    this.dialogService.open(AddClientComponent as Type<Component>, {
      title: 'Editar cliente',
      data: { client },
    });

    this.dialogService.ref.onClose.pipe(takeUntil(this.closeSubjet)).subscribe({
      next: () => {
        this.obtainClients();
        this.closeSubjet.next();
      },
    });
  }

  public removeClient(id: number): void {
    const clientsList = JSON.parse(localStorage.getItem('clients') ?? '[]');
    const newClientsList = clientsList.filter(
      (client: any) => client.id !== id
    );
    localStorage.setItem('clients', JSON.stringify(newClientsList));
    this.obtainClients();
  }

  public toggleSendAll(): void {
    this.clients.forEach((client: any) => {
      client.send = this.sendAll;
    });
  }

  public selectMessageEvent(message: string): void {
    this.currentMessage = message;
    localStorage.setItem('currentMessage', this.currentMessage);
    this.obtainMessage();
  }

  private obtainMessage(): void {
    const messages = JSON.parse(localStorage.getItem('messages') ?? '[]');
    const message = messages.find(
      (message: any) => message.id === this.currentMessage
    );
    if (message) {
      this.wsForm.get('message')?.setValue(message.message);
    }
  }

  private downloadImage(): void {
    this.wsService.downloadImage().subscribe({
      next: response => {
        this.imgUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
          `data:image/jpeg;base64,${response}`
        );
      },
    });
  }

  private formatMessage(message: string, client: any): string {
    if(!message) return message;
    return message
      .replace(/\s<\//g, '</')
      .replace(/@name/g, client.name)
      .replace(/@value/g, client.value)
      .replace(/@phone/g, client.phone)
      .replace(/<strong>/g, ' *')
      .replace(/<\/strong>/g, '* ')
      .replace(/<p>/g, '')
      .replace(/<\/p>/g, '')
      .replace(/<em>/g, '_')
      .replace(/<\/em>/g, '_')
      .replace(/\s{2,}/g, ' ');
  }
}

