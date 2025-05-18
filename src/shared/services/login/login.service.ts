import { inject, Injectable } from '@angular/core';
import { LoginDto } from './dto/login-dto';
import { Observable, tap } from 'rxjs';
import { AuthResponseDto } from './dto/auth-response-dto';
import { HttpClient } from '@angular/common/http';
import { ILoginForm } from '../../models/portal/login';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private baseUrl = 'http://localhost:8080/auth';

  private http = inject(HttpClient);

  login(data: ILoginForm): Observable<AuthResponseDto> {
    return this.http.post<AuthResponseDto>(`${this.baseUrl}/login`, data).pipe(
      tap(response => {
        localStorage.setItem('token', response.token);
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}
