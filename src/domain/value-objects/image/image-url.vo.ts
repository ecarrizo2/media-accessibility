interface ImageUrlProps {
  url: string
}

export class ImageUrl implements ImageUrlProps {
  url: string

  constructor(props: ImageUrlProps) {
    this.url = props.url
  }

  public static from(props: ImageUrlProps): ImageUrl {
    return new ImageUrl(props)
  }
}
