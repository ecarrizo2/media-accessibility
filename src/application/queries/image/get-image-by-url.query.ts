export interface getImageByUrlQueryProps {
  url: string
}

export class GetImageByUrlQuery {
  private constructor(readonly url: string) {}

  static from(props: getImageByUrlQueryProps) {
    return new GetImageByUrlQuery(props.url)
  }
}
