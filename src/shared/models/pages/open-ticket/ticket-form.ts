import { StatusEnum } from '../../../enums/status-enum';

export interface ITicketForm {
  chaTxTitulo: string;
  chaTxDescricao: string;
  chaTxStatus?: string;
  chaNrIdCliente: number;
  chaNrIdTecnico?: number;
  catNrId: number;
}
