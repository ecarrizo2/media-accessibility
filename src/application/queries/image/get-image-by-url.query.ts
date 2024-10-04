import { Exclude, Expose, plainToInstance } from 'class-transformer'
import { myValidateOrReject } from '@shared/class-validator/validator.helper'
import { IsUrl } from 'class-validator'

export interface getImageByUrlQueryProps {
  url: string
}

@Exclude()
export class GetImageByUrlQuery {
  @IsUrl()
  @Expose()
  readonly url!: string

  static async from(init: getImageByUrlQueryProps) {
    const query = plainToInstance(GetImageByUrlQuery, init, { excludeExtraneousValues: true })
    await myValidateOrReject(query)

    return query
  }
}
