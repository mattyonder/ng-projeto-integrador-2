import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IPage, PageRequest } from '../models/page';
import { ICategoryDto } from '../models/pages/category/category-dto';
import { ICategoryFilterForm } from '../models/pages/category/category-filter-form';
import { ICategoryForm } from '../models/pages/category/category-form';
import { toParams } from '../utils/support-functions';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private baseUrl = 'http://localhost:8080/categorias';

  private http = inject(HttpClient);

  getAll(): Observable<ICategoryDto[]> {
    return this.http.get<ICategoryDto[]>(this.baseUrl);
  }

  getAllForCompany(
    empNrId: number,
    filter?: ICategoryFilterForm,
    page?: PageRequest
  ): Observable<IPage<ICategoryDto>> {
    const params = toParams(page, filter);
    return this.http.get<IPage<ICategoryDto>>(
      `${this.baseUrl}/empresa/${empNrId}`,
      { params }
    );
  }

  getById(id: number): Observable<ICategoryDto> {
    return this.http.get<ICategoryDto>(`${this.baseUrl}/${id}`);
  }

  create(form: ICategoryForm): Observable<ICategoryDto> {
    return this.http.post<ICategoryDto>(this.baseUrl, form);
  }

  update(id: number, form: ICategoryForm): Observable<ICategoryDto> {
    return this.http.put<ICategoryDto>(`${this.baseUrl}/${id}`, form);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
