import { Component, inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AppErrorHandler } from '../ui/error-handler/error-handler';

@Component({ template: '' })
export class BaseComponent {
  protected fb = inject(FormBuilder);
  protected errorHandler = inject(AppErrorHandler);
  protected messageService = inject(ToastrService);
  protected router = inject(Router);
}
