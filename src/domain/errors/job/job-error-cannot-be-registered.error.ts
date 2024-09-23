import { BaseError } from '@shared/errors/base.error'

/**
 * Error thrown when a job error cannot be registered.
 * Errors are registered in Jobs when it's internal processing fails
 */
export class JobErrorCannotBeRegisteredError extends BaseError {
  constructor(reason: string) {
    super(`Job error cannot be registered: ${reason}`)
  }
}
