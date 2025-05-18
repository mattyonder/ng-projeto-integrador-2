import { CommonModule } from '@angular/common';
import {
  Component,
  DestroyRef,
  ElementRef,
  inject,
  input,
  OnInit,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { ICategoryDto } from '../../../../shared/models/pages/category/category-dto';
import { FormInputDirective } from '../../../../shared/ui/directives/form-input.directive';
import { SelectComponent } from '../../../../shared/ui/dropdown-select/dropdown-select.component';
import { FormFieldComponent } from '../../../../shared/ui/form-field/form-field.component';
import { BaseComponent } from '../../../../shared/utils/base.component';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormGroupOf } from '../../../../shared/core/types/form-groups-of';
import { StatusEnum } from '../../../../shared/enums/status-enum';
import { IPage } from '../../../../shared/models/page';
import { ITicketDto } from '../../../../shared/models/pages/open-ticket/ticket-dto';
import { ITicketForm } from '../../../../shared/models/pages/open-ticket/ticket-form';
import { CategoryService } from '../../../../shared/services/category.service';
import { TicketService } from '../../../../shared/services/ticket.service';

@Component({
    selector: 'app-open-ticket',
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormFieldComponent,
        FormInputDirective,
        SelectComponent,
    ],
    templateUrl: './open-ticket.component.html',
    styles: ''
})
export class OpenTicketComponent extends BaseComponent implements OnInit {
  readonly #ticketService = inject(TicketService);
  readonly #categoryService = inject(CategoryService);
  readonly #destroyRef = inject(DestroyRef);

  selectedTicket = input<ITicketDto | null>(null);

  sucessOnEditTicket = output<boolean>();

  categoriesPage = signal<IPage<ICategoryDto> | null>(null);

  inputFileComponent = viewChild.required('inputFileComponent', {
    read: ElementRef,
  });

  ticketFg = this.fb.group<FormGroupOf<ITicketForm>>({
    chaTxTitulo: this.fb.control(null, Validators.required),
    chaTxDescricao: this.fb.control(null, Validators.required),
    chaTxStatus: this.fb.control('ABERTO', Validators.required),
    chaNrIdCliente: this.fb.control(3, Validators.required),
    chaNrIdTecnico: this.fb.control(null),
    catNrId: this.fb.control(null, Validators.required),
  });

  StatusEnum = StatusEnum;

  ngOnInit(): void {
    this.#listCategories();
    if (this.selectedTicket()) this.#setupFormOnEdit();
  }

  #setupFormOnEdit() {
    const replace = this.selectedTicket();
    this.ticketFg.patchValue({ ...replace });
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

  clearFields() {
    this.ticketFg.reset();
  }

  onSubmit() {
    const ticketForm = this.ticketFg.getRawValue() as ITicketForm;
    if (this.ticketFg.invalid) return this.ticketFg.markAllAsTouched();

    if (this.selectedTicket())
      this.#ticketService
        .update(this.selectedTicket()?.chaNrId!, ticketForm)
        .subscribe({
          next: (res) => {
            this.messageService.success(
              'Chamado atualizado com sucesso com sucesso'
            );
            this.clearFields();
            this.sucessOnEditTicket.emit(true);
          },
          error: (err) => {
            this.messageService.error('Erro ao atualizar o chamado');
          },
        });
    else
      this.#ticketService.create(ticketForm).subscribe({
        next: (res) => {
          this.messageService.success('Chamado criado com sucesso');
          this.clearFields();
        },
        error: (err) => {
          this.messageService.error('Erro ao criar um chamado');
        },
      });
  }
}
