import { debounce, MonoTypeOperatorFunction, of, timer } from 'rxjs';

export function debounceTimeAfterFirst<T>(
  dueTime: number
): MonoTypeOperatorFunction<T> {
  let first = true;
  return debounce<T>(() => {
    if (first) {
      first = false;
      return of(void 0);
    }
    return timer(dueTime);
  });
}
