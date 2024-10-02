import { JobEntity } from '@domain/entities/job/job.entity'
import { Exclude, Expose, plainToInstance } from 'class-transformer'
import { ValidateNested } from 'class-validator'
import { myValidateOrReject } from '@shared/class-validator/validator.helper'

export interface CompleteJobCommandProps {
  job: JobEntity
}

@Exclude()
export class CompleteJobCommand implements CompleteJobCommandProps {
  @ValidateNested()
  @Expose()
  readonly job!: JobEntity

  static async from(props: CompleteJobCommandProps) {
    const command = plainToInstance(CompleteJobCommand, props, { excludeExtraneousValues: true })
    await myValidateOrReject(command)

    return command
  }
}
