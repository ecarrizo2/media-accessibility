import { BaseException } from '@shared/base.exception'

export class JobNotFoundException extends BaseException {
  nonReprocessable = true

  constructor() {
    super('The job for the provided query was not found')
  }
}
