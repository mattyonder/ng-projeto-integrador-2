import { KeyValuePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { StatusTechnicianEnum } from '../../../../shared/enums/status-enum';
import { ICategoryDto } from '../../../../shared/models/pages/category/category-dto';
import { ActionComponent } from '../../../../shared/ui/action/action.component';
import { FormInputDirective } from '../../../../shared/ui/directives/form-input.directive';
import { SelectComponent } from '../../../../shared/ui/dropdown-select/dropdown-select.component';
import { FormFieldComponent } from '../../../../shared/ui/form-field/form-field.component';
import { PaginationComponent } from '../../../../shared/ui/pagination/pagination.component';
import { BaseComponent } from '../../../../shared/utils/base.component';

@Component({
  selector: 'app-my-tickets-technicians',
  standalone: true,
  imports: [
    PaginationComponent,
    FontAwesomeModule,
    ActionComponent,
    FormFieldComponent,
    FormInputDirective,
    SelectComponent,
    KeyValuePipe,
  ],
  templateUrl: './my-tickets-technicians.component.html',
  styles: '',
})
export class MyTicketsTechniciansComponent extends BaseComponent {
  categorias: ICategoryDto[] = [
    { catNrId: 1, catTxDescricao: 'Hardware' },
    { catNrId: 2, catTxDescricao: 'Software' },
    { catNrId: 3, catTxDescricao: 'Rede' },
  ];

  StatusTechnicianEnum = StatusTechnicianEnum;
}
