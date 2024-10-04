import { GetImageByUrlQueryHandler } from './get-image-by-url.query-handler'
import { GetImageByUrlQuery } from '@application/queries/image/get-image-by-url.query'
import { ImageEntity } from '@domain/entities/image/image.entity'
import { plainToInstance } from 'class-transformer'
import { createMock } from '@golevelup/ts-jest'
import { ImageRepository } from '@domain/repositories/image/image-repository.interface'

describe('GetImageByUrlQueryHandler', () => {
  let handler: GetImageByUrlQueryHandler
  const repository = createMock<ImageRepository>()
  const query = plainToInstance(GetImageByUrlQuery, { url: 'http://example.com/image.jpg' })

  beforeEach(() => {
    handler = new GetImageByUrlQueryHandler(repository)
  })

  afterEach(jest.resetAllMocks)

  it('returns image entity when image is found by URL', async () => {
    const imageEntity = new ImageEntity()
    jest.spyOn(repository, 'findByUrl').mockResolvedValue(imageEntity)

    const result = await handler.execute(query)

    expect(repository.findByUrl).toHaveBeenCalledTimes(1)
    expect(repository.findByUrl).toHaveBeenCalledWith(query.url)
    expect(result).toBe(imageEntity)
  })

  it('returns null when image is not found by URL', async () => {
    jest.spyOn(repository, 'findByUrl').mockResolvedValue(null)

    const result = await handler.execute(query)

    expect(repository.findByUrl).toHaveBeenCalledTimes(1)
    expect(repository.findByUrl).toHaveBeenCalledWith(query.url)
    expect(result).toBeNull()
  })

  it('throws error when repository throws an error', async () => {
    jest.spyOn(repository, 'findByUrl').mockRejectedValue(new Error())

    await expect(handler.execute(query)).rejects.toThrow()
    expect(repository.findByUrl).toHaveBeenCalledTimes(1)
    expect(repository.findByUrl).toHaveBeenCalledWith(query.url)
  })
})
