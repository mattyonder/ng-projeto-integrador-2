import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BaseComponent } from '../../../shared/utils/base.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterOutlet, FontAwesomeModule],
  template: `
    <main class="flex h-screen w-screen">
      <aside
        class="flex flex-col bg-primary-2 border-primary-1 w-1/6 rounded-r-xl shadow-xl  py-3 px-3 text-white font-semibold"
      >
        <span class="text-xl"> TS ServiceHub </span>

        <div class="flex flex-col mt-8 underline px-5 gap-4 ">
          <a class="text-link" routerLink="/home">Home</a>
          <a class="text-link">Abrir Chamado</a>
          <a class="text-link">Meu Chamados</a>
          <a class="text-link">Chamados em Aberto</a>
          <a class="text-link">Abrir Chamado</a>
          <a class="text-link">Equipes</a>
          <a class="text-link">Dashboards</a>

          <a class="text-link">Categorias de Chamados</a>
          <a class="text-link">Instituição</a>
          <a class="text-link">Configurações</a>
        </div>
      </aside>
      <router-outlet />
    </main>
  `,
  styles: '',
})
export class PagesComponent extends BaseComponent {}
