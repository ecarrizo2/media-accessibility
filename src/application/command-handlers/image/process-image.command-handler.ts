import { inject, injectable } from 'tsyringe'
import { ImageAnalyserData } from '@domain/value-objects/image/image-analyser-data.vo'
import {
  OpenAIImageAnalyserService,
} from '@infrastructure/services/image/openai-image-analyser.service'
import { DynamodbImageRepository } from '@infrastructure/repositories/image/dynamodb-image.repository'
import { ImageRepository } from '@domain/repositories/image/image-repository.interface'
import { ImageEntity } from '@domain/entities/image/image.entity'
import { ProcessImageCommand } from '@application/commands/image/process-image.command'
import { ImageAnalyserService } from '@domain/services/image/image-analyser.interface'
import { v4 } from 'uuid'


@injectable()
export class ProcessImageCommandHandler {
  constructor(
    @inject(OpenAIImageAnalyserService) private readonly imageAnalyserService: ImageAnalyserService,
    @inject(DynamodbImageRepository) private readonly imageRepository: ImageRepository,
  ) {
  }

  /**
   * Handles the processing of an image.
   *
   * @param {ProcessImageCommand} command - Command containing the image URL and prompt.
   * @returns {Promise<ImageEntity>} - The processed image entity.
   */
  async handle(command: ProcessImageCommand): Promise<ImageEntity> {
    const existingImage = await this.imageRepository.findByUrl(command.url)
    if (existingImage) {
      return existingImage
    }

    const imageAnalysisData = ImageAnalyserData.from({
      url: command.url,
      prompt: command.prompt,
    })

    const imageAnalysisResult = await this.imageAnalyserService.analyseImage(imageAnalysisData)

    const newImage = new ImageEntity({
      id: v4(),
      url: command.url,
      prompt: command.prompt,
      analysisText: imageAnalysisResult.text,
      analysisVendor: imageAnalysisResult.vendor,
      analysisResultRaw: imageAnalysisResult.raw,
    })

    await this.imageRepository.save(newImage)

    return newImage
  }
}
