export class ApiResponse<T> {
  constructor(message: string, data: T) {
    this.message = message;
    this.data = data;
  }

  message?: string;
  data?: T;
}
