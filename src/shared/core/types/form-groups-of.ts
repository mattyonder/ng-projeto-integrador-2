import { FormArray, FormControl, FormGroup } from '@angular/forms';

type Primitive =
  | string
  | number
  | boolean
  | Date
  | null
  | undefined
  | Array<string | number | boolean | Date | null | undefined>;

export type FormGroupOf<T> = {
  [K in keyof T]: T[K] extends Primitive
    ? FormControl<T[K] | null>
    : T[K] extends Array<infer U>
    ? FormArray<FormGroup<FormGroupOf<U>>>
    : FormGroup<FormGroupOf<T[K]>>;
};
