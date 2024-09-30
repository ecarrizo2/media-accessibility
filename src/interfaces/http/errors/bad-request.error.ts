import { ValidationError } from 'class-validator'

export class BadRequestError extends Error {
  validationErrors: ValidationError[] | undefined

  constructor(message: string, validationErrors?: ValidationError[]) {
    super(message)
    this.validationErrors = validationErrors
  }
}
