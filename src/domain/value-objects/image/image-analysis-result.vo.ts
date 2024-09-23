import { z } from 'zod'

interface ImageAnalysisResultProps {
  text: string
  vendor: string
  raw: string
}

const ImageAnalysisResultSchema = z.object({
  text: z.string().min(1),
  vendor: z.string().min(1),
  raw: z.string().min(1),
})

export class ImageAnalysisResult {
  readonly text: string
  readonly vendor: string
  readonly raw: string

  private constructor(props: ImageAnalysisResultProps) {
    this.text = props.text
    this.vendor = props.vendor
    this.raw = props.raw
  }

  public static from(props: ImageAnalysisResultProps): ImageAnalysisResult {
    const parsed = ImageAnalysisResultSchema.parse(props)
    return new ImageAnalysisResult(parsed)
  }
}
