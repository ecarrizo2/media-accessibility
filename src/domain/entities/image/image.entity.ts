export interface ImageProps {
  id: string
  url: string
  prompt: string
  analysisText: string
  analysisVendor: string
  analysisResultRaw: unknown
}

export class ImageEntity implements ImageProps {
  readonly id: string
  readonly url: string
  readonly prompt: string
  readonly analysisText: string
  readonly analysisVendor: string
  readonly analysisResultRaw: unknown

  constructor(props: ImageProps) {
    this.id = props.id
    this.url = props.url
    this.analysisText = props.analysisText
    this.analysisResultRaw = props.analysisResultRaw
    this.analysisVendor = props.analysisVendor
    this.prompt = props.prompt
  }
}
