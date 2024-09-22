import { BaseError } from '@shared/errors/base.error'

export class JobNotFoundError extends BaseError {
  nonReprocessable = true

  constructor() {
    super('The job for the provided query was not found')
  }
}
