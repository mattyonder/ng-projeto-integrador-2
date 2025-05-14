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

export function readFileAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}
