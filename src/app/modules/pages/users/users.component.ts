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
import { IPage, PageRequest } from '../../../../shared/models/page';
import { RolesEnum } from '../../../../shared/models/pages/users/roles-enum-filters';
import { IUserDto } from '../../../../shared/models/user-dto';
import { UserService } from '../../../../shared/services/user.service';
import { ActionComponent } from '../../../../shared/ui/action/action.component';
import { ConfirmationModalService, ConfirmationModalComponent } from '../../../../shared/ui/confirmation-modal/confirmation-modal.component';
import { FormInputDirective } from '../../../../shared/ui/directives/form-input.directive';
import { SelectComponent } from '../../../../shared/ui/dropdown-select/dropdown-select.component';
import { FormFieldComponent } from '../../../../shared/ui/form-field/form-field.component';
import { PaginationComponent } from '../../../../shared/ui/pagination/pagination.component';
import { BaseComponent } from '../../../../shared/utils/base.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styles: '',
  imports: [
    FormFieldComponent,
    SelectComponent,
    KeyValuePipe,
    FontAwesomeModule,
    PaginationComponent,
    ActionComponent,
    FormInputDirective,
    ConfirmationModalComponent
],
})
export class UsersComponent extends BaseComponent implements OnInit {
  readonly #userService = inject(UserService);
  readonly #destroyRef = inject(DestroyRef);
  readonly #confirmationModal = inject(ConfirmationModalService);

  nameFilterRef = viewChild.required('nameFilterRef', {
    read: ElementRef,
  });

  roleFilterRef = viewChild.required('roleFilterRef', {
    read: SelectComponent,
  });

  paginationRef = viewChild.required('paginationRef', {
    read: PaginationComponent,
  });

  usersPage = signal<IPage<IUserDto> | null>(null);
  filter = signal<IUserDto | undefined>(undefined);
  RolesEnum = RolesEnum;

  ngOnInit() {
    this.#listUsers({ size: 10, page: 0 });
  }

  #listUsers(pageRequest: PageRequest) {
    this.#userService
      .getAll(this.filter(), pageRequest)
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe({
        next: (res) => this.usersPage.set(res),
        error: (error) =>
          this.messageService.error('Erro ao carregar os usuários'),
      });
  }

  filterByName($event: Event) {
    const usuTxNome = ($event?.target as HTMLInputElement).value;
    this.filter.update((prev) => ({ ...prev, usuTxNome }));
  }

  filterByRole($event: any) {
    const role: keyof typeof RolesEnum = $event.key;
    if (role === 'ADMIN') {
      this.filter.update((prev) => ({ ...prev, rolNrId: 1 }));
      return;
    }
    if (role === 'CLIENTE') {
      this.filter.update((prev) => ({ ...prev, rolNrId: 3 }));
      return;
    }
    if (role === 'TECNICO') {
      this.filter.update((prev) => ({ ...prev, rolNrId: 2 }));
      return;
    }
  }

  applyFilter() {
    this.paginationRef().reset();
  }

  changePage(pageRequest: PageRequest) {
    this.#listUsers(pageRequest);
  }

  clearFilter() {
    this.roleFilterRef().reset();
    (this.nameFilterRef().nativeElement as HTMLInputElement).value = '';
    this.filter.set(undefined);
    this.paginationRef().reset();
  }

  // showConfirmationTechinicalModal(user: IUserDto) {
  //   this.confirmationModal.openModal({
  //     resourceName: `Chamado ${ticket.chaTxTitulo}`,
  //     confirmText: 'Sim, excluir',
  //     cancelText: 'Cancelar',
  //     callbackExecuteAction: () => this.deleteTicket(ticket.chaNrId),
  //   });
  // }

  // assignTechnicalRole(usuNrId:) {

  // }

  showConfirmationThecnicalModal(usu: IUserDto) {
    this.#confirmationModal.openModal({
      message: 'Deseja mesmo alterar o tipo desse usuário para TÉCNICO ?',
      resourceName: `${usu.usuTxNome}`,
      confirmText: 'Sim',
      cancelText: 'Cancelar',
      callbackExecuteAction: () => this.assignole(usu.usuNrId!, 2),
    });
  }

  showConfirmationClientModal(usu: IUserDto) {
    this.#confirmationModal.openModal({
      message: 'Deseja mesmo alterar o tipo desse usuário para CLIENTE ?',
      resourceName: `${usu.usuTxNome}`,
      confirmText: 'Sim',
      cancelText: 'Não',
      callbackExecuteAction: () => this.assignole(usu.usuNrId!, 3),
    });
  }

  assignole(usuNrId: number, rolNrId: number) {
    this.#userService.atribuirRole(usuNrId, rolNrId).subscribe({
      next: (_) => {
        this.#listUsers({ size: 10, page: 0 });
        this.messageService.success('Tipo de usuário alterado com sucesso');
      },
      error: (error) =>
        this.messageService.error(
          'Houve um problema ao alterar o tipo desse usuário'
        ),
    });
  }
}
