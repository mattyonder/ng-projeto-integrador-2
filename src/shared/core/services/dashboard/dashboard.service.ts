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

export enum StatusChamado {
  ABERTO = 'Aberto',
  EM_ANDAMENTO = 'Em Andamento',
  RESOLVIDO = 'Resolvido',
  FECHADO = 'Fechado'
}

export interface ChamadoSemanal {
  semanaInicio: string;
  diaSemanaNumero: number;
  diaSemanaNome: string;
  total: number;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private readonly apiUrl = 'http://localhost:8080/relatorios';

  constructor(private http: HttpClient) {}

  getPorStatus(chaDtDataCriacao?: string): Observable<RelatorioStatusDto[]> {
    return this.http.get<RelatorioStatusDto[]>(`${this.apiUrl}/status?chaDtDataCriacao=${chaDtDataCriacao}`);
  }

  getPorTecnico(chaDtDataCriacao?: string): Observable<RelatorioChamadosPorTecnicoDto[]> {
    return this.http.get<RelatorioChamadosPorTecnicoDto[]>(`${this.apiUrl}/por-tecnico?chaDtDataCriacao=${chaDtDataCriacao}`);
  }

  getChamadosSemanais(): Observable<ChamadoSemanal[]> {
    return this.http.get<ChamadoSemanal[]>(`${this.apiUrl}/semanais?`);
  }

  getPorDia(chaDtDataCriacao?: string): Observable<RelatorioChamadosPorDataDto> {
    return this.http.get<RelatorioChamadosPorDataDto>(`${this.apiUrl}/por-dia?chaDtDataCriacao=${chaDtDataCriacao}`);
  }

  getPorCategoria(chaDtDataCriacao?: string): Observable<RelatorioChamadosPorCategoriaDto[]> {
    return this.http.get<RelatorioChamadosPorCategoriaDto[]>(`${this.apiUrl}/por-categoria?chaDtDataCriacao=${chaDtDataCriacao}`);
  }
}
