import { KeyValuePipe, NgClass } from '@angular/common';
import {
  Component,
  DestroyRef,
  ElementRef,
  inject,
  Injector,
  OnInit,
  signal,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { exhaustMap, filter } from 'rxjs';
import { StatusEnum } from '../../../../shared/enums/status-enum';
import { IPage, PageRequest } from '../../../../shared/models/page';
import { ICategoryDto } from '../../../../shared/models/pages/category/category-dto';
import { ITicketDto } from '../../../../shared/models/pages/open-ticket/ticket-dto';
import { ITicketForm } from '../../../../shared/models/pages/open-ticket/ticket-form';
import { IUserDto } from '../../../../shared/models/user-dto';
import { CategoryService } from '../../../../shared/services/category.service';
import { TicketService } from '../../../../shared/services/ticket.service';
import { UserService } from '../../../../shared/services/user.service';
import { ActionComponent } from '../../../../shared/ui/action/action.component';
import { FormInputDirective } from '../../../../shared/ui/directives/form-input.directive';
import { ListTypeInjectDirective } from '../../../../shared/ui/directives/list-type-inject.directive';
import { DropdownSearchComponent } from '../../../../shared/ui/dropdown-search/dropdown-search.component';
import { SelectComponent } from '../../../../shared/ui/dropdown-select/dropdown-select.component';
import { FormFieldComponent } from '../../../../shared/ui/form-field/form-field.component';
import { ModalComponent } from '../../../../shared/ui/modal/modal.component';
import { PaginationComponent } from '../../../../shared/ui/pagination/pagination.component';
import { StatusBadgeComponent } from '../../../../shared/ui/status-badge/status-badge.component';
import { BaseComponent } from '../../../../shared/utils/base.component';
import { debounceTimeAfterFirst } from '../../../../shared/utils/custom.operators';

@Component({
  selector: 'app-tickets',
  imports: [
    PaginationComponent,
    FontAwesomeModule,
    ActionComponent,
    FormFieldComponent,
    FormInputDirective,
    SelectComponent,
    KeyValuePipe,
    StatusBadgeComponent,
    NgClass,
    ModalComponent,
    DropdownSearchComponent,
    ListTypeInjectDirective,
  ],
  templateUrl: './tickets.component.html',
  styles: '',
})
export class TicketsComponent extends BaseComponent implements OnInit {
  readonly #ticketService = inject(TicketService);
  readonly #userService = inject(UserService);
  readonly #categoryService = inject(CategoryService);
  readonly #injector = inject(Injector);
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

  usersPage = signal<IPage<IUserDto> | null>(null);
  selectedUser = signal<IUserDto | null>(null);

  formModalIsOpen = signal<boolean>(false);

  searchedUser = signal<string>('');

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

  openDetailsModal(dto: ITicketDto) {
    this.formModalIsOpen.set(true);
    this.selectedTicket.set(dto);
    this.#addSubscriptionForUser();
  }

  closeModal() {
    this.formModalIsOpen.set(false);
    this.selectedTicket.set(null);
    this.selectedUser.set(null);
    this.searchedUser.set('');
  }

  #addSubscriptionForUser() {
    toObservable(this.searchedUser, { injector: this.#injector })
      .pipe(
        filter((usuTxNome) => usuTxNome?.length! > -1),
        debounceTimeAfterFirst(500),
        exhaustMap((usuTxNome) =>
          this.#userService.getAll(
            {
              rolNrId: 2,
              usuTxNome,
            } as IUserDto,
            { size: 10, page: 0 }
          )
        )
      )
      .subscribe({
        next: (res) => this.usersPage.set(res),
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

  onSelectTechinian($event: IUserDto | undefined) {
    this.selectedUser.set($event!);
  }

  submit(): void {
    if (!this.selectedUser()) {
      this.messageService.error('Selecione um técnico primeiro');
      return;
    }

    this.#ticketService
      .assignToTechnician(
        this.selectedTicket()?.chaNrId!,
        this.selectedUser()?.usuNrId!
      )
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe({
        next: (res) => {
          this.messageService.success(
            'Chamado atribuido ao técnico com sucesso'
          );
        },
      });
  }

  readonly StatusEnum = StatusEnum;
}
