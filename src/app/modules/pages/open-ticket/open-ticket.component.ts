import { CommonModule } from '@angular/common';
import { Component, ElementRef, viewChild } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { FormGroupOf } from '../../../../shared/core/types/form-groups-of';
import { ICategoryDto } from '../../../../shared/models/pages/category/category-dto';
import { ITicketForm } from '../../../../shared/models/pages/open-ticket/ticket-form';
import { FormInputDirective } from '../../../../shared/ui/directives/form-input.directive';
import { SelectComponent } from '../../../../shared/ui/dropdown-select/dropdown-select.component';
import { FormFieldComponent } from '../../../../shared/ui/form-field/form-field.component';
import { BaseComponent } from '../../../../shared/utils/base.component';
import { readFileAsBase64 } from '../../../../shared/utils/support-functions';

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
  inputFileComponent = viewChild.required('inputFileComponent', {
    read: ElementRef,
  });

  lticketFg = this.fb.group<FormGroupOf<ITicketForm>>({
    chaTxTitulo: this.fb.control(null, Validators.required),
    chaTxDescricao: this.fb.control(null, Validators.required),
    catNrId: this.fb.control(null, Validators.required),
    aneTxAnexo: this.fb.control(null, Validators.required),
  });

  categorias: ICategoryDto[] = [
    { catNrId: 1, catTxDescricao: 'Hardware' },
    { catNrId: 2, catTxDescricao: 'Software' },
    { catNrId: 3, catTxDescricao: 'Rede' },
  ];
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const files = Array.from(input.files);

    const readers = files.map((file) => readFileAsBase64(file));

    Promise.all(readers).then((base64s) => {
      const anexos = this.lticketFg.value.aneTxAnexo || [];
      this.lticketFg.patchValue({ aneTxAnexo: [...anexos, ...base64s] });
    });
  }

  removeAnexo(index: number) {
    const anexos: string[] = this.lticketFg.value.aneTxAnexo || [];
    anexos.splice(index, 1);
    this.lticketFg.patchValue({ aneTxAnexo: [...anexos] });
  }

  clearFields() {
    this.lticketFg.reset();
  }

  onSubmit() {
    console.log(this.lticketFg.getRawValue());
  }
}
