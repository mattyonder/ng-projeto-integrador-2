import { Directive, Input } from "@angular/core";

interface ListTemplateContext<T> {
  $implicit: T;
  list: T;
}

@Directive({
  selector: "ng-template[listTypeInject]",
  standalone: true,
})
export class ListTypeInjectDirective<T> {
  @Input("listTypeInject") listRef?: T[];

  static ngTemplateContextGuard<TContext>(
    _: ListTypeInjectDirective<TContext>,
    ctx: unknown
  ): ctx is ListTemplateContext<TContext> {
    return true;
  }
}
