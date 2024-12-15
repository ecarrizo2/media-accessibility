import { Image, ImageEntity } from './image.entity'
import { validate } from 'class-validator'
import { myValidateOrReject } from '@shared/class-validator/validator.helper'
import { instanceToPlain } from 'class-transformer'

jest.mock('@shared/class-validator/validator.helper')

describe('ImageEntity', () => {
  const validImage = {
    id: '123',
    url: 'https://example.com/image.jpg',
    prompt: 'Test prompt',
    analysisText: 'Analysis result text',
    analysisVendor: 'Test vendor',
    analysisResultRaw: '{ "data": "test"}',
    createdAt: '2023-11-30T12:00:00Z',
    updatedAt: '2023-12-01T12:00:00Z',
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('from', () => {
    it('should create a valid instance from a plain object', async () => {
      ;(myValidateOrReject as jest.Mock).mockResolvedValueOnce(undefined)

      const instance = await ImageEntity.from(validImage)

      expect(instance).toBeInstanceOf(ImageEntity)
      expect(instance).toMatchObject({
        ...validImage,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        analysisResultRaw: JSON.parse(validImage.analysisResultRaw),
      })
      expect(myValidateOrReject).toHaveBeenCalledWith(instance)
    })

    it('should throw validation errors for invalid data', async () => {
      const invalidImage = { ...validImage, url: 'invalid-url' }

      ;(myValidateOrReject as jest.Mock).mockRejectedValueOnce(new Error('Validation failed'))

      await expect(ImageEntity.from(invalidImage)).rejects.toThrow('Validation failed')
    })
  })

  describe('validateState', () => {
    it('should validate the current instance state', async () => {
      ;(myValidateOrReject as jest.Mock).mockResolvedValueOnce(undefined)

      const instance = await ImageEntity.from(validImage)
      await instance.validateState()

      expect(myValidateOrReject).toHaveBeenCalledWith(instance)
    })
  })

  describe('property transformations', () => {
    it('should transform analysisResultRaw to JSON string and back', async () => {
      const instance = await ImageEntity.from(validImage)
      expect(instance.analysisResultRaw).toEqual(JSON.parse(validImage.analysisResultRaw))

      const plainObject = instanceToPlain(instance) as Image
      expect(plainObject.analysisResultRaw).toBe(JSON.stringify(JSON.parse(validImage.analysisResultRaw)))
    })
  })

  describe('validation rules', () => {
    it('should validate all required fields', async () => {
      const instance = await ImageEntity.from(validImage)
      const errors = await validate(instance)

      expect(errors).toHaveLength(0)
    })

    it('should fail validation for missing fields', async () => {
      const instance = new ImageEntity()
      const errors = await validate(instance)

      expect(errors).not.toHaveLength(0)
      expect(errors.map((e) => e.property)).toEqual(
        expect.arrayContaining(['id', 'url', 'prompt', 'analysisText', 'analysisVendor', 'createdAt', 'updatedAt'])
      )
    })
  })
})
