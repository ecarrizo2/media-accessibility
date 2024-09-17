import { BaseError } from '@shared/base.error'
import { JobStatus } from '@domain/enums/job/job.enum'

export class JobCannotBeStartedError extends BaseError {
  nonReprocessable = true

  constructor(status: JobStatus) {
    super(
      `Job cannot be started, Job status should be ${JobStatus.Pending} or ${JobStatus.Failed}, Given status: ${status}`
    )
  }
}
