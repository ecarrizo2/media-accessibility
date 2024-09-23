import { z } from 'zod'
import { JobStatus, JobType } from '@domain/enums/job/job.enum'
import { BaseEntity } from '@domain/entities/base.entity'

/**
 * Interface representing an error that occurred during a job.
 */
export interface JobError {
  /** The error message. */
  message: string

  /** The stack trace of the error (optional). */
  stack: string | undefined

  /** The name of the error. */
  name: string

  /** The timestamp when the error occurred. */
  timestamp: string
}

/**
 * Interface representing the properties of a job.
 */
export interface JobProps {
  /** The unique identifier of the job. */
  id: string

  /** The type of the job. */
  type: JobType

  /** The status of the job. */
  status: JobStatus

  /** The input data for the job. */
  input: unknown

  /** The number of attempts made to complete the job. */
  attempts: number

  /** The list of errors that occurred during the job (nullable). */
  errors: JobError[] | null

  /** The date and time when the job was created. */
  createdAt: string

  /** The date and time when the job was last updated (optional). */
  updatedAt?: string
}

/**
 * Zod schema for validating JobProps.
 */
const JobPropsSchema = z.object({
  id: z.string(),
  type: z.nativeEnum(JobType),
  status: z.nativeEnum(JobStatus),
  input: z.unknown(),
  attempts: z.number().nonnegative(),
  errors: z
    .array(
      z.object({
        message: z.string(),
        stack: z.string().optional(),
        name: z.string(),
        timestamp: z.string(),
      })
    )
    .nullable(),
  createdAt: z.string(),
  updatedAt: z.string().optional(),
})

/**
 * Class representing a job entity.
 * Implements the JobProps and BaseEntity interfaces.
 */
export class JobEntity implements JobProps, BaseEntity {
  id: string
  type: JobType
  status: JobStatus
  attempts: number
  input: unknown
  errors: JobError[] | null
  createdAt: string
  updatedAt?: string

  /**
   * Creates an instance of JobEntity.
   * @param {JobProps} props - The properties of the job.
   */
  constructor(props: JobProps) {
    this.validateInitialization(props)
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
   * Validates the initialization properties of the job.
   * @param {JobProps} props - The properties to validate.
   * @private
   */
  private validateInitialization(props: JobProps) {
    JobPropsSchema.parse(props)
  }

  /**
   * Validates the current state of the job.
   * @throws {Error} If the state is invalid.
   */
  validateState() {
    JobPropsSchema.parse(this)
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
   * @param {Error} error - The error to be registered.
   */
  failed(error: Error) {
    this.status = JobStatus.Failed
    this.registerError(error)
  }

  /**
   * Registers an error that occurred during the job.
   * @param {Error} error - The error to register.
   * @private
   */
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
