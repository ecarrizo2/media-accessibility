import { inject, injectable } from 'tsyringe'
import { ImageAnalyserData } from '@domain/value-objects/image/image-analyser-data.vo'
import { ImageAnalyserService } from '@infrastructure/services/image/openai-image-analyser.service'
import { DynamodbImageRepository } from '@infrastructure/repositories/image/dynamodb-image.repository'
import { ImageRepository } from '@domain/repositories/image/image-repository.interface'
import { ImageEntity } from '@domain/entities/image/image.entity'
import { ProcessImageCommand } from '@application/commands/image/process-image.command'
import { v4 } from 'uuid'

@injectable()
export class ProcessImageCommandHandler {
  constructor(
    @inject(ImageAnalyserService) private readonly imageAnalyserService: ImageAnalyserService,
    @inject(DynamodbImageRepository) private readonly imageRepository: ImageRepository
  ) {}

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
