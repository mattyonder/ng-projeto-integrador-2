import { StatusEnum } from '../../../enums/status-enum';

export interface ITicketDto {
  chaNrId: number;
  chaTxTitulo: string;
  chaTxDescricao: string;
  chaTxStatus: StatusEnum;
  chaDtDataCriacao: string; // ou Date, dependendo de como o backend manda
  chaDtDataAtualizacao: string; // ou Date
  chaNrIdCliente: number;
  chaNrIdTecnico: number;
  catNrId: number;
}
