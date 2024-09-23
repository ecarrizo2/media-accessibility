import { JobEntity } from '@domain/entities/job/job.entity'

export interface StartJobCommandProps {
  job: JobEntity
}

export class StartJobCommand implements StartJobCommandProps {
  private constructor(readonly job: JobEntity) {}

  static from(props: StartJobCommandProps) {
    return new StartJobCommand(props.job)
  }
}
