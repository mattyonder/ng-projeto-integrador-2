import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ITicketDto } from '../models/pages/open-ticket/ticket-dto';
import { ITicketForm } from '../models/pages/open-ticket/ticket-form';


@Injectable({
  providedIn: 'root',
})
export class TicketService {
  private baseUrl = 'http://localhost:8080/chamados';

  private http = inject(HttpClient);

  getAll(): Observable<ITicketDto[]> {
    return this.http.get<ITicketDto[]>(this.baseUrl);
  }

  getById(id: number): Observable<ITicketDto> {
    return this.http.get<ITicketDto>(`${this.baseUrl}/${id}`);
  }

  create(form: ITicketForm): Observable<ITicketDto> {
    return this.http.post<ITicketDto>(this.baseUrl, form);
  }

  update(id: number, form: ITicketForm): Observable<ITicketDto> {
    return this.http.put<ITicketDto>(`${this.baseUrl}/${id}`, form);
  }

  assignToTechnician(
    ticketId: number,
    technicianId: number
  ): Observable<ITicketDto> {
    return this.http.put<ITicketDto>(
      `${this.baseUrl}/${ticketId}/atribuir-chamado/${technicianId}`,
      null
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
