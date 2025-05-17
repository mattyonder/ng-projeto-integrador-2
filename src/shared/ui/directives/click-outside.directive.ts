import {
  Directive,
  ElementRef,
  HostListener,
  inject,
  output,
} from '@angular/core';

@Directive({
  selector: '[appClickOutside]',
  standalone: true,
})
export class ClickOutsideDirective {
  clickOutside = output();

  #el = inject(ElementRef);

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const clickedElement = event.target as Node;
    const clickedInside = (this.#el.nativeElement as HTMLElement).contains(
      clickedElement
    );

    if (!clickedInside) {
      this.clickOutside.emit();
    }
  }
}
