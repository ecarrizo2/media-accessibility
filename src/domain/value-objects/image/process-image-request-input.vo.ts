import { z } from 'zod'

export interface ProcessImageRequestInputParams {
  url: string
  prompt: string
  createSpeech?: boolean
}

const ProcessImageInputSchema = z.object({
  url: z.string().url(),
  prompt: z.string(),
  createSpeech: z.boolean().optional(),
})

export class ProcessImageRequestInput {
  readonly url: string
  readonly prompt: string
  readonly createSpeech: boolean

  private constructor(input: ProcessImageRequestInputParams) {
    this.url = input.url
    this.prompt = input.prompt
    this.createSpeech = input.createSpeech ?? false
  }

  public static from(input: ProcessImageRequestInputParams) {
    return new ProcessImageRequestInput(ProcessImageInputSchema.parse(input))
  }
}
