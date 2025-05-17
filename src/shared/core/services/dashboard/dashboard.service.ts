import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseService } from '../../../utils/base.service';

export interface RelatorioStatusDto {
  status: string;
  total: number;
}

export interface RelatorioChamadosPorTecnicoDto {
  tecnico: string;
  totalChamados: number;
}

export interface RelatorioTempoMedioResolucaoDto {
  tecnico: string;
  mediaHoras: number;
}

export interface RelatorioChamadosPorDataDto {
  data: string;
  nomeDia: string;
  total: number;
}

export interface RelatorioChamadosPorCategoriaDto {
  categoria: string;
  totalChamados: number;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private readonly apiUrl = 'http://localhost:8080/relatorios';

  constructor(private http: HttpClient) {}

  getPorStatus(): Observable<RelatorioStatusDto[]> {
    return this.http.get<RelatorioStatusDto[]>(`${this.apiUrl}/status`);
  }

  getPorTecnico(): Observable<RelatorioChamadosPorTecnicoDto[]> {
    return this.http.get<RelatorioChamadosPorTecnicoDto[]>(`${this.apiUrl}/por-tecnico`);
  }

  getTempoMedio(): Observable<RelatorioTempoMedioResolucaoDto[]> {
    return this.http.get<RelatorioTempoMedioResolucaoDto[]>(`${this.apiUrl}/tempo-medio`);
  }

  getPorDia(): Observable<RelatorioChamadosPorDataDto> {
    return this.http.get<RelatorioChamadosPorDataDto>(`${this.apiUrl}/por-dia`);
  }

  getPorCategoria(): Observable<RelatorioChamadosPorCategoriaDto[]> {
    return this.http.get<RelatorioChamadosPorCategoriaDto[]>(`${this.apiUrl}/por-categoria`);
  }
}
