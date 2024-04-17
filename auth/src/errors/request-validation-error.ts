import { ValidationError } from "express-validator";
import { ErrorResponse } from "../types/error-response-type";
import { CustomError } from "./custom-error";

export class RequestValidationError extends CustomError {
  statusCode = 400;

  constructor(private errors: ValidationError[]) {
    super("Invalid request parameters");
  }

  serializeErrors() {
    const formattedErrors: ErrorResponse[] = this.errors.map((error) => {
      if (error.type === "field") {
        return { message: error.msg, field: error.path };
      }
      return { message: error.msg };
    });
    return formattedErrors;
  }
}
