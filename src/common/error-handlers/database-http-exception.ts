import { HttpException, HttpStatus } from '@nestjs/common';

export class DatabaseHttpException extends HttpException {
  public column: string | undefined;

  constructor(message: string, code: string, detail?: string) {
    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let responseBody: any = {
      statusCode,
      message: 'Internal server error',
      error: 'DatabaseError',
    };

    if (code === '23505' && detail) {
      statusCode = HttpStatus.CONFLICT;
      const match = detail.match(/\(([^)]+)\)=\(([^)]+)\)/);
      if (match && match.length === 3) {
        const column = match[1];
        const value = match[2];
        responseBody = {
          statusCode,
          message: `${column} with value ${value} already exists`,
          error: 'Conflict',
        };
      }
    } else if (code === '23503' && detail) {
      statusCode = HttpStatus.BAD_REQUEST;
      const match = detail.match(/\(([^)]+)\)=\(([^)]+)\)/);
      if (match && match.length === 3) {
        const column = match[1];
        const value = match[2];
        responseBody = {
          statusCode,
          message: `Foreign key constraint violation for ${column} with value ${value}`,
          error: 'Bad Request',
        };
      }
    } else if (code === '23502' && detail) {
      statusCode = HttpStatus.BAD_REQUEST;
      const match = detail.match(/violates not-null constraint "([^"]+)"/);
      if (match && match.length === 2) {
        const column = match[1];
        responseBody = {
          statusCode,
          message: `${column} is required`,
          error: 'Bad Request',
        };
      }
    } else if (code === '22001' && detail) {
      statusCode = HttpStatus.BAD_REQUEST;
      const match = detail.match(/value too long for type (.+?)\((\d+)\)/);
      if (match && match.length === 3) {
        const columnType = match[1];
        const maxLength = match[2];
        responseBody = {
          statusCode,
          message: `Value is too long for ${columnType} (maximum length is ${maxLength})`,
          error: 'Bad Request',
        };
      }
    }

    super(responseBody, statusCode);
    this.column = responseBody.message.includes('with value')
      ? responseBody.message.split('with value')[0].trim()
      : undefined;
  }
}
