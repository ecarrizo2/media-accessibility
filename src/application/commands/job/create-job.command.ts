import { JobType } from '@domain/enums/job/job.enum'
import { Exclude, Expose, plainToInstance } from 'class-transformer'
import { IsEnum, IsNotEmptyObject } from 'class-validator'
import { myValidateOrReject } from '@shared/class-validator/validator.helper'

export interface CreateJobCommandProps {
  type: JobType
  input: unknown
}

@Exclude()
export class CreateJobCommand implements CreateJobCommandProps {
  @IsEnum(JobType )
  @Expose( )
  readonly type!: JobType

  @IsNotEmptyObject( )
  @Expose()
  readonly input: unknown

  static async from(init: CreateJobCommandProps) {
    const command = plainToInstance(CreateJobCommand, init, { excludeExtraneousValues: true })
    await myValidateOrReject(command)

    return command
  }
}
