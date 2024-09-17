import { z } from 'zod'

interface ImageAnalysisResultProps {
  description: string
}

const ImageAnalysisResultSchema = z.object({
  description: z.string().min(1),
})

export class ImageAnalysisResult {
  readonly description: string

  private constructor(description: string) {
    this.description = description
  }

  public static from(data: ImageAnalysisResultProps): ImageAnalysisResult {
    ImageAnalysisResultSchema.parse(data)
    return new ImageAnalysisResult(data.description)
  }
}
