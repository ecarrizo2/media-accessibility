
/**
 * BaseError class extends the built-in Error class to provide additional functionality.
 * It includes a nonReprocessable property to indicate if the error is reprocessable when thrown from a Queue Contest.
 */
export class BaseError extends Error {
  nonReprocessable: boolean = true

  constructor(message: string) {
    super(message)
    this.name = this.constructor.name
    Error.captureStackTrace(this, this.constructor)
  }
}
