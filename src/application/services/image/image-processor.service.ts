import { inject, injectable } from 'tsyringe'
import { GetImageByUrlQueryHandler } from '@application/query-handlers/image/get-image-by-url.query-handler'
import { GetImageByUrlQuery } from '@application/queries/image/get-image-by-url.query'
import { AnalyseImageCommand } from '@application/commands/image/analyse-image.command'
import { AnalyseImageCommandHandler } from '@application/command-handlers/image/analyse-image.command-handler'
import { ImageAnalysisResult } from '@domain/value-objects/image/image-analysis-result.vo'
import { CreateImageCommand } from '@application/commands/image/create-image-command'
import { CreateImageCommandHandler } from '@application/command-handlers/image/create-image.command-handler'
import { ImageEntity } from '@domain/entities/image/image.entity'
import { ImageProcessor } from '@application/types/image/image-processor.interface'
import { ProcessImageRequestInputDto } from '@domain/value-objects/image/process-image-request-input.vo'

/**
 * Service responsible for processing images.
 * This service coordinates the execution of commands and queries related to image processing.
 */
@injectable()
export class ImageProcessorService implements ImageProcessor {
  constructor(
    @inject(GetImageByUrlQueryHandler) private readonly getImageByUrlQueryHandler: GetImageByUrlQueryHandler,
    @inject(AnalyseImageCommandHandler) private readonly analyzeImageCommandHandler: AnalyseImageCommandHandler,
    @inject(CreateImageCommandHandler) private readonly createImageCommandHandler: CreateImageCommandHandler
  ) {}

  async processImage(input: ProcessImageRequestInputDto): Promise<ImageEntity> {
    const existingProcessedImage = await this.getExistingImage(input)
    const imageAlreadyExists = !!existingProcessedImage
    if (imageAlreadyExists) {
      return existingProcessedImage
    }

    return this.processAndCreateImage(input)
  }

  private async getExistingImage(input: ProcessImageRequestInputDto): Promise<ImageEntity | null> {
    const query = GetImageByUrlQuery.from({ url: input.url })

    return this.getImageByUrlQueryHandler.execute(query)
  }

  private async processAndCreateImage(input: ProcessImageRequestInputDto): Promise<ImageEntity> {
    const analysedImageData = await this.analyseImage(input)

    return this.storeProcessedImageData(input, analysedImageData)
  }

  private async analyseImage(input: ProcessImageRequestInputDto): Promise<ImageAnalysisResult> {
    const command = await AnalyseImageCommand.from({
      url: input.url,
      prompt: input.prompt,
    })

    return this.analyzeImageCommandHandler.handle(command)
  }

  private async storeProcessedImageData(
    input: ProcessImageRequestInputDto,
    imageAnalysisResult: ImageAnalysisResult
  ): Promise<ImageEntity> {
    const command = await CreateImageCommand.from({
      url: input.url,
      prompt: input.prompt,
      imageAnalysisResult,
    })

    return this.createImageCommandHandler.handle(command)
  }
}
