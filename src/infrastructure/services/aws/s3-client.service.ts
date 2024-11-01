import { injectable } from 'tsyringe'
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'

@injectable()
export class S3ClientService {
  protected client = new S3Client({})

  async send(command: PutObjectCommand): Promise<void> {
    await this.client.send(command)
  }
}
