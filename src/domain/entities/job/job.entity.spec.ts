import { JobEntity } from './job.entity'
import { JobStatus, JobType } from '@domain/enums/job/job.enum'
import { myValidateOrReject } from '@shared/class-validator/validator.helper'
import { instanceToPlain, plainToInstance } from 'class-transformer'

jest.mock('@shared/class-validator/validator.helper')

describe('JobEntity', () => {
  const validJob = {
    id: '1',
    type: JobType.ImageProcessing,
    status: JobStatus.Pending,
    input: { test: 'data' },
    attempts: 0,
    createdAt: new Date().toISOString(),
  }

  describe('from', () => {
    describe('WHEN created from from valid plain object', () => {
      it('THEN returns a JobEntity instance', async () => {
        ;(myValidateOrReject as jest.Mock).mockResolvedValueOnce(undefined)
        const instance = await JobEntity.from(validJob)

        expect(instance).toBeInstanceOf(JobEntity)
        expect(myValidateOrReject).toHaveBeenCalledWith(instance)
      })
    })

    describe('WHEN created from invalid plain object', () => {
      it('THEN throws validation error', async () => {
        ;(myValidateOrReject as jest.Mock).mockRejectedValueOnce(new Error('Validation failed'))
        const invalidJob = { ...validJob, id: '' }
        await expect(JobEntity.from(invalidJob)).rejects.toThrow()
        expect(myValidateOrReject).toHaveBeenCalledWith(plainToInstance(JobEntity, invalidJob))
      })
    })
  })

  describe('Test Transformer transformations', () => {
    it('should convert the instance to a plain object', async () => {
      const instance = await JobEntity.from(validJob)

      const plain = instanceToPlain(instance)
      expect(plain.input).toEqual(JSON.stringify(instance.input))
    })

    describe('validateState', () => {
      let job: JobEntity
      beforeEach(async () => {
        job = await JobEntity.from(validJob)
      })

      describe('WHEN the instance state is valid', () => {
        it('THEN does nothing and void returned', async () => {
          ;(myValidateOrReject as jest.Mock).mockResolvedValueOnce(undefined)
          await job.validateState()
          expect(myValidateOrReject).toHaveBeenCalledWith(job)
        })
      })

      describe('WHEN the instance state is invalid', () => {
        it('THEN throws validation error', async () => {
          ;(myValidateOrReject as jest.Mock).mockRejectedValueOnce(new Error('Validation failed'))
          await expect(job.validateState()).rejects.toThrow()
          expect(myValidateOrReject).toHaveBeenCalledWith(job)
        })
      })
    })

    describe('JobActions', () => {
      let job: JobEntity
      beforeEach(async () => {
        ;(myValidateOrReject as jest.Mock).mockResolvedValueOnce(undefined)
        job = await JobEntity.from(validJob)
      })

      describe('start', () => {
        it('should start the job', () => {
          job.start()
          expect(job.status).toBe(JobStatus.InProgress)
          expect(job.attempts).toBe(1)
        })
      })

      describe('complete', () => {
        it('should complete the job', () => {
          job.complete()
          expect(job.status).toBe(JobStatus.Completed)
        })
      })

      describe('failed', () => {
        it('should fail the job and register an error', () => {
          const error = new Error('Test error')
          job.failed(error)

          expect(job.status).toBe(JobStatus.Failed)
          expect(job.errors).toHaveLength(1)
          expect(job.errors?.[0].message).toBe('Test error')
        })
      })

      describe('canStart', () => {
        it('WHEN the job is not pending, THEN it can be started because never executed', () => {
          job.status = JobStatus.Pending
          expect(job.canStart()).toBe(true)
        })

        it('WHEN the job is failed, THEN it can be started as a retry for the same operation', () => {
          job.status = JobStatus.Failed
          expect(job.canStart()).toBe(true)
        })

        it('WHEN the job is in progress, THEN it cannot be started again', () => {
          job.status = JobStatus.InProgress
          expect(job.canStart()).toBe(false)
        })

        it('WHEN the job is completed, THEN it cannot be started again', () => {
          job.status = JobStatus.Completed
          expect(job.canStart()).toBe(false)
        })
      })

      describe('isCompleted', () => {
        it('WHEN the job is completed, THEN return true, OTHERWISE false', () => {
          expect(job.isCompleted()).toBe(false)
          job.status = JobStatus.Completed
          expect(job.isCompleted()).toBe(true)
        })
      })
    })
  })
})
