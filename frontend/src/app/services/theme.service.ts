import { Injectable, signal } from '@angular/core';

const STORAGE_KEY = 'cine-uneti-theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly isDark = signal(true);

  init(): void {
    const stored = localStorage.getItem(STORAGE_KEY);
    const dark = stored !== 'light';
    this.apply(dark);
  }

  toggle(): void {
    this.apply(!this.isDark());
  }

  private apply(dark: boolean): void {
    this.isDark.set(dark);
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem(STORAGE_KEY, dark ? 'dark' : 'light');
  }
}
