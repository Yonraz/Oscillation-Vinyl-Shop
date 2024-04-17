import { ErrorResponse } from "../types/error-response-type";
import { CustomError } from "./custom-error";

export class DatabaseConnectionError extends CustomError {
  reason = "Error connecting to database";
  statusCode = 500;
  constructor() {
    super("Error connecting to database");
  }

  serializeErrors() {
    const response: ErrorResponse[] = [{ message: this.reason }];
    return response;
  }
}
