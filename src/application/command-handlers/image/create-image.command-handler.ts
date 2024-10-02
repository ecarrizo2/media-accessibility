import { inject, injectable } from 'tsyringe'
import { DynamodbImageRepository } from '@infrastructure/repositories/image/dynamodb-image.repository'
import { ImageRepository } from '@domain/repositories/image/image-repository.interface'
import { Image, ImageEntity } from '@domain/entities/image/image.entity'
import { v4 } from 'uuid'
import { CreateImageCommand } from '@application/commands/image/create-image-command'
import { LoggerService } from '@shared/logger/logger.service'
import { Logger } from '@shared/logger/logger.interface'

@injectable()
export class CreateImageCommandHandler {
  constructor(
    @inject(DynamodbImageRepository) private readonly imageRepository: ImageRepository,
    @inject(LoggerService) private readonly logger: Logger
  ) {}

  async handle(command: CreateImageCommand): Promise<ImageEntity> {
    this.logger.debug('Handling CreateImageCommand.', command)

    const imageData: Image = {
      id: v4(),
      url: command.url,
      prompt: command.prompt,
      analysisText: command.imageAnalysisResult.text,
      analysisVendor: command.imageAnalysisResult.vendor,
      analysisResultRaw: command.imageAnalysisResult.raw,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    const image = await this.createImageEntityInstance(imageData)
    await this.imageRepository.save(image)

    this.logger.info('Image entity saved successfully.')

    return image
  }

  private async createImageEntityInstance(imageData: Image) {
    try {
      this.logger.debug('Creating new Image from plain', imageData)
      return await ImageEntity.from(imageData)
    } catch (error) {
      this.logger.error('Image initialization failed.', error)
      throw error
    }
  }
}
