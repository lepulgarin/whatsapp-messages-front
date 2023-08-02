import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdministrativeRoutingModule } from './administrative-routing.module';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import { WsService } from './shared/services/ws.service';
import { FileUploadModule } from 'primeng/fileupload';
import { TableModule } from 'primeng/table';
import { AddClientComponent } from './components/add-client/add-client.component';
import { EditorModule } from 'primeng/editor';
import { CheckboxModule } from 'primeng/checkbox';
import { TooltipModule } from 'primeng/tooltip';
import { MessagesComponent } from './components/messages/messages.component';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { IdGeneratorService } from './shared/services/id-generator.service';
import { InputNumberModule } from 'primeng/inputnumber';

@NgModule({
  declarations: [DashboardComponent, AddClientComponent, MessagesComponent],
  imports: [
    CommonModule,
    AdministrativeRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    InputTextModule,
    InputTextareaModule,
    ButtonModule,
    FileUploadModule,
    TableModule,
    EditorModule,
    CheckboxModule,
    TooltipModule,
    OverlayPanelModule,
    InputNumberModule,
  ],
  providers: [WsService, IdGeneratorService],
})
export class AdministrativeModule {}

