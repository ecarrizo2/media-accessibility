import { JobEntity } from '@domain/entities/job/job.entity'
import { Repository } from '@domain/repositories/repository.interface'

export interface JobRepository extends Repository<JobEntity> {
  entityType: JobEntity
}
