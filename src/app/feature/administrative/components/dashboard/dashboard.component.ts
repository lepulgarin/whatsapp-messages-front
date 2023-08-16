import { HttpClient } from '@angular/common/http';
import { Component, Type, ViewChild, inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { WsService } from '@feature/administrative/shared/services/ws.service';
import { DynamicDialogService } from '@shared/services/dynamic-dialog/dynamic-dialog.service';
import { AddClientComponent } from '../add-client/add-client.component';
import { Subject, switchMap, takeUntil, timer } from 'rxjs';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { IdGeneratorService } from '@feature/administrative/shared/services/id-generator.service';
import { NotificationService } from '@shared/services/notification/notification.service';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Clients } from '@feature/administrative/shared/interfaces/clients';
interface Variables {
  name: string;
  value: string;
}
const TIMER = 6000;
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
  public clients: Clients[] = [];
  public variables: Variables[] = [
    {
      name: 'Nombre',
      value: '@name',
    },
    {
      name: 'Teléfono',
      value: '@phone',
    },
    {
      name: 'Correo',
      value: '@email',
    },
    {
      name: 'Fecha',
      value: '@date',
    },
    {
      name: 'Valor abono',
      value: '@value',
    },
    {
      name: 'Valor cancelar',
      value: '@paymentValue',
    },
    {
      name: 'Valor contrato',
      value: '@contractValue',
    },
    {
      name: 'Var 1',
      value: '@var1',
    },
    {
      name: 'Var 2',
      value: '@var2',
    },
    {
      name: 'Var 3',
      value: '@var3',
    },
  ];
  public showImage = true;
  public imgUrl!: SafeResourceUrl;
  public qrUrl!: SafeResourceUrl;
  public sendAll = false;
  public wsStatus = false;
  public showSendWhatsapp = true;
  private currentCursorPos = 0;
  private editorInstance: any;
  private $destroy = new Subject<void>();
  private $destroyQr = new Subject<void>();

  ngOnInit(): void {
    this.obtainMessage();
    this.obtainClients();
    this.downloadImage();
    this.obtainWSStatus();
  }

  ngOnDestroy(): void {
    this.$destroy.next();
    this.$destroy.complete();
  }

  public onInit(event: any) {
    this.editorInstance = event.editor;
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
    this.notificationService.showSuccess({
      title: 'Éxito',
      message: 'Mensaje enviado correctamente',
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

  public onSelectionChange(event: any): void {
    this.currentCursorPos = event.range?.index || this.currentCursorPos;
  }

  public onTextChange(event: any): void {
    this.currentCursorPos =
      event.delta.ops[0].retain + 1 || this.currentCursorPos;
  }

  public addClient(): void {
    this.dialogService.open(AddClientComponent as Type<Component>, {
      title: 'Nuevo cliente',
      width: '30%',
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
      width: '30%',
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

  public exportToExcel(): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(
      this.changeClientsKeys()
    );
    const workbook: XLSX.WorkBook = {
      Sheets: { clientes: worksheet },
      SheetNames: ['clientes'],
    };
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    const data: Blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    saveAs(data, 'clientes.xlsx');
  }

  public addVariableToText(variable: string) {
    this.editorInstance.insertText(this.currentCursorPos, variable);
  }

  public onFileChange(event: any): void {
    const file: File = event.target.files[0];
    const fileReader: FileReader = new FileReader();

    fileReader.onload = (e: any) => {
      const arrayBuffer: ArrayBuffer = e.target.result;
      const workbook: XLSX.WorkBook = XLSX.read(arrayBuffer, { type: 'array' });
      const worksheet: XLSX.WorkSheet = workbook.Sheets[workbook.SheetNames[0]];
      const importedData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      importedData.shift();
      const clients = importedData.map((client: any) => {
        return {
          name: client[0],
          phone: client[1],
          email: client[2],
          date: client[3],
          value: client[4],
          paymentValue: client[5],
          contractValue: client[6],
          var1: client[7],
          var2: client[8],
          var3: client[9],
          id: this.idGeneratorService.generateRandomString(10),
          send: false,
        };
      });
      const clientsList = JSON.parse(localStorage.getItem('clients') ?? '[]');
      const newClientsList = [...clientsList, ...clients];
      localStorage.setItem('clients', JSON.stringify(newClientsList));
      this.obtainClients();
    };
    fileReader.readAsArrayBuffer(file);
  }

  public deleteAllClients(): void {
    localStorage.setItem('clients', JSON.stringify([]));
    this.obtainClients();
  }

  public toggleQr(): void {
    this.showSendWhatsapp = !this.showSendWhatsapp;
    if (!this.showSendWhatsapp) {
      this.downloadQr();
    } else {
      this.$destroyQr.next();
    }
  }

  private obtainWSStatus(): void {
    timer(0, TIMER)
      .pipe(
        switchMap(() => this.wsService.getStatus()),
        takeUntil(this.$destroy)
      )
      .subscribe({
        next: status => {
          this.wsStatus = status;
        },
      });
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

  private downloadQr(): void {
    timer(0, TIMER)
      .pipe(
        switchMap(() => this.wsService.obtainQr()),
        takeUntil(this.$destroyQr)
      )
      .subscribe({
        next: response => {
          this.qrUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
            `data:image/svg+xml;base64,${response}`
          );
        },
      });
  }

  public formatMessage(message: string, client: any): string {
    if (!message) return message;
    return message
      .replace(/\s<\//g, '</')
      // .replace(/\s{2,}/g, ' ')
      .replace(/@name/g, client.name)
      .replace(/@phone/g, client.phone)
      .replace(/@email/g, client.email)
      .replace(/@date/g, client.date)
      .replace(/@value/g, this.convertToCurrency(client.value))
      .replace(/@paymentValue/g, this.convertToCurrency(client.paymentValue))
      .replace(/@contractValue/g, this.convertToCurrency(client.contractValue))
      .replace(/@var1/g, client.var1)
      .replace(/@var2/g, client.var2)
      .replace(/@var3/g, client.var3)
      .replace(/<strong>/g, ' *')
      .replace(/<\/strong>/g, '* ')
      .replace(/<\/li>/g, '')
      .replace(/<em>/g, '_')
      .replace(/&nbsp;/g, ' ')
      .replace(/<\/em>/g, '_')
      .replace(/<\/p>/g, '')
      .replace(/<br>/g, '')
      .replace(/<p>/, '')
      .replace(/<p>/g, '\n')
      .replace(/<ol>(.*?)<\/ol>/gs, (match, p1) => {
        let items = p1
          .split('<li>')
          .filter((item: string) => item.trim() !== '');
        let numberedItems = items.map(
          (item: string, index: number) => `      ${index + 1}. ${item}`
        );
        return `\n${numberedItems.join('\n')}`;
      })
      .replace(/<ul>(.*?)<\/ul>/gs, (match, p1) => {
        let items = p1
          .split('<li>')
          .filter((item: string) => item.trim() !== '');
        let bulletItems = items.map((item: string) => `     *•* ${item.trim()}`);
        return `\n${bulletItems.join('\n')}\n`;
      });
  }

  private convertToCurrency(value: number): string {
    return Number(value)?.toLocaleString('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    });
  }

  private changeClientsKeys(): any[] {
    const newClients = this.clients.map((client: Clients) => {
      return {
        nombre: client.name,
        telefono: client.phone,
        correo: client.email,
        fecha: client.date,
        'valor a abonar': client.value,
        'valor a cancelar': client.paymentValue,
        'valor de contrato': client.contractValue,
        var1: client.var1,
        var2: client.var2,
        var3: client.var3,
      };
    });
    return newClients;
  }
}

