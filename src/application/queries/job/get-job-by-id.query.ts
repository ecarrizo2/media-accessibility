export interface GetJobByIdQueryProps {
  jobId: string
}

export class GetJobByIdQuery {
  private constructor(
    readonly jobId: string
  ) {}

  public static from(props: GetJobByIdQueryProps) {
    return new GetJobByIdQuery(
      props.jobId
    )
  }
}
