import { Component, inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AppErrorHandler } from '../ui/error-handler/error-handler';

@Component({ template: '' })
export class BaseComponent {
  protected fb = inject(FormBuilder);
  protected errorHandler = inject(AppErrorHandler);
  protected messageService = inject(ToastrService);
}
