import { ImageAnalysisResult } from '@domain/value-objects/image/image-analysis-result.vo'

interface CreateImageCommandProps {
  url: string
  prompt: string
  imageAnalysisResult: ImageAnalysisResult
}

export class CreateImageCommand {
  private constructor(
    readonly url: string,
    readonly prompt: string,
    readonly imageAnalysisResult: ImageAnalysisResult
  ) {}

  public static from(props: CreateImageCommandProps) {
    return new CreateImageCommand(
      props.url,
      props.prompt,
      props.imageAnalysisResult
    )
  }
}
