import { IsNotEmpty, IsString } from 'class-validator'
import { Exclude, Expose, plainToInstance } from 'class-transformer'
import { myValidateOrReject } from '@shared/class-validator/validator.helper'

/**
 * Interface representing the properties of an image analysis result.
 */
export interface ImageAnalysisResultProps {
  text: string
  vendor: string
  raw: string
}

/**
 * Class representing the result of an image analysis.
 */
@Exclude()
export class ImageAnalysisResult implements ImageAnalysisResultProps {
  @IsString()
  @IsNotEmpty()
  @Expose()
  readonly text!: string

  @IsString()
  @IsNotEmpty()
  @Expose()
  readonly vendor!: string

  @IsString()
  @IsNotEmpty()
  @Expose()
  readonly raw!: string

  static async from(init: ImageAnalysisResultProps): Promise<ImageAnalysisResult> {
    const instance = plainToInstance(ImageAnalysisResult, init, { excludeExtraneousValues: true })
    await myValidateOrReject(instance)

    return instance
  }
}
