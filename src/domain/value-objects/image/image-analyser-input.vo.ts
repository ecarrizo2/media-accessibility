import { z } from 'zod'

/**
 * Interface representing the properties required for image analysis input.
 */
export interface ImageAnalyserInputProps {
  url: string
  prompt: string
}

/**
 * Zod schema for validating the ImageAnalyserInputProps.
 */
const ImageAnalyserInputSchema = z.object({
  url: z.string().url(),
  prompt: z.string(),
})

/**
 * Class representing the input for image analysis.
 */
export class ImageAnalyserInput {
  private constructor(
    readonly url: string,
    readonly prompt: string
  ) {}

  /**
   * Static method to factory a new ImageAnalyserInput instance from the given data.
   *
   * @param {ImageAnalyserInputProps} data - The properties required for image analysis input.
   * @returns {ImageAnalyserInput} - The created ImageAnalyserInput instance.
   */
  static from(data: ImageAnalyserInputProps): ImageAnalyserInput {
    const parsed = ImageAnalyserInputSchema.parse(data)
    return new ImageAnalyserInput(parsed.url, parsed.prompt)
  }
}
