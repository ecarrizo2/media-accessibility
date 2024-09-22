import { JobType } from '@domain/enums/job/job.enum'

export interface CreateJobCommandProps {
  type: JobType
  input: unknown
}

export class CreateJobCommand implements CreateJobCommandProps {
  private constructor(
    readonly type: JobType,
    readonly input: unknown
  ) {}

  public static from(props: CreateJobCommandProps) {
    return new CreateJobCommand(
      props.type,
      props.input
    )
  }
}
