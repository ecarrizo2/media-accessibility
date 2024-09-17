import { BaseError } from '@shared/base.error'

export class JobNotFoundError extends BaseError {
  nonReprocessable = true

  constructor() {
    super('The job for the provided query was not found')
  }
}
