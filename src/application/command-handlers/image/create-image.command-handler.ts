import { inject, injectable } from 'tsyringe'
import { DynamodbImageRepository } from '@infrastructure/repositories/image/dynamodb-image.repository'
import { ImageRepository } from '@domain/repositories/image/image-repository.interface'
import { ImageEntity } from '@domain/entities/image/image.entity'
import { v4 } from 'uuid'
import { CreateImageCommand } from '@application/commands/image/create-image-command'

@injectable()
export class CreateImageCommandHandler {
  constructor(
    @inject(DynamodbImageRepository) private readonly imageRepository: ImageRepository,
  ) {
  }

  /**
   * Handles the creation of an image.
   *
   * @param {CreateImageCommand} command - Command containing the image creation instructions.
   * @returns {Promise<ImageEntity>} - The created image entity.
   */
  async handle(command: CreateImageCommand): Promise<ImageEntity> {
    const newImage = new ImageEntity({
      id: v4(),
      url: command.url,
      prompt: command.prompt,
      analysisText: command.imageAnalysisResult.text,
      analysisVendor: command.imageAnalysisResult.vendor,
      analysisResultRaw: command.imageAnalysisResult.raw,
      createdAt: new Date().toISOString(),
    })

    await this.imageRepository.save(newImage)

    return newImage
  }
}
