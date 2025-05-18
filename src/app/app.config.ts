import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { provideToastr } from 'ngx-toastr';
import { provideUi } from '../shared/ui/providers/ui.config';
import { routes } from './app.routes';
import { authInterceptor } from '../shared/core/Interceptor/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimations(),
    provideToastr(),
    provideUi(),
    provideHttpClient(),
    provideHttpClient(withInterceptors([authInterceptor]))
  ],
};
