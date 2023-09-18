export class ApiResponse<T> {
  private readonly message?: string;
  private readonly data?: T;
  private readonly status: number;
  private timestamp: Date = new Date();

  constructor(message: string, status: number, data?: T) {
    this.message = message;
    this.status = status;
    this.data = data;
  }

  static ok<T>(message: string, data?: T): ApiResponse<T> {
    return new ApiResponse<T>(message, 200, data);
  }

  static created<T>(message: string, data?: T): ApiResponse<T> {
    return new ApiResponse<T>(message, 201, data);
  }

  getMessage(): string | undefined {
    return this.message;
  }

  getStatus(): number {
    return this.status;
  }

  getData(): T | undefined {
    return this.data;
  }

  getTimestamp(): Date {
    return this.timestamp;
  }
}
