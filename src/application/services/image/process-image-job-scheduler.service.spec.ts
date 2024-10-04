import { createMock } from '@golevelup/ts-jest'
import { ProcessImageJobSchedulerService } from '@application/services/image/process-image-job-scheduler.service'
import { JobFacadeService } from '@application/services/job/job-facade.service'
import { LoggerService } from '@shared/logger/logger.service'
import { ProcessImageRequestInputDto } from '@domain/value-objects/image/process-image-request-input.vo'
import { createJobEntityMock } from '../../../../test/mocks/job.entity.mock'
import { SQSClientService } from '@infrastructure/services/sqs-client.service'
import { JobType } from '@domain/enums/job/job.enum'
import { JobEntity } from '@domain/entities/job/job.entity'
import { Resource } from 'sst'

describe('ProcessImageJobSchedulerService', () => {
  const jobService = createMock<JobFacadeService>()
  const logger = createMock<LoggerService>()
  const sqsClientService = createMock<SQSClientService>()

  const jobEntity = createJobEntityMock()
  const processImageRequestInput: ProcessImageRequestInputDto = {
    url: 'https://example.com/image.jpg',
    prompt: 'A sample prompt',
  }

  const getInstance = () => {
    return new ProcessImageJobSchedulerService(logger, sqsClientService, jobService)
  }

  describe('WHEN scheduling an image processing job', () => {
    describe('AND the job creation and queueing succeeds (happy path)', () => {
      beforeAll(async () => {
        jest.spyOn(jobService, 'create').mockResolvedValue(jobEntity)
        jest.spyOn(sqsClientService, 'send').mockResolvedValue(void 8)
        await getInstance().scheduleImageProcessingJob(processImageRequestInput)
      })

      afterAll(jest.resetAllMocks)

      it('THEN it should create a new job', () => {
        expect(jobService.create).toHaveBeenCalledTimes(1)
        expect(jobService.create).toHaveBeenCalledWith(JobType.ImageProcessing, processImageRequestInput)
      })

      it('AND it should send the job to the queue', () => {
        expect(sqsClientService.send).toHaveBeenCalledTimes(1)
        expect(sqsClientService.send).toHaveBeenCalledWith(
          'https://sqs.us-east-1.amazonaws.com/123456789012/ProcessImageQueue',
          { jobId: jobEntity.id, input: processImageRequestInput }
        )
      })
    })

    describe('AND the job creation fails', () => {
      const jobCreationError = new Error('Failed to create job')
      let promise: Promise<JobEntity>

      beforeAll(() => {
        jest.spyOn(jobService, 'create').mockRejectedValue(jobCreationError)
        promise = getInstance().scheduleImageProcessingJob(processImageRequestInput)
      })

      afterAll(jest.resetAllMocks)

      it('THEN should have attempted to created the job', async () => {
        await promise.catch(() => {
          expect(jobService.create).toHaveBeenCalledTimes(1)
          expect(jobService.create).toHaveBeenCalledWith(JobType.ImageProcessing, processImageRequestInput)
        })
      })

      it('AND Should throw job creation failure to the caller', async () => {
        await expect(promise).rejects.toThrow(jobCreationError)
      })

      it('AND should not send the job to the queue', async () => {
        await promise.catch(() => {
          expect(sqsClientService.send).not.toHaveBeenCalled()
        })
      })
    })

    describe('AND sending the job to the queue fails', () => {
      const sendJobToQueueError = new Error('Failed to send the job to the queue')
      let promise: Promise<JobEntity>

      beforeAll(() => {
        jest.spyOn(jobService, 'create').mockResolvedValue(jobEntity)
        jest.spyOn(sqsClientService, 'send').mockRejectedValue(sendJobToQueueError)
        promise = getInstance().scheduleImageProcessingJob(processImageRequestInput)
      })

      afterAll(jest.resetAllMocks)

      it('THEN should have attempted to created the job', async () => {
        await promise.catch(() => {
          expect(jobService.create).toHaveBeenCalledTimes(1)
          expect(jobService.create).toHaveBeenCalledWith(JobType.ImageProcessing, processImageRequestInput)
        })
      })

      it('AND should have attempted to send the job to the queue', async () => {
        await promise.catch(() => {
          expect(sqsClientService.send).toHaveBeenCalledTimes(1)
          expect(sqsClientService.send).toHaveBeenCalledWith(Resource.ProcessImageQueue.url, {
            jobId: jobEntity.id,
            input: processImageRequestInput,
          })
        })
      })

      it('AND should have throw send job to the queue error to the caller', async () => {
        await expect(promise).rejects.toThrow(sendJobToQueueError)
      })
    })
  })
})
