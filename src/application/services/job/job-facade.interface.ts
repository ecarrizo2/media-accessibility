import { JobType } from '@domain/enums/job/job.enum'
import { JobEntity } from '@domain/entities/job/job.entity'

/**
 * Interface representing a facade for managing jobs.
 */
export interface JobFacade {

  /**
   * Creates a new job.
   *
   * @param {JobType} type - The type of the job.
   * @param {unknown} input - The input data for the job.
   * @returns {Promise<JobEntity>} - A promise that resolves to the created JobEntity.
   */
  create(type: JobType, input: unknown): Promise<JobEntity>

  /**
   * Starts a job.
   *
   * @param {string} jobId - The unique identifier of the job.
   * @returns {Promise<void>} - A promise that resolves when the job is started.
   */
  start(jobId: string): Promise<void>

  /**
   * Marks a job as failed.
   *
   * @param {string} jobId - The unique identifier of the job.
   * @param {unknown} error - The error that caused the job to fail.
   * @returns {Promise<void>} - A promise that resolves when the job is marked as failed.
   */
  failed(jobId: string, error: unknown): Promise<void>

  /**
   * Completes a job.
   *
   * @param {string} jobId - The unique identifier of the job.
   * @returns {Promise<void>} - A promise that resolves when the job is completed.
   */
  complete(jobId: string): Promise<void>
}
