export class ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}
