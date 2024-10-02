import { ImageAnalysisResult, ImageAnalysisResultProps } from '@domain/value-objects/image/image-analysis-result.vo'
import { Exclude, Expose, plainToInstance, Type } from 'class-transformer'
import { IsString, IsUrl, ValidateNested } from 'class-validator'
import { myValidateOrReject } from '@shared/class-validator/validator.helper'

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
  readonly imageAnalysisResult!: ImageAnalysisResultProps

  static async from(init: CreateImageCommandProps) {
    const command = plainToInstance(CreateImageCommand, init, { excludeExtraneousValues: true })
    await myValidateOrReject(command)

    return command
  }
}
