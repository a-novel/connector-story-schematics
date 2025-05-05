export class ForbiddenError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ForbiddenError";
  }
}

export const isForbiddenError = (err: any) => err instanceof ForbiddenError;

export class UnauthorizedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UnauthorizedError";
  }
}

export const isUnauthorizedError = (err: any) => err instanceof UnauthorizedError;

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NotFoundError";
  }
}

export const isNotFoundError = (err: any) => err instanceof NotFoundError;

export class InternalError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InternalError";
  }
}

export const isInternalError = (err: any) => err instanceof InternalError;

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

export const isValidationError = (err: any) => err instanceof ValidationError;

export const newErrorResponseMessage = async (message: string, response: Response): Promise<string> => {
  if (response.body == null) {
    return `${message}: unexpected status code ${response.status}`;
  }

  const responseBody = await response.text().catch((e) => `read response: ${e}`);
  return `${message}: [${response.status}] ${responseBody}`;
};
