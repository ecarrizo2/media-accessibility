import { BaseError } from '@shared/errors/base.error'

export class JobErrorCannotBeRegisteredError extends BaseError {
  constructor(reason: string) {
    super(`Job error cannot be registered: ${reason}`)
  }
}
