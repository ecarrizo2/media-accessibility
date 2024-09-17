import { BaseRepository } from '@domain/repositories/base-repository.interface'
import { JobEntity } from '@domain/entities/job.entity'

export interface JobRepository extends BaseRepository<JobEntity> {}
