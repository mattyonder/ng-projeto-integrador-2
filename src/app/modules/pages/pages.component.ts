import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BaseComponent } from '../../../shared/utils/base.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterOutlet, FontAwesomeModule],
  template: `
    <main class="flex">
      <!-- ASIDE FIXO -->
      <aside
        class="fixed top-0 left-0 h-screen w-1/6 bg-primary-2 border-primary-1 rounded-r-xl shadow-xl py-3 px-3 text-white font-fixed z-50"
      >
        <span class="text-xl block mb-6">TS ServiceHub</span>

        <div class="flex flex-col underline px-5 gap-4">
          <a class="text-link" routerLink="/home">Home</a>
          <a class="text-link">Abrir Chamado</a>
          <a class="text-link">Meu Chamados</a>
          <a class="text-link">Chamados em Aberto</a>
          <a class="text-link">Equipes</a>
          <a class="text-link">Dashboards</a>
          <a class="text-link">Categorias de Chamados</a>
          <a class="text-link">Instituição</a>
          <a class="text-link">Configurações</a>
        </div>
      </aside>

      <div
        class="ml-[16.6667%] w-[83.3333%] min-h-screen px-6 py-4 overflow-y-auto"
      >
        <router-outlet></router-outlet>
      </div>
    </main>
  `,
  styles: '',
})
export class PagesComponent extends BaseComponent {}
