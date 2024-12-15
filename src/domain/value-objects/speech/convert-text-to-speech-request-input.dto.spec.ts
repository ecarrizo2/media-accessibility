import { myValidateOrReject } from '@shared/class-validator/validator.helper'
import {
  ConvertTextToSpeechRequestInputDto
} from '@domain/value-objects/speech/convert-text-to-speech-request-input.dto'

jest.mock('@shared/class-validator/validator.helper')

describe('convertTextToSpeechRequestInput', () => {
  const validData = {
    text: 'Test text',
  }

  describe('from', () => {
    it('should create a valid instance from a plain object', async () => {
      ;(myValidateOrReject as jest.Mock).mockResolvedValueOnce(undefined)

      const instance = await ConvertTextToSpeechRequestInputDto.from(validData)

      expect(instance).toBeInstanceOf(ConvertTextToSpeechRequestInputDto)
      expect(myValidateOrReject).toHaveBeenCalledWith(instance)
    })

    it('should throw validation errors for invalid data', async () => {
      ;(myValidateOrReject as jest.Mock).mockRejectedValueOnce(new Error('Validation failed'))
      const invalidData = { ...validData, text: '' }

      await expect(ConvertTextToSpeechRequestInputDto.from(invalidData)).rejects.toThrow('Validation failed')
    })
  })
})
