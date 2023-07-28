import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss'],
})
export class MessagesComponent {
  @Output() seletedMessage: EventEmitter<string> = new EventEmitter();
  public messages = JSON.parse(localStorage.getItem('messages') ?? '[]');

  public deleteMessage(message: any): void {
    let messages = JSON.parse(localStorage.getItem('messages') ?? '[]');
    messages = messages.filter((m: any) => m.id !== message);
    localStorage.setItem('messages', JSON.stringify(messages));
    this.messages = messages;
  }

  public selectMessage(message: string): void {
    this.seletedMessage.emit(message);
  }
}

