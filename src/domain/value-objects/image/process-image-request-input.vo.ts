import { z } from 'zod'

/**
 * Interface representing the parameters for processing an image request.
 */
export interface ProcessImageRequestInputProps {
  url: string
  prompt: string
  createSpeech?: boolean
}

/**
 * Zod schema for validating the ProcessImageRequestInputParams.
 */
const ProcessImageInputSchema = z.object({
  url: z.string().url(),
  prompt: z.string(),
  createSpeech: z.boolean().optional(),
})

/**
 * Class representing the input for processing an image request.
 */
export class ProcessImageRequestInput {
  private constructor(
    readonly url: string,
    readonly prompt: string,
    readonly createSpeech: boolean
  ) {}

  /**
   * Static method to factory a new ProcessImageRequestInput instance from the given input parameters.
   *
   * @param {ProcessImageRequestInputProps} input - The input parameters for processing an image request.
   * @returns {ProcessImageRequestInput} - The created ProcessImageRequestInput instance.
   */
  static from(input: ProcessImageRequestInputProps) {
    const parsed = ProcessImageInputSchema.parse(input)
    return new ProcessImageRequestInput(parsed.url, parsed.prompt, parsed.createSpeech ?? false)
  }
}
