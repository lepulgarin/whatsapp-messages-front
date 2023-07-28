import { Component, Type, inject } from '@angular/core';
import { DynamicDialogService } from '@shared/services/dynamic-dialog/dynamic-dialog.service';
import { ThemeService } from '@shared/services/theme/theme.service';
import { TranslateService } from '@ngx-translate/core';
import { EventsService } from '@core/services/events/events.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  private readonly dialogService = inject(DynamicDialogService);
  private readonly themeService = inject(ThemeService);
  public readonly translateService = inject(TranslateService);
  public readonly eventsService = inject(EventsService);

  public darkMode: boolean = false;

  public toggleTheme(theme: string): void {
    this.darkMode = !this.darkMode;
    this.themeService.setTheme(theme);
  }

  public toggleLanguage(lang:string): void {
    this.translateService.use(lang);
  }
}
