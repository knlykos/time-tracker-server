export class ApiResponse<T> {
  message?: string;
  data?: T;

  constructor(message: string, data: T) {
    this.message = message;
    this.data = data;
  }
}
