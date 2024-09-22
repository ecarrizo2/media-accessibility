export class BaseError extends Error {
  nonReprocessable: boolean = true

  constructor(message: string) {
    super(message)
    this.name = this.constructor.name
    Error.captureStackTrace(this, this.constructor)
  }
}
