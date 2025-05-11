export class ResponseDto<T> {
  response: T;
  type: number;
  status: number;

  constructor(response: T, type: number, status: number) {
    this.response = response;
    this.type = type;
    this.status = status;
  }
}
