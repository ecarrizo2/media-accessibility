import { inject, injectable } from 'tsyringe'
import { GetImageByUrlQueryHandler } from '@application/query-handlers/image/get-image-by-url.query-handler'
import { GetImageByUrlQuery } from '@application/queries/image/get-image-by-url.query'
import { AnalyseImageCommand } from '@application/commands/image/analyse-image.command'
import { ProcessImageRequestInput } from '@domain/value-objects/image/process-image-request-input.vo'
import { AnalyseImageCommandHandler } from '@application/command-handlers/image/analyse-image.command-handler'
import { ImageAnalysisResult } from '@domain/value-objects/image/image-analysis-result.vo'
import { CreateImageCommand } from '@application/commands/image/create-image-command'
import { CreateImageCommandHandler } from '@application/command-handlers/image/create-image.command-handler'
import { ImageEntity } from '@domain/entities/image/image.entity'

/**
 * Service responsible for processing images.
 * This service coordinates the execution of commands and queries related to image processing.
 */
@injectable()
export class ImageProcessorService {

  constructor(
    @inject(GetImageByUrlQueryHandler) private readonly getImageByUrlQueryHandler: GetImageByUrlQueryHandler,
    @inject(AnalyseImageCommandHandler) private readonly analyzeImageCommandHandler: AnalyseImageCommandHandler,
    @inject(CreateImageCommandHandler) private readonly createImageCommandHandler: CreateImageCommandHandler,
  ) { }

  /**
   * Processes an image based on the provided input.
   *
   * @param {ProcessImageRequestInput} input - The input data for processing the image.
   * @returns {Promise<ImageEntity>} A promise that resolves with the processed image data.
   */
  async processImage(input: ProcessImageRequestInput): Promise<ImageEntity> {
    const existingProcessedImage = await this.getExistingImage(input)
    const imageAlreadyExists = !!existingProcessedImage
    if (imageAlreadyExists) {
      return existingProcessedImage
    }

    return this.processAndCreateImage(input)
  }

  /**
   * Retrieves an existing processed image based on the input.
   *
   * @param {ProcessImageRequestInput} input - The input data for querying the image.
   * @returns {Promise<ImageEntity | null>} A promise that resolves with the existing processed image data or null if not found.
   */
  private async getExistingImage(input: ProcessImageRequestInput): Promise<ImageEntity | null> {
    const query = GetImageByUrlQuery.from({ url: input.url })

    return this.getImageByUrlQueryHandler.execute(query)
  }

  /**
   * Processes and creates a new image based on the input.
   *
   * @param {ProcessImageRequestInput} input - The input data for processing and creating the image.
   * @returns {Promise<ImageEntity>} A promise that resolves with the newly processed image data.
   */
  private async processAndCreateImage(input: ProcessImageRequestInput): Promise<ImageEntity> {
    const analysedImageData = await this.analyseImage(input)

    return this.storeProcessedImageData(input, analysedImageData)
  }

  /**
   * Analyzes an image based on the input.
   *
   * @param {ProcessImageRequestInput} input - The input data for analyzing the image.
   * @returns {Promise<ImageAnalysisResult>} A promise that resolves with the analyzed image data.
   */
  private async analyseImage(input: ProcessImageRequestInput): Promise<ImageAnalysisResult> {
    const command = AnalyseImageCommand.from({
      url: input.url,
      prompt: input.prompt
    })

    return this.analyzeImageCommandHandler.handle(command)
  }

  /**
   * Stores the processed image data.
   *
   * @param {ProcessImageRequestInput} input - The input data for the image.
   * @param {ImageAnalysisResult} imageAnalysisResult - The result of the image analysis.
   * @returns {Promise<ImageEntity>} A promise that resolves with the stored image data.
   */
  private async storeProcessedImageData(
    input: ProcessImageRequestInput,
    imageAnalysisResult: ImageAnalysisResult
  ): Promise<ImageEntity> {
    const command = CreateImageCommand.from({
      url: input.url,
      prompt: input.prompt,
      imageAnalysisResult
    })

    return this.createImageCommandHandler.handle(command)
  }
}
