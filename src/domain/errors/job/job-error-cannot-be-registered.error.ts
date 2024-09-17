import { BaseError } from '@shared/base.error'

export class JobErrorCannotBeRegisteredError extends BaseError {
  constructor(reason: string) {
    super(`Job error cannot be registered: ${reason}`)
  }
}
