import { IsNotEmpty, IsUrl, validateOrReject } from 'class-validator'
import { Exclude, Expose, plainToInstance } from 'class-transformer'

export interface AnalyseImageCommandProps {
  url: string
  prompt: string
}

@Exclude()
export class AnalyseImageCommand {
  @IsUrl()
  @Expose()
  readonly url: string

  @IsNotEmpty()
  @Expose()
  readonly prompt: string

export class AnalyseImageCommand {
  url: string;
  prompt: string;
}

  static async from(init: AnalyseImageCommandProps) {
    const command = plainToInstance(AnalyseImageCommand, init)
    await validateOrReject(command)

    return command
  }
}
