import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
  model,
  NgZone,
  signal,
  untracked,
} from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ClickOutsideDirective } from '../directives/click-outside.directive';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [FontAwesomeModule, ClickOutsideDirective],
  template: `
    @if (open()) {
    <div
      class="fixed z-[100] inset-0 bg-black bg-opacity-50 flex justify-center items-center"
    >
      @if (isVisibleContent()) {
      <div
        class="relative"
        (appClickOutside)="enableClickOutside() ? closeModal() : null"
      >
        <!-- @if (enableClose()) {
            <button class="absolute top-0 right-0 m-[1rem]" type="button" (click)="closeModal()">
              <fa-icon icon="xmark" class="text-pec-black text-2xl"></fa-icon>
            </button>
          } -->
        <ng-content></ng-content>
      </div>
      }
    </div>
    }
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalComponent {
  open = model<boolean>(false);
  enableClickOutside = input<boolean, unknown>(false, {
    transform: booleanAttribute,
  });

  isVisibleContent = signal(false);

  ngZone = inject(NgZone);

  enableClose = input<boolean, unknown>(false, { transform: booleanAttribute });

  constructor() {
    effect(() => {
      if (this.open()) {
        untracked(() => {
          this.isVisibleContent.set(true);
        });
      }
    });
  }

  closeModal() {
    this.isVisibleContent.set(false);

    this.ngZone.runOutsideAngular(() => {
      setTimeout(() => {
        this.ngZone.run(() => {
          this.open.set(false);
        });
      }, 200);
    });
  }
}
