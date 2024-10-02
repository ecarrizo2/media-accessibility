import { plainToInstance } from 'class-transformer'
import { JobEntity, JobProps } from '@domain/entities/job/job.entity'
import { JobStatus, JobType } from '@domain/enums/job/job.enum'

export const createJobEntityMock = (params?: Partial<JobProps>): JobEntity => {
  return plainToInstance(
    JobEntity,
    {
      id: '123',
      type: JobType.ImageProcessing,
      status: JobStatus.Pending,
      input: {},
      attempts: 0,
      errors: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...params,
    },
    { excludeExtraneousValues: true }
  )
}
