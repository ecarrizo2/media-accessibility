import { z } from 'zod'

/**
 * Interface representing the properties of an image analysis result.
 */
interface ImageAnalysisResultProps {
  text: string
  vendor: string
  raw: string
}

/**
 * Zod schema for validating the ImageAnalysisResultProps.
 */
const ImageAnalysisResultSchema = z.object({
  text: z.string().min(1),
  vendor: z.string().min(1),
  raw: z.string().min(1),
})

/**
 * Class representing the result of an image analysis.
 */
export class ImageAnalysisResult {
  private constructor(
    readonly text: string,
    readonly vendor: string,
    readonly raw: string
  ) {}

  /**
   * Static method to create a new ImageAnalysisResult instance from the given properties.
   *
   * @param {ImageAnalysisResultProps} props - The properties of the image analysis result.
   * @returns {ImageAnalysisResult} - The created ImageAnalysisResult instance.
   */
  static from(props: ImageAnalysisResultProps): ImageAnalysisResult {
    const parsed = ImageAnalysisResultSchema.parse(props)
    return new ImageAnalysisResult(
      parsed.text,
      parsed.vendor,
      parsed.raw
    )
  }
}
