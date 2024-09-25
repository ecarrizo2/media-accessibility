/**
 * Enum representing the status of a job.
 */
export enum JobStatus {
  /** The job is pending and has not started yet. */
  Pending = 'pending',

  /** The job is currently in progress. */
  InProgress = 'In-Progress',

  /** The job has been completed successfully. */
  Completed = 'completed',

  /** The job has failed. */
  Failed = 'failed',
}

/**
 * Enum representing the type of job.
 */
export enum JobType {
  /** The job is for processing an image. */
  ImageProcessing = 'process-image',
}
