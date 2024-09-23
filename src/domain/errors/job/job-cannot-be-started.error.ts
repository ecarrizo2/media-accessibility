import { BaseException } from '@shared/base.exception'
import { JobStatus } from '@domain/enums/job/job.enum'

export class JobCannotBeStartedException extends BaseException {
  nonReprocessable = true

  constructor(status: JobStatus) {
    super(`Job cannot be started, Job status should be ${JobStatus.Pending} or ${JobStatus.Failed}, Given status: ${status}`)
  }
}
