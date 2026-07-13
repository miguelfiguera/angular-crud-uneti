import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UiButtonComponent } from './components/ui/button.component';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, UiButtonComponent],
  template: `
    <div class="min-h-screen bg-background">
      <header class="border-b border-border">
        <div class="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <div class="flex items-center gap-2">
            <span class="text-xl font-bold">🎬 Cine UNETI</span>
          </div>
          <div class="flex items-center gap-3">
            <span class="hidden text-sm text-muted-foreground sm:inline">
              Informática · Bases de Datos
            </span>
            <ui-button variant="ghost" size="sm" (click)="theme.toggle()">
              @if (theme.isDark()) {
                <span class="flex items-center gap-2">
                  <span aria-hidden="true">☀️</span>
                  <span>Claro</span>
                </span>
              } @else {
                <span class="flex items-center gap-2">
                  <span aria-hidden="true">🌙</span>
                  <span>Oscuro</span>
                </span>
              }
            </ui-button>
          </div>
        </div>
      </header>
      <main>
        <router-outlet />
      </main>
    </div>
  `,
})
export class AppComponent implements OnInit {
  constructor(readonly theme: ThemeService) {}

  ngOnInit(): void {
    this.theme.init();
  }
}
