import {
  Component,
  DestroyRef,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { StatusEnum } from '../../../../shared/enums/status-enum';
import { IPage, PageRequest } from '../../../../shared/models/page';
import { ICategoryDto } from '../../../../shared/models/pages/category/category-dto';
import { ITicketDto } from '../../../../shared/models/pages/open-ticket/ticket-dto';
import { ITicketForm } from '../../../../shared/models/pages/open-ticket/ticket-form';
import { CategoryService } from '../../../../shared/services/category.service';
import { TicketService } from '../../../../shared/services/ticket.service';
import { ActionComponent } from '../../../../shared/ui/action/action.component';
import { FormInputDirective } from '../../../../shared/ui/directives/form-input.directive';
import { SelectComponent } from '../../../../shared/ui/dropdown-select/dropdown-select.component';
import { FormFieldComponent } from '../../../../shared/ui/form-field/form-field.component';
import { PaginationComponent } from '../../../../shared/ui/pagination/pagination.component';
import { BaseComponent } from '../../../../shared/utils/base.component';

@Component({
  selector: 'app-open-tickets',
  standalone: true,
  imports: [
    PaginationComponent,
    FontAwesomeModule,
    ActionComponent,
    FormFieldComponent,
    FormInputDirective,
    SelectComponent,
  ],
  templateUrl: './open-tickets.component.html',
  styles: '',
})
export class OpenTicketsComponent extends BaseComponent {
  readonly #ticketService = inject(TicketService);
  readonly #categoryService = inject(CategoryService);
  readonly #destroyRef = inject(DestroyRef);

  titleFilterRef = viewChild.required('titleFilterRef', {
    read: ElementRef,
  });

  categoryFilterRef = viewChild.required('categoryFilterRef', {
    read: SelectComponent,
  });

  paginationRef = viewChild.required('paginationRef', {
    read: PaginationComponent,
  });

  ticketsPage = signal<IPage<ITicketDto> | null>(null);
  ticketFilter = signal<ITicketForm | undefined>({
    chaTxStatus: 'ABERTO',
  });
  categoriesPage = signal<IPage<ICategoryDto> | null>(null);

  formModalIsOpen = signal<boolean>(false);

  ngOnInit(): void {
    this.#listCategories();
    this.#listTickets({ size: 10, page: 0 });
  }

  #listTickets(pageRequest: PageRequest) {
    this.#ticketService
      .getAll(this.ticketFilter(), pageRequest)
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe({
        next: (res) => this.ticketsPage.set(res),
        error: (error) =>
          this.messageService.error('Erro ao carregar os chamados'),
      });
  }

  #listCategories() {
    this.#categoryService
      // .getAll(pageRequest)\
      .getAllForCompany(1, undefined, { page: 0, size: 2000 })
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe({
        next: (res) => this.categoriesPage.set(res),
        error: () => this.messageService.error('Erro ao carregar categorias.'),
      });
  }

  filterByTitle($event: Event) {
    const chaTxTitulo = ($event?.target as HTMLInputElement).value;
    this.ticketFilter.update((prev) => ({ ...prev, chaTxTitulo }));
  }

  filterByCategory($event: any) {
    const cat = $event as ICategoryDto;
    this.ticketFilter.update((prev) => ({ ...prev, catNrId: cat.catNrId }));
  }

  applyFilter() {
    this.paginationRef().reset();
  }

  clearFilter() {
    this.categoryFilterRef().reset();
    (this.titleFilterRef().nativeElement as HTMLInputElement).value = '';
    this.ticketFilter.set({ chaTxStatus: 'ABERTO' });

    this.paginationRef().reset();
  }

  changePage(pageRequest: PageRequest) {
    this.#listTickets(pageRequest);
  }

  closeFormModal() {
    this.formModalIsOpen.set(false);
  }

  assignToMe(ticket: ITicketDto) {
    this.#ticketService.assignToTechnician(ticket.chaNrId!, 4).subscribe({
      next: (_) => {
        this.messageService.success(
          'Chamado atribuido ao técnico com sucesso com sucesso'
        );
        this.#listTickets({ size: 10, page: 0 });
      },
      error: (err) => {
        this.messageService.error('Erro ao concluir o chamado');
      },
    });
  }

  readonly StatusEnum = StatusEnum;
}
