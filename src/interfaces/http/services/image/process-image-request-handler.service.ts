import { container, inject, injectable } from 'tsyringe'
import { ProcessImageRequestInput } from '@domain/value-objects/image/process-image-request-input.vo'
import { JobEntity } from '@domain/entities/job/job.entity'
import { LoggerService } from '@shared/logger.service'
import { CreateJobCommandHandler } from '@application/command-handlers/job/create-job.command-handler'
import { CreateJobCommand } from '@application/commands/job/create-job.command'
import { JobType } from '@domain/enums/job/job.enum'
import { SendMessageCommand, SQSClient } from '@aws-sdk/client-sqs'

//@ts-ignore
const processImageQueueUrl = Resource.ProcessImageQueue.url
const sqs = new SQSClient({})

@injectable()
export class ProcessImageRequestHandlerService {
  constructor(
    @inject(LoggerService) private readonly logger: LoggerService,
    @inject(CreateJobCommandHandler) private readonly createJobHandler: CreateJobCommandHandler,
  ) {
  }

  async scheduleImageProcessingJob(processImageRequestInput: ProcessImageRequestInput): Promise<JobEntity> {
    const job = await this.createJob(processImageRequestInput)

    await this.sendJobToQueue(job, processImageRequestInput)

    return job
  }

  /**
   * Creates a new image processing job.
   *
   * @param {ProcessImageRequestInput} processImageRequestInput - The input for the image processing job.
   * @returns {Promise<any>} - The created job.
   */
  private async createJob(processImageRequestInput: ProcessImageRequestInput): Promise<JobEntity> {
    this.logger.info('Creating a new job for the image processing request')

    const command: CreateJobCommand<ProcessImageRequestInput> = {
      type: JobType.ImageProcessing,
      input: processImageRequestInput,
    }

    const job = await this.createJobHandler.handle(command)
    this.logger.debug('Job has been created', job)

    return job
  }


  /**
   * Creates a new image processing job.
   *
   * @param {JobEntity} job - Job which will be scheduled in the queue
   * @param {ProcessImageRequestInput} processImageRequestInput - The input for the image processing job.
   * @returns {Promise<void>}
   */
  private async sendJobToQueue(
    job: JobEntity,
    processImageRequestInput: ProcessImageRequestInput,
  ): Promise<void> {
    const logger = container.resolve(LoggerService)
    logger.info('Sending Job processing request to the queue')

    await sqs.send(
      new SendMessageCommand({
        QueueUrl: processImageQueueUrl,
        MessageBody: JSON.stringify({
          traceId: logger.getTraceId(),
          jobId: job.id,
          command: {
            url: processImageRequestInput.url,
            prompt: processImageRequestInput.prompt,
            createSpeech: processImageRequestInput.createSpeech,
          },
        }),
      }),
    )
  }
}
