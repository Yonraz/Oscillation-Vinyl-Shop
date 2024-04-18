import { CustomError } from "./custom-error";

export class UnauthorizedAccessError extends CustomError {
  statusCode = 401;

  constructor() {
    super("Not Authorized");
  }

  serializeErrors() {
    return [{ message: "Not Authorized" }];
  }
}
