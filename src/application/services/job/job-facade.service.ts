import { inject, injectable } from 'tsyringe'
import { StartJobCommandHandler } from '@application/command-handlers/job/start-job.command-handler'
import { CompleteJobCommandHandler } from '@application/command-handlers/job/complete-job.command.handler'
import { LoggerService } from '@shared/logger/logger.service'
import { StartJobCommand } from '@application/commands/job/start-job.command'
import { CompleteJobCommand } from '@application/commands/job/complete-job.command'
import { RegisterJobErrorCommandHandler } from '@application/command-handlers/job/register-job-error.command-handler'
import { CreateJobCommandHandler } from '@application/command-handlers/job/create-job.command-handler'
import { CreateJobCommand } from '@application/commands/job/create-job.command'
import { JobType } from '@domain/enums/job/job.enum'
import { RegisterJobErrorCommand } from '@application/commands/job/register-job-error.command'
import { Logger } from '@shared/logger/logger.interface'
import { GetJobByIdQueryHandler } from '@application/query-handlers/job/get-job-by-id.query-handler'
import { GetJobByIdQuery } from '@application/queries/job/get-job-by-id.query'
import { JobNotFoundError } from '@domain/errors/job/job-not-found.error'
import { JobEntity } from '@domain/entities/job/job.entity'
import { JobFacade } from '@application/types/job/job-facade.interface'

/**
 * Service responsible for handling job-related operations.
 * This service coordinates the execution of commands related to job lifecycle events.
 */
@injectable()
export class JobFacadeService implements JobFacade {
  constructor(
    @inject(CreateJobCommandHandler) private readonly createJobCommandHandler: CreateJobCommandHandler,
    @inject(StartJobCommandHandler) private readonly startJobCommandHandler: StartJobCommandHandler,
    @inject(CompleteJobCommandHandler) private readonly completeJobHandler: CompleteJobCommandHandler,
    @inject(RegisterJobErrorCommandHandler) private readonly registerJobErrorHandler: RegisterJobErrorCommandHandler,
    @inject(GetJobByIdQueryHandler) private readonly getJobByIdQueryHandler: GetJobByIdQueryHandler,
    @inject(LoggerService) private readonly logger: Logger
  ) {}

  /**
   * Creates a new job by executing the CreateJobCommand.
   *
   * @param {JobType} type - The type of the job to create.
   * @param {unknown} input - The input data for the job.
   * @returns {Promise<JobEntity>} A promise that resolves when the job has been created.
   */
  async create(type: JobType, input: unknown): Promise<JobEntity> {
    const command = CreateJobCommand.from({ type, input })
    this.logger.debug('About to execute Create Job command', command)

    return this.createJobCommandHandler.handle(command)
  }

  /**
   * Starts a job by executing the StartJobCommand.
   *
   * @param {string} jobId - The ID of the job to start.
   * @returns {Promise<void>} A promise that resolves when the job has been started.
   */
  async start(jobId: string): Promise<void> {
    const job = await this.getJob(jobId)
    const command = StartJobCommand.from({ job })
    this.logger.debug('About to execute Start Job command', command)

    return this.startJobCommandHandler.handle(command)
  }

  /**
   * Registers a job failure by executing the RegisterJobErrorCommand.
   *
   * @param {string} jobId - The ID of the job that failed.
   * @param {unknown} error - The error that caused the job to fail.
   * @returns {Promise<void>} A promise that resolves when the job error has been registered.
   */
  async failed(jobId: string, error: unknown): Promise<void> {
    const job = await this.getJob(jobId)
    const command = RegisterJobErrorCommand.from({ job, error })

    return this.registerJobErrorHandler.handle(command)
  }

  /**
   * Completes a job by executing the CompleteJobCommand.
   *
   * @param {string} jobId - The ID of the job to complete.
   * @returns {Promise<void>} A promise that resolves when the job has been completed.
   */
  async complete(jobId: string): Promise<void> {
    const job = await this.getJob(jobId)
    const command = CompleteJobCommand.from({ job })
    this.logger.debug('About to execute Complete Job command', command)

    return this.completeJobHandler.handle(command)
  }

  /**
   * Get a Job Entity by id.
   *
   * @param {string} jobId - The ID of the job entity to fetch.
   * @returns {Promise<JobEntity>} A promise that resolves with the found JobEntity.
   * @throws {JobNotFoundError} - when query results is undefined.
   */
  private async getJob(jobId: string): Promise<JobEntity> {
    const query = GetJobByIdQuery.from({ jobId })
    const job = await this.getJobByIdQueryHandler.execute(query)
    if (!job) {
      throw new JobNotFoundError()
    }

    return job
  }
}
