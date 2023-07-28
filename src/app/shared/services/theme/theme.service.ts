import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';

@Injectable()
export class ThemeService {
  constructor(@Inject(DOCUMENT) private document: Document) {}

  public setTheme(theme: string): void {
    let themeLink = this.document.getElementById(
      'app-theme'
    ) as HTMLLinkElement;
    if (themeLink) {
      themeLink.href = `${theme}.css`;
    }
  }
}

