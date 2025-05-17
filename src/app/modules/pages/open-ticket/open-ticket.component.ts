import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, viewChild } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { ICategoryDto } from '../../../../shared/models/pages/category/category-dto';
import { FormInputDirective } from '../../../../shared/ui/directives/form-input.directive';
import { SelectComponent } from '../../../../shared/ui/dropdown-select/dropdown-select.component';
import { FormFieldComponent } from '../../../../shared/ui/form-field/form-field.component';
import { BaseComponent } from '../../../../shared/utils/base.component';

import { FormGroupOf } from '../../../../shared/core/types/form-groups-of';
import { StatusEnum } from '../../../../shared/enums/status-enum';
import { ITicketForm } from '../../../../shared/models/pages/open-ticket/ticket-form';
import { TicketService } from '../../../../shared/services/ticket.service';

@Component({
  selector: 'app-open-ticket',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormFieldComponent,
    FormInputDirective,
    SelectComponent,
  ],
  templateUrl: './open-ticket.component.html',
  styles: '',
})
export class OpenTicketComponent extends BaseComponent {
  readonly #ticketService = inject(TicketService);

  inputFileComponent = viewChild.required('inputFileComponent', {
    read: ElementRef,
  });

  lticketFg = this.fb.group<FormGroupOf<ITicketForm>>({
    chaTxTitulo: this.fb.control(null, Validators.required),
    chaTxDescricao: this.fb.control(null, Validators.required),
    chaTxStatus: this.fb.control('ABERTO', Validators.required),
    chaNrIdCliente: this.fb.control(1, Validators.required),
    chaNrIdTecnico: this.fb.control(1),
    catNrId: this.fb.control(null, Validators.required),
  });

  categorias: ICategoryDto[] = [
    { catNrId: 1, catTxDescricao: 'Hardware' },
    { catNrId: 2, catTxDescricao: 'Software' },
    { catNrId: 3, catTxDescricao: 'Rede' },
  ];

  StatusEnum = StatusEnum;

  clearFields() {
    this.lticketFg.reset();
  }

  onSubmit() {
    const ticketForm = this.lticketFg.getRawValue() as ITicketForm;
    console.log(ticketForm);
    if (this.lticketFg.invalid) return;

    this.#ticketService.create(ticketForm).subscribe({
      next: (res) => {
        this.messageService.success('Chamado criado com sucesso');
        this.clearFields();
        // Aqui você pode exibir um snackbar ou redirecionar
      },
      error: (err) => {
        this.messageService.error('erri ao criar um chamado');
      },
    });
  }
}
