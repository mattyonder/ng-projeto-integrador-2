import {
  ChangeDetectionStrategy,
  Component,
  input,
  numberAttribute,
  output,
  signal,
} from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PageRequest } from '../../models/page';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [FontAwesomeModule],
  host: {
    class: 'flex items-center gap-3',
  },
  template: `
    <p class="text-gray-600 font-normal">Página:</p>
    <strong class="flex items-center gap-2.5 text-black">
      <button
        type="button"
        (click)="prevPage()"
        class="disabled:text-gray-600"
        [disabled]="currentPage().page === 0"
      >
        <fa-icon icon="angle-left" class="text-xl" />
      </button>
      <span class="text-lg">{{ currentPage().page! + 1 }}</span>
      <button
        type="button"
        (click)="nextPage()"
        class="disabled:text-gray-600"
        [disabled]="!hasNextPage()"
      >
        <fa-icon icon="angle-right" class="text-xl" />
      </button>
    </strong>

    <p class="text-gray-600 font-normal">Itens:</p>
    <strong class="flex items-center gap-2.5 text-pec-tx-primary">
      <button
        type="button"
        (click)="subSize()"
        class="disabled:text-pec-tx-secondary"
        [disabled]="currentPage().size! <= minSize()"
      >
        <fa-icon icon="angle-left" class="text-xl" />
      </button>
      <span class="text-lg">{{ currentPage().size }}</span>
      <button
        type="button"
        (click)="addSize()"
        class="disabled:text-pec-tx-secondary"
        [disabled]="currentPage().size! >= maxSize()"
      >
        <fa-icon icon="angle-right" class="text-xl" />
      </button>
    </strong>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginationComponent {
  currentPage = signal<PageRequest>({ page: 0, size: 10 });

  totalPages = input.required<number, unknown>({ transform: numberAttribute });
  pageChange = output<PageRequest>();

  protected maxSize = signal<number>(100);
  protected minSize = signal<number>(10);

  nextPage() {
    const page = this.currentPage().page ?? 0;
    if (page < this.totalPages() - 1) {
      const updated = { ...this.currentPage(), page: page + 1 };
      this.currentPage.set(updated);
      this.pageChange.emit(updated);
    }
  }

  prevPage() {
    const page = this.currentPage().page ?? 0;
    if (page > 0) {
      const updated = { ...this.currentPage(), page: page - 1 };
      this.currentPage.set(updated);
      this.pageChange.emit(updated);
    }
  }

  addSize() {
    const size = this.currentPage().size ?? 10;
    if (size < this.maxSize()) {
      const updated = { ...this.currentPage(), size: size + 10, page: 0 };
      this.currentPage.set(updated);
      this.pageChange.emit(updated);
    }
  }

  subSize() {
    const size = this.currentPage().size ?? 10;
    if (size > this.minSize()) {
      const updated = { ...this.currentPage(), size: size - 10, page: 0 };
      this.currentPage.set(updated);
      this.pageChange.emit(updated);
    }
  }

  hasNextPage(): boolean {
    const page = this.currentPage().page ?? 0;
    return page < (this.totalPages() ?? 0) - 1;
  }

  reset(defaultValue: PageRequest = { page: 0, size: 10 }): void {
    this.currentPage.set(defaultValue);
    this.pageChange.emit(defaultValue);
  }
}
