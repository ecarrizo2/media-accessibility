import { BaseRepository } from '@domain/repositories/base-repository.interface'
import { JobEntity } from '@domain/entities/job/job.entity'

/**
 * Interface representing a repository for managing Job entities.
 * Extends the BaseRepository interface to provide specific implementations for JobEntity.
 */
export interface JobRepository extends BaseRepository<JobEntity> {
  name: ''
}
