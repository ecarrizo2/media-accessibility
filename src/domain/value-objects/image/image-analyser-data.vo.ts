import { z } from 'zod'

export interface ProcessImageDataParams {
  imageUrl: string
  prompt: string
}

const ProcessImageDataSchema = z.object({
  url: z.string().url(),
  prompt: z.string(),
})

export class ImageAnalyserData {
  readonly url: string
  readonly prompt: string

  private constructor(data: ProcessImageDataParams) {
    this.url = data.imageUrl
    this.prompt = data.prompt
  }

  public static from(data: ProcessImageDataParams): ImageAnalyserData {
    ProcessImageDataSchema.parse(data)
    return new ImageAnalyserData(data)
  }
}
