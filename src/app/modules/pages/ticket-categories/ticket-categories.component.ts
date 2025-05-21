import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IPage, PageRequest } from '../../../../shared/models/page';
import { ICategoryDto } from '../../../../shared/models/pages/category/category-dto';
import { CategoryService } from '../../../../shared/services/category.service';
import { LoginService } from '../../../../shared/services/login/login.service';
import { ActionComponent } from '../../../../shared/ui/action/action.component';
import {
  ConfirmationModalComponent,
  ConfirmationModalService,
} from '../../../../shared/ui/confirmation-modal/confirmation-modal.component';
import { ModalComponent } from '../../../../shared/ui/modal/modal.component';
import { PaginationComponent } from '../../../../shared/ui/pagination/pagination.component';
import { BaseComponent } from '../../../../shared/utils/base.component';
import { TicketCategoriesFormComponent } from './ticket-categories-form/ticket-categories-form.component';

@Component({
  selector: 'app-ticket-categories',
  imports: [
    FontAwesomeModule,
    PaginationComponent,
    ActionComponent,
    ModalComponent,
    TicketCategoriesFormComponent,
    ConfirmationModalComponent,
  ],
  templateUrl: './ticket-categories.component.html',
  styles: '',
})
export class TicketCategoriesComponent extends BaseComponent implements OnInit {
  readonly #categoryService = inject(CategoryService);
  #loginService = inject(LoginService);
  readonly confirmationModal = inject(ConfirmationModalService);
  readonly #destroyRef = inject(DestroyRef);

  categoriesPage = signal<IPage<ICategoryDto> | null>(null);
  selectedCategory = signal<ICategoryDto | null>(null);
  formModalIsOpen = signal<boolean>(false);

  empNrId = signal<number | null>(null);

  ngOnInit(): void {
    this.empNrId.set(this.#loginService.getUserEmpId());

    this.#listCategories({ page: 0, size: 10 });
  }

  #listCategories(pageRequest: PageRequest) {
    this.#categoryService
      // .getAll(pageRequest)\
      .getAllForCompany(this.empNrId()!, undefined, pageRequest)
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe({
        next: (res) => this.categoriesPage.set(res),
        error: () => this.messageService.error('Erro ao carregar categorias.'),
      });
  }

  openFormModal() {
    this.formModalIsOpen.set(true);
  }

  closeFormModal() {
    this.selectedCategory.set(null);
    this.formModalIsOpen.set(false);
  }

  changePage(pageRequest: PageRequest) {
    this.#listCategories(pageRequest);
  }

  editCategory(category: ICategoryDto) {
    this.selectedCategory.set(category);
    this.formModalIsOpen.set(true);
  }

  showConfirmationDeleteModal(category: ICategoryDto) {
    this.confirmationModal.openModal({
      resourceName: `Categoria ${category.catTxNome}`,
      confirmText: 'Sim, excluir',
      cancelText: 'Cancelar',
      callbackExecuteAction: () => this.deleteCategory(category.catNrId),
    });
  }

  deleteCategory(id: number) {
    this.#categoryService.delete(id).subscribe({
      next: () => {
        this.messageService.success('Categoria excluída com sucesso');
        this.#listCategories({ page: 0, size: 10 });
      },
      error: () => this.messageService.error('Erro ao excluir categoria'),
    });
  }

  afterSuccess() {
    this.closeFormModal();
    this.#listCategories({ page: 0, size: 10 });
  }
}
