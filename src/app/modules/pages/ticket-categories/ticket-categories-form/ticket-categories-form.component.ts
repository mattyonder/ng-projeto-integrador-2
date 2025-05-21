import { Component, inject, input, OnInit, output } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { FormGroupOf } from '../../../../../shared/core/types/form-groups-of';
import { ICategoryDto } from '../../../../../shared/models/pages/category/category-dto';
import { ICategoryForm } from '../../../../../shared/models/pages/category/category-form';
import { CategoryService } from '../../../../../shared/services/category.service';
import { LoginService } from '../../../../../shared/services/login/login.service';
import { FormInputDirective } from '../../../../../shared/ui/directives/form-input.directive';
import { FormFieldComponent } from '../../../../../shared/ui/form-field/form-field.component';
import { BaseComponent } from '../../../../../shared/utils/base.component';

@Component({
  selector: 'app-ticket-categories-form',
  imports: [FormFieldComponent, FormInputDirective, ReactiveFormsModule],
  templateUrl: './ticket-categories-form.component.html',
  styles: '',
})
export class TicketCategoriesFormComponent
  extends BaseComponent
  implements OnInit
{
  readonly #categoryService = inject(CategoryService);
  #loginService = inject(LoginService);

  selectedCategory = input<ICategoryDto | null>(null);

  sucessOnEditOrSaveCategory = output<boolean>();

  categoryFg = this.fb.group<FormGroupOf<ICategoryForm>>({
    catTxNome: this.fb.control(null, Validators.required),
    empNrId: this.fb.control(null, Validators.required),
  });

  ngOnInit(): void {
    if (this.selectedCategory()) this.#setupFormOnEdit();
    this.categoryFg.controls.empNrId.setValue(
      this.#loginService.getUserEmpId()
    );
  }

  #setupFormOnEdit() {
    const replace = this.selectedCategory();
    this.categoryFg.patchValue({ ...replace });
  }

  clearFields() {
    this.categoryFg.reset();
  }

  onSubmit() {
    const categoryForm = this.categoryFg.getRawValue() as ICategoryForm;
    if (this.categoryFg.invalid) return this.categoryFg.markAllAsTouched();

    if (this.selectedCategory())
      this.#categoryService
        .update(this.selectedCategory()?.catNrId!, categoryForm)
        .subscribe({
          next: (res) => {
            this.messageService.success(
              'Categoria atualizada com sucesso com sucesso'
            );
            this.clearFields();
            this.sucessOnEditOrSaveCategory.emit(true);
          },
          error: (err) => {
            this.messageService.error('Erro ao criar uma categoria');
          },
        });
    else
      this.#categoryService.create(categoryForm).subscribe({
        next: (res) => {
          this.messageService.success(
            'Categoria criada com sucesso com sucesso'
          );
          this.clearFields();
          this.sucessOnEditOrSaveCategory.emit(true);
        },
        error: (err) => {
          this.messageService.error('Erro ao criar uma categoria');
        },
      });
  }
}
