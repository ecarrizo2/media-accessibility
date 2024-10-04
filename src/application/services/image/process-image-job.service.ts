import { inject, injectable } from 'tsyringe'
import { ProcessImageJobRecordData } from '@interfaces/queue/sqs-event.interface'
import { LoggerService } from '@shared/logger/logger.service'
import { JobFacadeService } from '@application/services/job/job-facade.service'
import { ImageProcessorService } from '@application/services/image/image-processor.service'
import { Logger } from '@shared/logger/logger.interface'
import { ImageProcessor } from '@application/services/image/image-processor.interface'
import { JobFacade } from '@application/services/job/job-facade.interface'
import { ProcessImageRequestInputDto } from '@domain/value-objects/image/process-image-request-input.vo'

@injectable()
export class ProcessImageJobService {
  constructor(
    @inject(JobFacadeService) private readonly jobService: JobFacade,
    @inject(ImageProcessorService) private readonly imageProcessorService: ImageProcessor,
    @inject(LoggerService) private readonly logger: Logger
  ) {}

  /**
   * Wraps the execution of handling an image job.
   *
   * @param {ProcessImageJobRecordData} processImageData - Data for the image job to be processed.
   * @returns {Promise<void>} A promise that resolves when the job is processed.
   */
  async performJobProcessing(processImageData: ProcessImageJobRecordData): Promise<void> {
    this.logger.info('Process Image Job Started, processing image', { jobId: processImageData.jobId })
    await this.jobService.start(processImageData.jobId)

    try {
      await this.processImage(processImageData)
    } catch (error) {
      this.logger.error('Process Image Job Failed, registering error', { jobId: processImageData.jobId, error })
      await this.jobService.failed(processImageData.jobId, error)
      throw error
    }

    this.logger.info('Process Image Job Completed, image processed', { jobId: processImageData.jobId })
    await this.jobService.complete(processImageData.jobId)
  }

  /**
   * Processes an image.
   *
   * @param {ProcessImageJobRecordData} processImageData - Data for the image to be processed.
   * @returns {Promise<void>} A promise that resolves when the image is processed.
   */
  private async processImage(processImageData: ProcessImageJobRecordData): Promise<void> {
    const processImageInput = await ProcessImageRequestInputDto.from(processImageData.input)
    this.logger.debug('About to execute process image flow', processImageInput)

    await this.imageProcessorService.processImage(processImageInput)
  }
}
