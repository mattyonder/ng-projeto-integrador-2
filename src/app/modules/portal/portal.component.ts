import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-portal',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <main class="flex h-screen w-screen   justify-center items-center">
      <router-outlet />
    </main>
  `,
  styles: ``,
})
export class PortalComponent {}
