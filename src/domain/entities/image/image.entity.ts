export interface ImageProps {
  url: string
  description: string
}

export class ImageEntity implements ImageProps {
  readonly url: string
  readonly description: string

  constructor(props: ImageProps) {
    this.url = props.url
    this.description = props.description
  }
}
