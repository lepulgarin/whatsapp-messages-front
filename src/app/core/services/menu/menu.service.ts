import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MenuItem } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  public menuItems!: MenuItem[];
  constructor(private readonly translateService: TranslateService) {
    this.getMenuItems();
    this.translateService.onLangChange.subscribe({ next: () => {
      this.getMenuItems();
    } });
  }

  public getMenuItems(): void {
    this.menuItems = [
      {
        label: this.translateService.instant('menu.dashboard'),
        icon: 'pi pi-fw pi-chart-line',
        routerLinkActiveOptions: { exact: true },
        routerLink: ['admin/dashboard'],
      },
      {
        label: this.translateService.instant('menu.products'),
        icon: 'pi pi-fw pi-box',
      },
      // {
      //   label: 'Edit',
      //   icon: 'pi pi-fw pi-pencil',
      //   items: [
      //     {
      //       label: 'Left',
      //       icon: 'pi pi-fw pi-align-left',
      //     },
      //     {
      //       label: 'Right',
      //       icon: 'pi pi-fw pi-align-right',
      //     },
      //     {
      //       label: 'Center',
      //       icon: 'pi pi-fw pi-align-center',
      //     },
      //     {
      //       label: 'Justify',
      //       icon: 'pi pi-fw pi-align-justify',
      //     },
      //   ],
      // },
      // {
      //   label: 'Users',
      //   icon: 'pi pi-fw pi-user',
      //   items: [
      //     {
      //       label: 'New',
      //       icon: 'pi pi-fw pi-user-plus',
      //     },
      //     {
      //       label: 'Delete',
      //       icon: 'pi pi-fw pi-user-minus',
      //     },
      //   ],
      // },
      // {
      //   label: 'Events',
      //   icon: 'pi pi-fw pi-calendar',
      // },
    ];
  }
}

