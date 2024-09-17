import { JobStatus, JobType } from '@domain/enums/job.enum'

export interface JobProps {
  id: string
  type: JobType
  status: JobStatus
  input: unknown
  attempts: number
  errors: string[] | null
  createdAt: string
  updatedAt?: string
}

export class JobEntity implements JobProps {
  id: string
  type: JobType
  status: JobStatus
  attempts: number
  input: unknown
  errors: string[] | null
  createdAt: string
  updatedAt?: string

  constructor(props: JobProps) {
    this.id = props.id
    this.type = props.type
    this.status = props.status
    this.input = props.input
    this.attempts = props.attempts
    this.errors = props.errors
    this.createdAt = props.createdAt
    this.updatedAt = props.updatedAt
  }
}
