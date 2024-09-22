import { container, inject, injectable } from 'tsyringe'
import { ProcessImageRequestInput } from '@domain/value-objects/image/process-image-request-input.vo'
import { JobEntity } from '@domain/entities/job/job.entity'
import { LoggerService } from '@shared/logger/logger.service'
import { JobType } from '@domain/enums/job/job.enum'
import { SendMessageCommand, SQSClient } from '@aws-sdk/client-sqs'
import { JobFacadeService } from '@application/services/job/job-facade.service'
import { Logger } from '@shared/logger/logger.interface'
import { Resource } from 'sst'

const processImageQueueUrl = Resource.ProcessImageQueue.url
const sqs = new SQSClient({})

/**
 * Service to handle image processing requests.
 */
@injectable()
export class ProcessImageRequestHandlerService {
  constructor(
    @inject(LoggerService) private readonly logger: Logger,
    @inject(JobFacadeService) private readonly jobService: JobFacadeService
  ) {}

  /**
   * Schedules a new image processing job.
   *
   * @param {ProcessImageRequestInput} processImageRequestInput - The input for the image processing job.
   * @returns {Promise<JobEntity>} - The created job.
   */
  async scheduleImageProcessingJob(processImageRequestInput: ProcessImageRequestInput): Promise<JobEntity> {
    const job = await this.createJob(processImageRequestInput)

    await this.sendJobToQueue(job, processImageRequestInput)

    return job
  }

  /**
   * Creates a new image processing job.
   *
   * @param {ProcessImageRequestInput} processImageRequestInput - The input for the image processing job.
   * @returns {Promise<JobEntity>} - The created job.
   */
  private async createJob(processImageRequestInput: ProcessImageRequestInput): Promise<JobEntity> {
    this.logger.info('Creating a new job for the image processing request')

    const job = await this.jobService.create(JobType.ImageProcessing, processImageRequestInput)

    this.logger.debug('Job has been created', job)

    return job
  }

  /**
   * Sends the created job to the SQS queue.
   *
   * @param {JobEntity} job - The job to be scheduled in the queue.
   * @param {ProcessImageRequestInput} processImageRequestInput - The input for the image processing job.
   * @returns {Promise<void>}
   */
  private async sendJobToQueue(job: JobEntity, processImageRequestInput: ProcessImageRequestInput): Promise<void> {
    const logger = container.resolve(LoggerService)
    logger.info('Sending Job processing request to the queue')

    await sqs.send(
      new SendMessageCommand({
        QueueUrl: processImageQueueUrl,
        MessageBody: JSON.stringify({
          traceId: logger.getTraceId(),
          jobId: job.id,
          input: {
            url: processImageRequestInput.url,
            prompt: processImageRequestInput.prompt,
            createSpeech: processImageRequestInput.createSpeech,
          },
        }),
      })
    )
  }
}
