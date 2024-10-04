import { Exclude, Expose, plainToInstance } from 'class-transformer'
import { IsNotEmpty, IsString, IsUrl } from 'class-validator'
import { myValidateOrReject } from '@shared/class-validator/validator.helper'

/**
 * Interface representing the properties required for image analysis input.
 */
export interface ImageAnalyserInputProps {
  url: string
  prompt: string
}

/**
 * Class representing the input for image analysis.
 */
@Exclude()
export class ImageAnalyserInput {
  @IsUrl()
  @Expose()
  readonly url!: string

  @IsString()
  @IsNotEmpty()
  @Expose()
  readonly prompt!: string

  static async from(init: ImageAnalyserInputProps): Promise<ImageAnalyserInput> {
    const instance = plainToInstance(ImageAnalyserInput, init)
    await myValidateOrReject(instance)

    return instance
  }
}
