import { Injectable, Signal, WritableSignal, computed, signal } from '@angular/core';

@Injectable()
export class EventsService {
  private hiddenSideBar: WritableSignal<boolean> = signal<boolean>(true)
  public hiddenSideBar$: Signal<boolean> = computed<boolean>(() => this.hiddenSideBar())
  constructor() {}

  public toggleSideBar() {
    this.hiddenSideBar.set(!this.hiddenSideBar$())
  }

  public hideSideBar() {
    this.hiddenSideBar.set(true)
  }
}

