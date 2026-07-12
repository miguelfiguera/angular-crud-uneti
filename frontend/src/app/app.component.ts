import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div class="min-h-screen bg-background">
      <header class="border-b">
        <div class="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <div class="flex items-center gap-2">
            <span class="text-xl font-bold">🎬 Cine UNETI</span>
          </div>
          <span class="text-sm text-muted-foreground">Informática · Bases de Datos</span>
        </div>
      </header>
      <main>
        <router-outlet />
      </main>
    </div>
  `,
})
export class AppComponent {}
