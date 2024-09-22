import { BaseError } from '@shared/errors/base.error'
import { JobStatus } from '@domain/enums/job/job.enum'

/**
 * Error thrown when a job cannot be started.
 */
export class JobCannotBeStartedError extends BaseError {
  nonReprocessable = true

  constructor(status: JobStatus) {
    super(
      `Job cannot be started, Job status should be ${JobStatus.Pending} or ${JobStatus.Failed}, Given status: ${status}`
    )
  }
}
