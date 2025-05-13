import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'portal',
    loadChildren: () =>
      import('./modules/portal/portal.routes').then(
        (route) => route.AUTH_ROUTES
      ),
  },
  {
    path: 'paginas',
    loadChildren: () =>
      import('./modules/pages/pages.routes').then(
        (route) => route.PAGES_ROUTES
      ),
  },
  {
    path: '**',
    redirectTo: 'portal',
    pathMatch: 'full',
  },
];
