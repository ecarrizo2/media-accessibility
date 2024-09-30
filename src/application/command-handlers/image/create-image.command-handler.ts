import { inject, injectable } from 'tsyringe'
import { DynamodbImageRepository } from '@infrastructure/repositories/image/dynamodb-image.repository'
import { ImageRepository } from '@domain/repositories/image/image-repository.interface'
import { Image, ImageEntity } from '@domain/entities/image/image.entity'
import { v4 } from 'uuid'
import { CreateImageCommand } from '@application/commands/image/create-image-command'
import { LoggerService } from '@shared/logger/logger.service'
import { Logger } from '@shared/logger/logger.interface'
import { plainToInstance } from 'class-transformer'

@injectable()
export class CreateImageCommandHandler {
  constructor(
    @inject(DynamodbImageRepository) private readonly imageRepository: ImageRepository,
    @inject(LoggerService) private readonly logger: Logger
  ) {}

  /**
   * Handles the creation of an image.
   *
   * @param {CreateImageCommand} command - Command containing the image creation instructions.
   * @returns {Promise<ImageEntity>} - The created image entity.
   */
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

    const image = plainToInstance(ImageEntity, imageData)

    try {
      this.logger.debug('Validating image entity initialization.', image)
      await image.validateState()
      this.logger.info('Image entity validation succeeded.')
    } catch (error) {
      this.logger.error('CreateImageCommand Failed, Image initialization validation failed.', error)
      throw error
    }

    await this.imageRepository.save(image)
    this.logger.info('Image entity saved successfully.')

    return image
  }
}
