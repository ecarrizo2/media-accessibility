import { JobEntity } from '@domain/entities/job/job.entity'

export interface RegisterJobErrorCommandProps {
  job: JobEntity
  error: unknown
}

export class RegisterJobErrorCommand implements RegisterJobErrorCommandProps {
  private constructor(
    readonly job: JobEntity,
    readonly error: unknown
  ) {}

  static from(props: RegisterJobErrorCommandProps) {
    return new RegisterJobErrorCommand(props.job, props.error)
  }
}
