import { ImageAnalysisResult } from '@domain/value-objects/image/image-analysis-result.vo'
import { Exclude, Expose, plainToInstance, Type } from 'class-transformer'
import { IsString, IsUrl, ValidateNested, validateOrReject } from 'class-validator'

export interface CreateImageCommandProps {
  url: string
  prompt: string
  imageAnalysisResult: ImageAnalysisResult
}

@Exclude()
export class CreateImageCommand {
  @IsUrl()
  @Expose()
  readonly url!: string

  @IsString()
  @Expose()
  readonly prompt!: string

  @ValidateNested()
  @Type(() => ImageAnalysisResult)
  @Expose()
  readonly imageAnalysisResult!: ImageAnalysisResult

  static async from(init: CreateImageCommandProps) {
    const command = plainToInstance(CreateImageCommand, init)
    await validateOrReject(command)

    return command
  }
}
