import { JobStatus, JobType } from '@domain/enums/job/job.enum'
import { BaseEntity } from '@domain/entities/base.entity'
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator'
import { Transform, Type } from 'class-transformer'
import { TransformJsonObject } from '@shared/class-transformer/transformation.helper'

export interface JobErrorProps {
  message: string
  stack?: string
  name: string
  timestamp: string
}

export interface JobProps {
  id: string
  type: JobType
  status: JobStatus
  input: unknown
  attempts: number
  errors?: JobErrorProps[] | null
  createdAt: string
  updatedAt?: string
}

export class JobError implements JobErrorProps {
  @IsString()
  @IsNotEmpty()
  message!: string

  @IsString()
  @IsOptional()
  stack?: string

  @IsString()
  @IsNotEmpty()
  name!: string

  @IsDateString()
  @IsNotEmpty()
  timestamp!: string
}

/**
 * Class representing a job entity.
 */
export class JobEntity implements JobProps, BaseEntity {
  @IsString()
  @IsNotEmpty()
  id!: string

  @IsEnum(JobType)
  type!: JobType

  @IsEnum(JobStatus)
  status!: JobStatus

  @IsNumber()
  @IsNotEmpty()
  attempts!: number

  @IsNotEmpty()
  @Transform(({ value }) => JSON.stringify(value), { toPlainOnly: true })
  @TransformJsonObject()
  input!: unknown

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => JobError)
  @IsOptional()
  errors?: JobError[] | null

  @IsDateString()
  @IsNotEmpty()
  createdAt!: string

  @IsDateString()
  @IsOptional()
  updatedAt?: string

  /**
   * Validates the current state of the job.
   * @throws {Error} If the state is invalid.
   */
  async validateState() {}

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
