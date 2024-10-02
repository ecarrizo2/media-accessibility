import { IsNotEmpty, IsUrl } from 'class-validator'
import { Exclude, Expose, plainToInstance } from 'class-transformer'
import { myValidateOrReject } from '@shared/class-validator/validator.helper'

export interface AnalyseImageCommandProps {
  url: string
  prompt: string
}

@Exclude()
export class AnalyseImageCommand {
  @IsUrl()
  @Expose()
  readonly url!: string

  @IsNotEmpty()
  @Expose()
  readonly prompt!: string

  static async from(init: AnalyseImageCommandProps) {
    const command = plainToInstance(AnalyseImageCommand, init)
    await myValidateOrReject(command)

    return command
  }
}
