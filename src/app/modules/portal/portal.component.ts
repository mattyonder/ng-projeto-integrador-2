import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-portal',
    imports: [RouterOutlet],
    template: `
    <main class="h-screen w-screen">
      <router-outlet />
    </main>
  `,
    styles: ``
})
export class PortalComponent {}
