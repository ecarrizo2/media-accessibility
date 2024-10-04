import { Exclude, Expose, plainToInstance } from 'class-transformer'
import { IsUUID } from 'class-validator'
import { myValidateOrReject } from '@shared/class-validator/validator.helper'

export interface GetJobByIdQueryProps {
  jobId: string
}

@Exclude()
export class GetJobByIdQuery {
  @IsUUID(4)
  @Expose()
  readonly jobId!: string

  static async from(init: GetJobByIdQueryProps) {
    const query = plainToInstance(GetJobByIdQuery, init, { excludeExtraneousValues: true })
    await myValidateOrReject(query)

    return query
  }
}
