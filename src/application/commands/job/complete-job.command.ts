import { JobEntity } from '@domain/entities/job/job.entity'

export interface CompleteJobCommandProps {
  job: JobEntity
}

export class CompleteJobCommand implements CompleteJobCommandProps {
  private constructor(
    readonly job: JobEntity
  ) {}

  public static from(props: CompleteJobCommandProps) {
    return new CompleteJobCommand(
      props.job
    )
  }
}
