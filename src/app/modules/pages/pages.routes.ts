import { Routes } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { OpenTicketComponent } from './open-ticket/open-ticket.component';
import { PagesComponent } from './pages.component';
import { MyTicketsClientComponent } from './my-tickets-client/my-tickets-client.component';

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
        path: '**',
        redirectTo: 'home',
        pathMatch: 'full',
      },
    ],
  },
];
