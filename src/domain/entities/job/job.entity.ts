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
import { Exclude, Expose, plainToInstance, Transform, Type } from 'class-transformer'
import { TransformJsonObject } from '@shared/class-transformer/transformation.helper'
import { myValidateOrReject } from '@shared/class-validator/validator.helper'
import { Image } from '@domain/entities/image/image.entity'

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
@Exclude()
export class JobEntity implements JobProps, BaseEntity {
  @IsString()
  @IsNotEmpty()
  @Expose()
  id!: string

  @IsEnum(JobType)
  @Expose()
  type!: JobType

  @IsEnum(JobStatus)
  @Expose()
  status!: JobStatus

  @IsNumber()
  @IsNotEmpty()
  @Expose()
  attempts!: number

  @IsNotEmpty()
  @Transform(({ value }) => JSON.stringify(value), { toPlainOnly: true })
  @Transform(({ value }) => JSON.parse(value as string) as unknown, { toClassOnly: true })
  @TransformJsonObject()
  @Expose()
  input!: unknown

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => JobError)
  @IsOptional()
  @Expose()
  errors?: JobError[] | null

  @IsDateString()
  @IsNotEmpty()
  @Expose()
  createdAt!: string

  @IsDateString()
  @IsOptional()
  @Expose()
  updatedAt?: string

  static async from(init: JobProps) {
    const instance = plainToInstance(JobEntity, init, { excludeExtraneousValues: true })
    await myValidateOrReject(instance)

    return instance
  }

  async validateState() {
    await myValidateOrReject(this)
  }

  canStart(): boolean {
    return this.status === JobStatus.Pending || this.status === JobStatus.Failed
  }

  start() {
    this.status = JobStatus.InProgress
    this.attempts++
  }

  isCompleted() {
    return this.status === JobStatus.Completed
  }

  complete() {
    this.status = JobStatus.Completed
  }

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
