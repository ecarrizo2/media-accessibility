import { IsNotEmpty, IsString, validateOrReject } from 'class-validator'
import { plainToInstance } from 'class-transformer'

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
export class ImageAnalysisResult implements ImageAnalysisResultProps {
  @IsString()
  @IsNotEmpty()
  readonly text!: string

  @IsString()
  @IsNotEmpty()
  readonly vendor!: string

  @IsString()
  @IsNotEmpty()
  readonly raw!: string

  static async from(init: ImageAnalysisResultProps): Promise<ImageAnalysisResult> {
    const instance = plainToInstance(ImageAnalysisResult, init)
    await validateOrReject(instance)

    return instance
  }
}
