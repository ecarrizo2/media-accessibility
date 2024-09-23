import { BaseError } from '@shared/base.error'
import { JobStatus } from '@domain/enums/job/job.enum'

export class JobErrorCannotBeRegisteredError extends BaseError {
  constructor(reason: string) {
    super(`Job error cannot be registered: ${reason}`)
  }
}
