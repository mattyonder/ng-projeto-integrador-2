import { Component, signal } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ActionComponent } from '../../../../shared/ui/action/action.component';
import { PaginationComponent } from '../../../../shared/ui/pagination/pagination.component';
import { BaseComponent } from '../../../../shared/utils/base.component';
import { ModalComponent } from "../../../../shared/ui/modal/modal.component";
import { TicketCategoriesFormComponent } from "./ticket-categories-form/ticket-categories-form.component";

@Component({
  selector: 'app-ticket-categories',
  standalone: true,
  imports: [FontAwesomeModule, PaginationComponent, ActionComponent, ModalComponent, TicketCategoriesFormComponent],
  templateUrl: './ticket-categories.component.html',
  styles: '',
})
export class TicketCategoriesComponent extends BaseComponent {
  modalIsOpen = signal<boolean>(false);

  openModal() {
    this.modalIsOpen.set(true);
  }

  closeModal() {
    this.modalIsOpen.set(false);
  }

  deleteCategories(id: number) {}

  editCategories(id: number) {}

  categorias = [
    {
      id: 1,
      nome: 'Tecnologia',
      descricao: 'Categoria voltada para conteúdos de TI, gadgets e inovação.',
    },
    {
      id: 2,
      nome: 'Saúde',
      descricao: 'Assuntos relacionados à saúde física e mental.',
    },
    {
      id: 3,
      nome: 'Educação',
      descricao: 'Tudo sobre ensino, aprendizado e métodos educacionais.',
    },
    {
      id: 4,
      nome: 'Esportes',
      descricao: 'Informações sobre esportes em geral, atletas e campeonatos.',
    },
    {
      id: 5,
      nome: 'Entretenimento',
      descricao: 'Filmes, séries, música, jogos e cultura pop.',
    },
  ];
}
