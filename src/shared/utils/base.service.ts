import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';

export abstract class BaseService {
  protected http = inject(HttpClient)
}