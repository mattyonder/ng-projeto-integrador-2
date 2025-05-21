import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { IRoleDto } from '../../core/role.dto';
import { ILoginForm } from '../../models/portal/login';
import { AuthResponseDto } from './dto/auth-response-dto';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private baseUrl = 'http://localhost:8080/auth';
  private http = inject(HttpClient);
  private router = inject(Router);

  private _role: IRoleDto | null = null;
  private _empNrId: number | null = null;
  private _usuNrId: number | null = null;

  login(data: ILoginForm): Observable<AuthResponseDto> {
    return this.http.post<AuthResponseDto>(`${this.baseUrl}/login`, data).pipe(
      tap((response) => {
        this.handleTokenResponse(response.token);
      })
    );
  }

  register(data: ILoginForm): Observable<AuthResponseDto> {
    return this.http
      .post<AuthResponseDto>(`${this.baseUrl}/register`, data)
      .pipe(
        tap((response) => {
          this.handleTokenResponse(response.token);
        })
      );
  }

  private handleTokenResponse(token: string) {
    localStorage.setItem('token', token);

    const payload = JSON.parse(atob(token.split('.')[1]));
    this._role = payload.role ?? null;
    this._empNrId = payload.empNrId ?? null;
    this._usuNrId = payload._usuNrId ?? null;
    // redireciona após login
    this.router.navigate(['/portal']);
  }

  logout() {
    localStorage.removeItem('token');
    this._role = null;
    this._empNrId = null;
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUserRole(): IRoleDto | null {
    // pega do token se não tiver em memória
    const token = this.getToken();
    if (!token) return null;
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.role ?? null;
  }

  getUserEmail(): string | null {
    // if (this._role) return this._role as IRoleDto;
    // pega do token se não tiver em memória
    const token = this.getToken();
    if (!token) return null;
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.sub ?? null;
  }

  getUserEmpId(): number | null {
    const token = this.getToken();
    if (!token) return null;
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.empNrId ?? null;
  }

  getUserId(): number | null {
    const token = this.getToken();
    if (!token) return null;
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.usuNrId ?? null;
  }
}
