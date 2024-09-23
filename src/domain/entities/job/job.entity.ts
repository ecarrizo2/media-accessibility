import { JobStatus, JobType } from '@domain/enums/job/job.enum'
interface JobError {
  message: string
  stack: string | undefined
  name: string
  timestamp: string
}
export interface JobProps {
  id: string
  type: JobType
  status: JobStatus
  input: unknown
  attempts: number
  errors: JobError[] | null
  createdAt: string
  updatedAt?: string
}

export class JobEntity implements JobProps {
  id: string
  type: JobType
  status: JobStatus
  attempts: number
  input: unknown
  errors: JobError[] | null
  createdAt: string
  updatedAt?: string

  constructor(props: JobProps) {
    this.id = props.id
    this.type = props.type
    this.status = props.status
    this.input = props.input
    this.attempts = props.attempts
    this.errors = props.errors
    this.createdAt = props.createdAt
    this.updatedAt = props.updatedAt
  }

  /**
   * Checks if the job can be started.
   * @returns {boolean} - True if the job can be started, otherwise false.
   */
  canStart(): boolean {
    return this.status === JobStatus.Pending || this.status === JobStatus.Failed
  }

  /**
   * Starts the job by setting its status to InProgress and incrementing attempts.
   */
  start() {
    this.status = JobStatus.InProgress
    this.attempts++
  }

  /**
   * Checks if the job is completed.
   *
   * @returns {boolean} - True if the job is completed, otherwise false.
   */
  isCompleted() {
    return this.status === JobStatus.Completed
  }

  /**
   * Completes the job by setting its status to Completed.
   */
  complete() {
    this.status = JobStatus.Completed
  }

  /**
   * Marks the job as failed and adds an error.
   *
   * @param {Error} error - The error to be registered.
   */
  failed(error: Error) {
    this.status = JobStatus.Failed
    this.registerError(error)
  }

  private registerError(error: Error) {
    const errorInfo = {
      message: error.message,
      stack: error.stack,
      name: error.name,
      timestamp: new Date().toISOString(),
    }

    if (!this.errors) {
      this.errors = []
    }

    this.errors.push(errorInfo)
  }
}
