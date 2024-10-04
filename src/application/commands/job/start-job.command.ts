import { JobEntity } from '@domain/entities/job/job.entity'
import { Exclude, Expose, plainToInstance, Type } from 'class-transformer'
import { ValidateNested } from 'class-validator'
import { myValidateOrReject } from '@shared/class-validator/validator.helper'

export interface StartJobCommandProps {
  job: JobEntity
}

@Exclude()
export class StartJobCommand implements StartJobCommandProps {
  @ValidateNested()
  @Type(() => JobEntity)
  @Expose()
  readonly job!: JobEntity

  static async from(init: StartJobCommandProps) {
    const command = plainToInstance(StartJobCommand, init, { excludeExtraneousValues: true })
    await myValidateOrReject(command)

    return command
  }
}
