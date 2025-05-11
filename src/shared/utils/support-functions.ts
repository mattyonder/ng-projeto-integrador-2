import { HttpParams } from '@angular/common/http';

export function toParams(...args: any[]): HttpParams {
  let params = new HttpParams();

  args.forEach((obj) => {
    if (obj) {
      Object.keys(obj).forEach((key) => {
        if (obj[key] !== undefined && obj[key] !== null)
          params = params.set(key, obj[key]);
      });
    }
  });

  return params;
}
