import { inject, injectable } from 'tsyringe'
import { JobEntity } from '@domain/entities/job/job.entity'
import { LoggerService } from '@shared/logger/logger.service'
import { JobType } from '@domain/enums/job/job.enum'
import { JobFacadeService } from '@application/services/job/job-facade.service'
import { Logger } from '@shared/logger/logger.interface'
import { Resource } from 'sst'
import { ProcessImageRequestInputDto } from '@domain/value-objects/image/process-image-request-input.vo'
import { SQSClientService } from '@infrastructure/services/sqs-client.service'

/**
 * Service to handle image processing requests.
 */
@injectable()
export class ProcessImageJobSchedulerService {
  constructor(
    @inject(LoggerService) private readonly logger: Logger,
    @inject(SQSClientService) private readonly sqs: SQSClientService,
    @inject(JobFacadeService) private readonly jobService: JobFacadeService
  ) {}

  async scheduleImageProcessingJob(processImageRequestInput: ProcessImageRequestInputDto): Promise<JobEntity> {
    const job = await this.createJob(processImageRequestInput)

    await this.sendJobToQueue(job, processImageRequestInput)

    return job
  }

  private async createJob(processImageRequestInput: ProcessImageRequestInputDto): Promise<JobEntity> {
    this.logger.info('Creating a new job for the image processing request')

    const job = await this.jobService.create(JobType.ImageProcessing, processImageRequestInput)

    this.logger.debug('Job has been created', job)

    return job
  }

  private async sendJobToQueue(job: JobEntity, processImageRequestInput: ProcessImageRequestInputDto): Promise<void> {
    this.logger.info('Sending Job processing request to the queue')

    await this.sqs.send(Resource.ProcessImageQueue.url, {
      jobId: job.id,
      input: processImageRequestInput,
    })
  }
}
