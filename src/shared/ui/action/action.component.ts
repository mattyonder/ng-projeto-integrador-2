import { Component, input, output } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IconName } from '@fortawesome/free-regular-svg-icons';

@Component({
  selector: 'app-action',
  standalone: true,
  imports: [FontAwesomeModule],
  template: `
    <button
      type="button"
      (click)="clickAction.emit(); $event.stopPropagation()"
      class="px-1 flex items-center gap-2 hover:opacity-80"
      [title]="title()"
    >
      <fa-icon [icon]="icon()!" class=" {{ classIcon() }}" />
    </button>
  `,
  styles: ``,
})
export class ActionComponent {
  title = input.required<string>();
  classIcon = input<string>();
  icon = input.required<IconName>();
  clickAction = output();
}
