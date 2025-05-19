import { Routes } from '@angular/router';
import { AuthGuard } from '../../core/guards/auth.guard';
import { DashboardsComponent } from './dashboards/dashboards.component';
import { HomePageComponent } from './home-page/home-page.component';
import { MyTicketsClientComponent } from './my-tickets-client/my-tickets-client.component';
import { MyTicketsTechniciansComponent } from './my-tickets-technicians/my-tickets-technicians.component';
import { OpenTicketComponent } from './open-ticket/open-ticket.component';
import { OpenTicketsComponent } from './open-tickets/open-tickets.component';
import { PagesComponent } from './pages.component';
import { TicketCategoriesComponent } from './ticket-categories/ticket-categories.component';
import { TicketsComponent } from './tickets/tickets.component';

export const PAGES_ROUTES: Routes = [
  {
    path: '',
    component: PagesComponent,
    children: [
      {
        path: 'home',
        canActivate: [AuthGuard],
        component: HomePageComponent,
      },
      {
        path: 'abrir-chamado',
        data: { roles: ['CLIENTE'] },
        canActivate: [AuthGuard],
        component: OpenTicketComponent,
      },
      {
        path: 'meus-chamados-cliente',
        data: { roles: ['CLIENTE'] },
        canActivate: [AuthGuard],
        component: MyTicketsClientComponent,
      },
      {
        path: 'dashboards',
        data: { roles: ['TECNICO', 'ADMIN'] },
        canActivate: [AuthGuard],
        component: DashboardsComponent,
      },
      {
        path: 'meus-chamados-tecnico',
        data: { roles: ['TECNICO'] },
        canActivate: [AuthGuard],
        component: MyTicketsTechniciansComponent,
      },
      {
        path: 'chamados',
        canActivate: [AuthGuard],
        data: { roles: ['ADMIN'] },
        component: TicketsComponent,
      },
      {
        path: 'chamados-abertos',
        data: { roles: ['TECNICO'] },
        canActivate: [AuthGuard],
        component: OpenTicketsComponent,
      },
      {
        path: 'categorias',
        data: { roles: ['ADMIN'] },
        canActivate: [AuthGuard],
        component: TicketCategoriesComponent,
      },
      {
        path: '**',
        redirectTo: 'home',
        pathMatch: 'full',
      },
    ],
  },
];
