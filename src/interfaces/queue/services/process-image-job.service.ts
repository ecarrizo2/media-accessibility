import { inject, injectable } from 'tsyringe'
import { ProcessImageJobRecordData } from '@interfaces/queue/sqs-event.interface'
import { LoggerService } from '@shared/logger.service'
import { ProcessImageCommand } from '@application/commands/image/process-image.command'
import { ProcessImageCommandHandler } from '@application/command-handlers/image/process-image.command-handler'
import { JobService } from '@application/services/job/job.service'

@injectable()
export class ProcessImageJobService {
  constructor(
    @inject(JobService) private readonly jobService: JobService,
    @inject(ProcessImageCommandHandler) private readonly processImageCommandHandler: ProcessImageCommandHandler,
    @inject(LoggerService) private readonly logger: LoggerService
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
    const command = ProcessImageCommand.from(processImageData.command)
    this.logger.debug('About to execute process image command', command)

    await this.processImageCommandHandler.handle(command)
  }
}
