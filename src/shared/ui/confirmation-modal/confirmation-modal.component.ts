import { CommonModule } from '@angular/common';
import { Component, Injectable, OnInit, inject, signal } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-confirmation-modal',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  template: `
    <div
      *ngIf="isOpen()"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
    >
      <div class="bg-white rounded-xl w-[30rem] p-6 shadow-lg text-center">
        <div class="flex justify-center mb-4">
          <div class="bg-yellow-100 p-4 rounded-full">
            <fa-icon [icon]="faExclamation" class="text-yellow-500 text-2xl" />
          </div>
        </div>

        <h2 class="text-xl font-bold text-gray-800 mb-2">Atenção!</h2>

        <p class="text-gray-600 mb-6">
          {{
            args()?.message ||
              'Essa operação irá deletar "' +
                args()?.resourceName +
                '". Você tem certeza disso?'
          }}
        </p>

        <div class="flex justify-center gap-4">
          <button
            class="px-4 py-2 border border-gray-400 rounded hover:bg-gray-100"
            (click)="cancel()"
          >
            {{ args()?.cancelText || 'Cancelar' }}
          </button>
          <button
            class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            (click)="confirm()"
          >
            {{ args()?.confirmText || 'Confirmar' }}
          </button>
        </div>
      </div>
    </div>
  `,
})
export class ConfirmationModalComponent implements OnInit {
  args = signal<ConfirmationModalArgs | null>(null);
  isOpen = signal(false);

  faExclamation = faTriangleExclamation;

  private service = inject(ConfirmationModalService);

  ngOnInit(): void {
    this.service.modalArgs$.subscribe((args) => this.args.set(args));
    this.service.modalOpen$.subscribe((open) => this.isOpen.set(open));
  }

  confirm() {
    this.args()?.callbackExecuteAction();
    this.endAction();
  }

  cancel() {
    this.endAction();
  }

  private endAction() {
    this.service.closeModal();
    this.service.clearArgs();
  }
}

export interface ConfirmationModalArgs {
  message?: string;
  resourceName?: string;
  confirmText?: string;
  cancelText?: string;
  callbackExecuteAction: () => void;
}
@Injectable({ providedIn: 'root' })
export class ConfirmationModalService {
  private modalOpenSubject = new Subject<boolean>();
  private modalArgsSubject = new Subject<ConfirmationModalArgs | null>();

  modalOpen$ = this.modalOpenSubject.asObservable();
  modalArgs$ = this.modalArgsSubject.asObservable();

  openModal(args: ConfirmationModalArgs) {
    this.modalArgsSubject.next(args);
    this.modalOpenSubject.next(true);
  }

  closeModal() {
    this.modalOpenSubject.next(false);
  }

  clearArgs() {
    this.modalArgsSubject.next(null);
  }
}
