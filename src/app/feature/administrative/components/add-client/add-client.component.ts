import { Component, inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Clients } from '@feature/administrative/shared/interfaces/clients';
import { IdGeneratorService } from '@feature/administrative/shared/services/id-generator.service';
import { DynamicDialogService } from '@shared/services/dynamic-dialog/dynamic-dialog.service';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-add-client',
  templateUrl: './add-client.component.html',
  styleUrls: ['./add-client.component.scss'],
  providers: [IdGeneratorService],
})
export class AddClientComponent {
  private fb: FormBuilder = inject(FormBuilder);
  private dialogService = inject(DynamicDialogService);
  private dialog = inject(DynamicDialogConfig);
  private idGeneratorService = inject(IdGeneratorService);
  public edit = false;
  public clientForm = this.fb.group({
    name: [],
    phone: [],
    email: [],
    date: [],
    value: [],
    paymentValue: [],
    contractValue: [],
    var1: [],
    var2: [],
    var3: [],
  });

  ngOnInit(): void {
    if (this.dialog.data?.client) {
      this.clientForm.patchValue(this.dialog.data.client);
      this.edit = true;
    }
  }

  public submitForm(): void {
    if (this.edit) {
      this.editClient();
    } else {
      this.addClient();
    }
  }

  private editClient(): void {
    const clientsList: Clients[] = JSON.parse(localStorage.getItem('clients') ?? '[]');
    const clientIndex = clientsList.findIndex(
      (client: Clients) => client.id === this.dialog.data.client.id
    );
    clientsList[clientIndex] = { ...this.clientForm.value, id: this.dialog.data.client.id };
    localStorage.setItem('clients', JSON.stringify(clientsList));
    this.dialogService.close();
  }

  private addClient(): void {
    const clientsList: Clients[] = JSON.parse(localStorage.getItem('clients') ?? '[]');
    clientsList.push({ ...this.clientForm.value, id: this.idGeneratorService.generateRandomString(10), send: false });
    localStorage.setItem('clients', JSON.stringify(clientsList));
    this.dialogService.close();
  }

}

