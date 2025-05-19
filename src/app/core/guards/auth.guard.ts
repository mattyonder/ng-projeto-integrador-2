// src/app/core/guards/auth.guard.ts
import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { LoginService } from '../../../shared/services/login/login.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private auth: LoginService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree | Observable<boolean | UrlTree> {
    if (!this.auth.isAuthenticated()) {
      this.toastr.error('Você precisa fazer login.');
      return this.router.createUrlTree(['/login']);
    }

    const userRole = this.auth.getUserRole();
    const requiredRoles = route.data['roles'] as string[] | undefined;
    if (requiredRoles && !requiredRoles.includes(userRole!)) {
      this.toastr.error('Você não tem permissão para acessar essa página.');
      return this.router.createUrlTree(['/portal']);
    }

    return true;
  }
}
