import { JobType } from '@domain/enums/job.enum'

export interface CreateJobCommand<InputType> {
  type: JobType
  input: InputType
}
