export interface ProcessImageCommandProps {
  url: string
  prompt: string
  createSpeech?: boolean
}

export class ProcessImageCommand {
  private constructor(
    readonly url: string,
    readonly prompt: string,
    readonly createSpeech: boolean
  ) {}

  public static from(props: ProcessImageCommandProps) {
    return new ProcessImageCommand(props.url, props.prompt, props.createSpeech ?? false)
  }
}
