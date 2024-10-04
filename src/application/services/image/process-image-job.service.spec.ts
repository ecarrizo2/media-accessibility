import { createMock } from '@golevelup/ts-jest'
import { ProcessImageJobService } from '@application/services/image/process-image-job.service'
import { JobFacadeService } from '@application/services/job/job-facade.service'
import { ImageProcessorService } from '@application/services/image/image-processor.service'
import { LoggerService } from '@shared/logger/logger.service'
import { ProcessImageJobRecordData } from '@interfaces/queue/sqs-event.interface'
import { ProcessImageRequestInputDto } from '@domain/value-objects/image/process-image-request-input.vo'

describe('ProcessImageJobService', () => {
  let service: ProcessImageJobService
  const jobService = createMock<JobFacadeService>()
  const imageProcessorService = createMock<ImageProcessorService>()
  const logger = createMock<LoggerService>()

  const processImageData: ProcessImageJobRecordData = {
    jobId: 'job-id',
    input: { url: 'https://example.com/image.jpg', prompt: 'A sample prompt' },
  }

  describe('WHEN performing process image job processing', () => {
    describe('AND the job processing succeeds (happy path)', () => {
      let processImageInputDto: ProcessImageRequestInputDto
      beforeAll(async () => {
        processImageInputDto = await ProcessImageRequestInputDto.from(processImageData.input)
        service = new ProcessImageJobService(jobService, imageProcessorService, logger)
        await service.performJobProcessing(processImageData)
      })

      afterAll(jest.resetAllMocks)

      it('THEN it should mark the the job as started', () => {
        expect(jobService.start).toHaveBeenCalledTimes(1)
        expect(jobService.start).toHaveBeenCalledWith(processImageData.jobId)
      })

      it('AND it should process the image', async () => {
        expect(imageProcessorService.processImage).toHaveBeenCalledTimes(1)
        expect(imageProcessorService.processImage).toHaveBeenCalledWith(processImageInputDto)
      })

      it('AND it should mark the job as completed', () => {
        expect(jobService.complete).toHaveBeenCalledTimes(1)
        expect(jobService.complete).toHaveBeenCalledWith(processImageData.jobId)
      })

      it('AND should not have attempted to register a job error', () => {
        expect(jobService.failed).not.toHaveBeenCalled()
      })
    })

    describe('AND Starting the job fails', () => {
      let promise: Promise<void>
      const jobErrorFailedError = new Error('Failed to start job')

      beforeAll(async () => {
        jest.spyOn(jobService, 'start').mockRejectedValue(jobErrorFailedError)
        service = new ProcessImageJobService(jobService, imageProcessorService, logger)
        promise = service.performJobProcessing(processImageData)
      })

      afterAll(jest.resetAllMocks)

      it('THEN should have attempted to start the job', async () => {
        await promise.catch(() => {
          expect(jobService.start).toHaveBeenCalledTimes(1)
          expect(jobService.start).toHaveBeenCalledWith(processImageData.jobId)
        })
      })

      it('AND should have thrown an error to the caller', async () => {
        await expect(promise).rejects.toThrow(jobErrorFailedError)
      })

      it('AND no extra actions were executed', async () => {
        await promise.catch((error: unknown) => {
          expect(imageProcessorService.processImage).not.toHaveBeenCalled()
          expect(jobService.complete).not.toHaveBeenCalled()
        })
      })
    })

    describe('AND Image Processing fails', () => {
      let promise: Promise<void>
      let processImageInputDto: ProcessImageRequestInputDto
      const imageProcessError = new Error('Image Processing Failed')

      beforeAll(async () => {
        processImageInputDto = await ProcessImageRequestInputDto.from(processImageData.input)
        jest.spyOn(imageProcessorService, 'processImage').mockRejectedValue(imageProcessError)
        service = new ProcessImageJobService(jobService, imageProcessorService, logger)
        promise = service.performJobProcessing(processImageData)
      })

      afterAll(jest.resetAllMocks)

      it('THEN should have started the job', async () => {
        await promise.catch(() => {
          expect(jobService.start).toHaveBeenCalledTimes(1)
          expect(jobService.start).toHaveBeenCalledWith(processImageData.jobId)
        })
      })

      it('AND should have attempted to process the image', async () => {
        await promise.catch(() => {
          expect(imageProcessorService.processImage).toHaveBeenCalledTimes(1)
          expect(imageProcessorService.processImage).toHaveBeenCalledWith(processImageInputDto)
        })
      })

      it('AND should register job as failed', async () => {
        await promise.catch(() => {
          expect(jobService.failed).toHaveBeenCalledTimes(1)
          expect(jobService.failed).toHaveBeenCalledWith(processImageData.jobId, imageProcessError)
        })
      })

      it('AND should have thrown an error to the caller', async () => {
        await expect(promise).rejects.toThrow(imageProcessError)
      })

      it('AND there was no attempts to complete the job', async () => {
        await promise.catch(() => {
          expect(jobService.complete).not.toHaveBeenCalled()
          expect(jobService.complete).not.toHaveBeenCalled()
        })
      })
    })

    describe('AND marking Job as completed fails', () => {
      let promise: Promise<void>
      let processImageInputDto: ProcessImageRequestInputDto
      const completeJobError = new Error('Unable to complete Job')

      beforeAll(async () => {
        processImageInputDto = await ProcessImageRequestInputDto.from(processImageData.input)
        jest.spyOn(jobService, 'complete').mockRejectedValue(completeJobError)
        service = new ProcessImageJobService(jobService, imageProcessorService, logger)
        promise = service.performJobProcessing(processImageData)
      })

      afterAll(jest.resetAllMocks)

      it('THEN should have started the job', async () => {
        await promise.catch(() => {
          expect(jobService.start).toHaveBeenCalledTimes(1)
          expect(jobService.start).toHaveBeenCalledWith(processImageData.jobId)
        })
      })

      it('AND should have processed the image', async () => {
        await promise.catch(() => {
          expect(imageProcessorService.processImage).toHaveBeenCalledTimes(1)
          expect(imageProcessorService.processImage).toHaveBeenCalledWith(processImageInputDto)
        })
      })

      it('AND should not have attempted to registered failure', async () => {
        await promise.catch(() => {
          expect(jobService.failed).not.toHaveBeenCalled()
        })
      })

      it('AND should have attempted to complete the Job', async () => {
        await promise.catch(() => {
          expect(jobService.complete).toHaveBeenCalledTimes(1)
          expect(jobService.complete).toHaveBeenCalledWith(processImageData.jobId)
        })
      })

      it('AND should have thrown an error to the caller', async () => {
        await expect(promise).rejects.toThrow(completeJobError)
      })
    })
  })
})
