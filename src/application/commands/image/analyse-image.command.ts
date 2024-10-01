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

  constructor(url: string, prompt: string) {
    this.url = url
    this.prompt = prompt
  }

  static async from(init: AnalyseImageCommandProps) {
    const command = plainToInstance(AnalyseImageCommand, init)
    await validateOrReject(command)

    return command
  }
}
