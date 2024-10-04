import { inject, injectable } from 'tsyringe'
import { ImageAnalyserService } from '@domain/services/image/image-analyser.interface'
import { OpenAIImageAnalyserService } from '@infrastructure/services/image/openai-image-analyser.service'
import { AnalyseImageCommand } from '@application/commands/image/analyse-image.command'
import { ImageAnalysisResult } from '@domain/value-objects/image/image-analysis-result.vo'
import { ImageAnalyserInput } from '@domain/value-objects/image/image-analyser-input.vo'

@injectable()
export class AnalyseImageCommandHandler {
  constructor(@inject(OpenAIImageAnalyserService) private readonly imageAnalyserService: ImageAnalyserService) {}

  /**
   * Handles the analysis of an image.
   *
   * @param {AnalyseImageCommand} command - Command containing the image URL and prompt.
   * @returns {Promise<any>} - The result of the image analysis.
   */
  async handle(command: AnalyseImageCommand): Promise<ImageAnalysisResult> {
    const imageAnalysisData = await ImageAnalyserInput.from({
      url: command.url,
      prompt: command.prompt,
    })

    return this.imageAnalyserService.analyseImage(imageAnalysisData)
  }
}
