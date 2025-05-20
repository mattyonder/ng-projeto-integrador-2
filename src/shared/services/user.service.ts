import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IRoleDto } from '../core/role.dto';
import { IPage, PageRequest } from '../models/page';
import { IUserDto } from '../models/user-dto';
import { toParams } from '../utils/support-functions';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private baseUrl = 'http://localhost:8080/usuarios';
  private http = inject(HttpClient);

  getAll(filter?: IUserDto, page?: PageRequest): Observable<IPage<IUserDto>> {
    const params = toParams(filter, page);
    return this.http.get<IPage<IUserDto>>(this.baseUrl, {
      params,
    });
  }

  atribuirRole(usuNrId: number, rolNrId: number): Observable<void> {
    return this.http.post<void>(
      `${this.baseUrl}/${usuNrId}/roles/${rolNrId}`,
      {}
    );
  }

  removerRole(usuNrId: number, rolNrId: number): Observable<void> {
    return this.http.delete<void>(
      `${this.baseUrl}/${usuNrId}/roles/${rolNrId}`
    );
  }

  listarRoles(): Observable<IRoleDto[]> {
    return this.http.get<IRoleDto[]>(`${this.baseUrl}/buscar-roles`);
  }
}
