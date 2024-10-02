import { BaseError } from '@shared/errors/base.error'
import { ValidationError } from 'class-validator'

export class ClassValidatorError extends BaseError {
  nonReprocessable: boolean = false
  readonly errors: ValidationError[]

  constructor(message: string, errors: ValidationError[]) {
    super(message)
    this.name = this.constructor.name
    this.errors = errors
    Error.captureStackTrace(this, this.constructor)
  }
}
