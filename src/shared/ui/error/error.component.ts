import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-error',
  standalone: true,
  template: `
    <small class="text-xs ml-1 font-semibold text-red-500">
      {{ error() }}
    </small>
  `,
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorComponent {
  error = input<string | null>(null);
}
