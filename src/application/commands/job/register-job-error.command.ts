import { JobEntity } from '@domain/entities/job/job.entity'
import { Exclude, Expose, plainToInstance, Type } from 'class-transformer'
import { ValidateNested } from 'class-validator'
import { myValidateOrReject } from '@shared/class-validator/validator.helper'

export interface RegisterJobErrorCommandProps {
  job: JobEntity
  error: unknown
}

@Exclude()
export class RegisterJobErrorCommand implements RegisterJobErrorCommandProps {
  @ValidateNested()
  @Type(() => JobEntity)
  @Expose()
  readonly job!: JobEntity

  @Expose()
  readonly error!: unknown

  static async from(init: RegisterJobErrorCommandProps) {
    const command = plainToInstance(RegisterJobErrorCommand, init, { excludeExtraneousValues: true })
    await myValidateOrReject(command)

    return command
  }
}
