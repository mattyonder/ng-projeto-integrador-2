import { KeyValuePipe } from '@angular/common';
import {
  Component,
  DestroyRef,
  ElementRef,
  inject,
  OnInit,
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
import { StatusBadgeComponent } from '../../../../shared/ui/status-badge/status-badge.component';
import { BaseComponent } from '../../../../shared/utils/base.component';

@Component({
  selector: 'app-tickets',
  standalone: true,
  imports: [
    PaginationComponent,
    FontAwesomeModule,
    ActionComponent,
    FormFieldComponent,
    FormInputDirective,
    SelectComponent,
    KeyValuePipe,
    StatusBadgeComponent,
  ],
  templateUrl: './tickets.component.html',
  styles: '',
})
export class TicketsComponent extends BaseComponent implements OnInit {
  openDetailsModal(_t41: ITicketDto) {
    throw new Error('Method not implemented.');
  }
  readonly #ticketService = inject(TicketService);
  readonly #categoryService = inject(CategoryService);
  readonly #destroyRef = inject(DestroyRef);

  titleFilterRef = viewChild.required('titleFilterRef', {
    read: ElementRef,
  });

  categoryFilterRef = viewChild.required('categoryFilterRef', {
    read: SelectComponent,
  });

  statusFilterRef = viewChild.required('statusFilterRef', {
    read: SelectComponent,
  });

  paginationRef = viewChild.required('paginationRef', {
    read: PaginationComponent,
  });

  selectedTicket = signal<ITicketDto | null>(null);
  ticketsPage = signal<IPage<ITicketDto> | null>(null);
  ticketFilter = signal<ITicketForm | undefined>(undefined);
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

  filterByStatus($event: any) {
    const sta = $event.key;
    console.log(sta);

    this.ticketFilter.update((prev) => ({ ...prev, chaTxStatus: sta }));
  }

  applyFilter() {
    this.paginationRef().reset();
  }

  clearFilter() {
    this.categoryFilterRef().reset();
    this.statusFilterRef().reset();
    (this.titleFilterRef().nativeElement as HTMLInputElement).value = '';
    this.ticketFilter.set(undefined);

    this.paginationRef().reset();
  }

  changePage(pageRequest: PageRequest) {
    this.#listTickets(pageRequest);
  }

  closeFormModal() {
    this.formModalIsOpen.set(false);
  }

  readonly StatusEnum = StatusEnum;
}
