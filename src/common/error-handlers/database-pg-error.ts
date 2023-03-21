export class DatabasePgError extends Error {
  public code: string;
  public column: string | undefined;

  constructor(message: string, code: string, detail?: string) {
    super(message);
    this.name = 'DatabaseError';
    this.code = code;
    this.column = undefined;

    if (code === '23505' && detail) {
      const match = detail.match(/\(([^)]+)\)=\(([^)]+)\)/);
      if (match && match.length === 3) {
        const column = match[1];
        const value = match[2];
        this.column = column;
        this.message = `${column} with value ${value} already exists`;
      }
    } else if (code === '23503' && detail) {
      const match = detail.match(/\(([^)]+)\)=\(([^)]+)\)/);
      if (match && match.length === 3) {
        const column = match[1];
        const value = match[2];
        this.column = column;
        this.message = `Foreign key constraint violation for ${column} with value ${value}`;
      }
    } else if (code === '23502' && detail) {
      const match = detail.match(/violates not-null constraint "([^"]+)"/);
      if (match && match.length === 2) {
        const column = match[1];
        this.column = column;
        this.message = `${column} is required`;
      }
    } else if (code === '22001' && detail) {
      const match = detail.match(/value too long for type (.+?)\((\d+)\)/);
      if (match && match.length === 3) {
        const columnType = match[1];
        const maxLength = match[2];
        this.message = `Value is too long for ${columnType} (maximum length is ${maxLength})`;
      }
    }
  }
}
