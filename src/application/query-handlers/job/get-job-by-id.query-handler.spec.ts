import { GetJobByIdQueryHandler } from './get-job-by-id.query-handler'
import { GetJobByIdQuery } from '@application/queries/job/get-job-by-id.query'
import { JobEntity } from '@domain/entities/job/job.entity'
import { createMock } from '@golevelup/ts-jest'
import { JobRepository } from '@domain/repositories/job/job-repository.interface'
import { mockedUuid } from '../../../../jest.setup'

describe('GetJobByIdQueryHandler', () => {
  let handler: GetJobByIdQueryHandler
  const repository = createMock<JobRepository>()

  const getQuery = async () => {
    return GetJobByIdQuery.from({ jobId: mockedUuid })
  }

  beforeEach(() => {
    handler = new GetJobByIdQueryHandler(repository)
  })

  afterEach(jest.resetAllMocks)

  it('returns job entity when job is found by ID', async () => {
    const query = await getQuery()
    const jobEntity = new JobEntity()
    jest.spyOn(repository, 'findById').mockResolvedValue(jobEntity)

    const result = await handler.execute(query)

    expect(repository.findById).toHaveBeenCalledTimes(1)
    expect(repository.findById).toHaveBeenCalledWith(query.jobId)
    expect(result).toBe(jobEntity)
  })

  it('returns null when job is not found by ID', async () => {
    const query = await getQuery()
    jest.spyOn(repository, 'findById').mockResolvedValue(null)

    const result = await handler.execute(query)

    expect(repository.findById).toHaveBeenCalledTimes(1)
    expect(repository.findById).toHaveBeenCalledWith(query.jobId)
    expect(result).toBeNull()
  })

  it('throws error when repository throws an error', async () => {
    const query = await getQuery()
    jest.spyOn(repository, 'findById').mockRejectedValue(new Error())

    await expect(handler.execute(query)).rejects.toThrow()
    expect(repository.findById).toHaveBeenCalledTimes(1)
    expect(repository.findById).toHaveBeenCalledWith(query.jobId)
  })
})
