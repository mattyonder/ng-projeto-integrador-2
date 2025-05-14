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
    <p class="text-pec-tx-secondary font-normal">Página:</p>
    <strong class="flex items-center gap-2.5 text-pec-tx-primary">
      <button
        type="button"
        (click)="prevPage()"
        class="disabled:text-pec-tx-secondary"
        [disabled]="currentPage().page === 0"
      >
        <fa-icon icon="angle-left" class="text-xl" />
      </button>
      <span class="text-lg">{{ currentPage().page! + 1 }}</span>
      <button
        type="button"
        (click)="nextPage()"
        class="disabled:text-pec-tx-secondary"
        [disabled]="currentPage().page! >= totalPages()! - 1"
      >
        <fa-icon icon="angle-right" class="text-xl" />
      </button>
    </strong>
    <p class="text-pec-tx-secondary font-normal">Itens:</p>
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
    this.currentPage.update((currentPage) => {
      if (currentPage.page! < this.totalPages() - 1) {
        currentPage.page! += 1;
      }
      this.pageChange.emit(currentPage);
      return currentPage;
    });
  }

  prevPage() {
    this.currentPage.update((currentPage) => {
      if (currentPage.page! > 0) {
        currentPage.page! -= 1;
      }
      this.pageChange.emit(currentPage);
      return currentPage;
    });
  }

  addSize() {
    this.currentPage.update((currentPage) => {
      if (currentPage.size! < this.maxSize()) {
        currentPage.page = 0;
        currentPage.size! += 10;
      }
      this.pageChange.emit(currentPage);
      return currentPage;
    });
  }

  subSize() {
    this.currentPage.update((currentPage) => {
      if (currentPage.size! > this.minSize()) {
        currentPage.page = 0;
        currentPage.size! -= 10;
      }
      this.pageChange.emit(currentPage);
      return currentPage;
    });
  }

  reset<T>(defaultValue?: T): void {
    this.currentPage.set(defaultValue ?? { page: 0, size: 10 });
  }
}
