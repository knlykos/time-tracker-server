export class ApiResponse<T> {
  private message?: string;
  private data?: T;
  private timestamp?: Date = new Date();

  constructor(message: string, data?: T) {
    this.message = message;
    this.data = data;
  }
}
