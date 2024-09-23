export interface AnalyseImageCommandProps {
  url: string
  prompt: string
}

export class AnalyseImageCommand {
  private constructor(
    readonly url: string,
    readonly prompt: string,
  ) {}

  public static from(props: AnalyseImageCommandProps) {
    return new AnalyseImageCommand(
      props.url,
      props.prompt,
    )
  }
}
