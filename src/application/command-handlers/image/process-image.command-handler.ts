import { inject, injectable } from 'tsyringe'
import { ImageAnalyserData } from '@domain/value-objects/image-analyser-data.vo'
import { ImageAnalyserService } from '@domain/services/image-analyser.service'
import { DynamodbImageRepository } from '@infrastructure/repositories/dynamodb-image.repository'
import { ImageRepository } from '@domain/repositories/image-repository.interface'
import { ImageEntity } from '@domain/entities/image.entity'
import { ProcessImageCommand } from '@application/commands/process-image.command'

@injectable()
export class ProcessImageCommandHandler {
  constructor(
    @inject(ImageAnalyserService) private readonly imageAnalyserService: ImageAnalyserService,
    @inject(DynamodbImageRepository) private readonly imageRepository: ImageRepository
    // @inject(TextToSpeechService) private readonly textToSpeechService: TextToSpeechService
  ) {}

  async handle(command: ProcessImageCommand): Promise<ImageEntity> {
    const existingImage = await this.imageRepository.findByUrl(command.url)
    if (existingImage) {
      return existingImage
    }

    const imageAnalysisData = ImageAnalyserData.from({
      imageUrl: command.url,
      prompt: command.prompt,
    })

    const imageAnalysisResult = await this.imageAnalyserService.analyseImage(imageAnalysisData)

    const newImage = new ImageEntity({
      // id:
      url: command.url,
      description: imageAnalysisResult.description,
    })

    await this.imageRepository.save(newImage)

    return newImage
  }
}
