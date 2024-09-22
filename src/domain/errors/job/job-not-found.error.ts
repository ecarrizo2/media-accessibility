import { BaseError } from '@shared/errors/base.error'

/**
 * Error thrown when a job for a query was not found.
 */
export class JobNotFoundError extends BaseError {
  nonReprocessable = true

  constructor() {
    super('The job for the provided query was not found')
  }
}
