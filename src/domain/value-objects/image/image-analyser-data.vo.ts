import { z } from 'zod'

export interface ImageAnalyserDataProps {
  url: string
  prompt: string
}

const ImageAnalyserDataSchema = z.object({
  url: z.string().url(),
  prompt: z.string(),
})

export class ImageAnalyserData {
  readonly url: string
  readonly prompt: string

  private constructor(data: ImageAnalyserDataProps) {
    this.url = data.url
    this.prompt = data.prompt
  }

  public static from(data: ImageAnalyserDataProps): ImageAnalyserData {
    ImageAnalyserDataSchema.parse(data)
    return new ImageAnalyserData(data)
  }
}
