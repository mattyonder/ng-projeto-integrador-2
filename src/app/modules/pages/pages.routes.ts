import { Routes } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { MyTicketsClientComponent } from './my-tickets-client/my-tickets-client.component';
import { MyTicketsTechniciansComponent } from './my-tickets-technicians/my-tickets-technicians.component';
import { OpenTicketComponent } from './open-ticket/open-ticket.component';
import { PagesComponent } from './pages.component';
import { TicketsComponent } from './tickets/tickets.component';
import { OpenTicketsComponent } from './open-tickets/open-tickets.component';

export const PAGES_ROUTES: Routes = [
  {
    path: '',
    component: PagesComponent,
    children: [
      {
        path: 'home',
        component: HomePageComponent,
      },
      {
        path: 'abrir-chamado',
        component: OpenTicketComponent,
      },
      {
        path: 'meus-chamados-cliente',
        component: MyTicketsClientComponent,
      },
      {
        path: 'meus-chamados-tecnico',
        component: MyTicketsTechniciansComponent,
      },
      {
        path: 'chamados',
        component: TicketsComponent,
      },
      {
        path: 'chamados-abertos',
        component: OpenTicketsComponent,
      },
      {
        path: '**',
        redirectTo: 'home',
        pathMatch: 'full',
      },
    ],
  },
];
