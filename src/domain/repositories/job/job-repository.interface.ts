import { JobEntity } from '@domain/entities/job/job.entity'
import { Repository } from '@domain/repositories/repository.interface'

/**
 * Interface representing a repository for managing Job entities.
 * Extends the BaseRepository interface to provide specific implementations for JobEntity.
 */
export interface JobRepository extends Repository<JobEntity> {
  entityType: JobEntity
}
