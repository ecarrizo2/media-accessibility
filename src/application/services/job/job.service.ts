import { inject, injectable } from 'tsyringe'
import { StartJobCommandHandler } from '@application/command-handlers/job/start-job.command-handler'
import { CompleteJobCommandHandler } from '@application/command-handlers/job/complete-job.command.handler'
import { LoggerService } from '@shared/logger.service'
import { StartJobCommand } from '@application/commands/job/start-job.command'
import { CompleteJobCommand } from '@application/commands/job/complete-job.command'
import { RegisterJobErrorCommandHandler } from '@application/command-handlers/job/register-job-error.command-handler'

/**
 * Service responsible for handling job-related operations.
 * This service coordinates the execution of commands related to job lifecycle events.
 */
@injectable()
export class JobService {
  constructor(
    @inject(StartJobCommandHandler) private readonly startJobCommandHandler: StartJobCommandHandler,
    @inject(CompleteJobCommandHandler) private readonly completeJobHandler: CompleteJobCommandHandler,
    @inject(RegisterJobErrorCommandHandler) private readonly registerJobErrorHandler: RegisterJobErrorCommandHandler,
    @inject(LoggerService) private readonly logger: LoggerService
  ) {}

  /**
   * Starts a job by executing the StartJobCommand.
   *
   * @param {string} jobId - The ID of the job to start.
   * @returns {Promise<void>} A promise that resolves when the job has been started.
   */
  async start(jobId: string): Promise<void> {
    const command: StartJobCommand = { jobId }
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
    return this.registerJobErrorHandler.handle({ jobId, error })
  }

  /**
   * Completes a job by executing the CompleteJobCommand.
   *
   * @param {string} jobId - The ID of the job to complete.
   * @returns {Promise<void>} A promise that resolves when the job has been completed.
   */
  async complete(jobId: string): Promise<void> {
    const command: CompleteJobCommand = { jobId }
    this.logger.debug('About to execute Complete Job command', command)
    return this.completeJobHandler.handle(command)
  }
}
