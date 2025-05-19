import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IRoleDto } from '../../../shared/core/role.dto';
import { LoginService } from '../../../shared/services/login/login.service';
import { BaseComponent } from '../../../shared/utils/base.component';

@Component({
  selector: 'app-home',
  imports: [RouterOutlet, RouterModule, FontAwesomeModule, CommonModule],
  template: `
    <main class="flex bg-gray-200">
      <aside
        class="fixed top-0 left-0 h-screen w-1/6 bg-primary-2 border-primary-1 rounded-r-xl shadow-xl py-3 px-3 text-white font-fixed z-50"
      >
        <span class="text-xl block mb-6">TS ServiceHub</span>

        <nav class="flex flex-col px-5 gap-4">
          <!-- todo mundo vê Home -->
          <a class="text-link" routerLink="home">Home</a>

          @switch (this.role()?.rolTxDescricao!) { @case ('CLIENTE'){
          <a class="text-link" routerLink="abrir-chamado">Abrir Chamado</a>
          <a class="text-link" routerLink="meus-chamados-cliente"
            >Meus Chamados</a
          >
          } @case ('TECNICO') {
          <a class="text-link" routerLink="meus-chamados-tecnico"
            >Meus Chamados</a
          >
          <a class="text-link" routerLink="chamados-abertos"
            >Chamados em Aberto</a
          >
          } @case ('ADMIN') {
          <a class="text-link" routerLink="chamados">Chamados</a>
          <a class="text-link" routerLink="categorias"
            >Categorias de Chamados</a
          >
          <a class="text-link" routerLink="dashboards">Dashboards</a>
          } }

          <a class="text-link">Configurações</a>
          <a class="text-link cursor-pointer" (click)="this.logout()">Sair</a>
        </nav>
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
export class PagesComponent extends BaseComponent implements OnInit {
  role = signal<IRoleDto | null>(null);
  private login = inject(LoginService);
  ngOnInit() {
    const roles = this.login.getUserRole();
    if (roles) {
    this.role.set({
      rolTxDescricao: roles
    });
  }
    console.log(this.role()?.rolTxDescricao)
  }

  logout() {
    this.login.logout();
  }
}
