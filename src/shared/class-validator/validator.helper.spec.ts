import { IsNotEmpty, IsString } from 'class-validator'
import { plainToInstance } from 'class-transformer'
import { myValidateOrReject } from '@shared/class-validator/validator.helper'
import { ClassValidatorError } from '@shared/errors/class-validator.error'

class DTOTest {
  @IsString()
  @IsNotEmpty()
  name!: string
}

describe('myValidateOrReject', () => {
  describe('WHEN validation succeeds', () => {
    it('THEN it does not throw an error', async () => {
      const instance = plainToInstance(DTOTest, { name: 'test' })
      await myValidateOrReject(instance)

      expect(true).toBe(true)
    })
  })

  describe('WHEN validation fails', () => {
    it('THEN it does throw a ClassValidatorError', async () => {
      const instance = plainToInstance(DTOTest, { name: '' })
      await expect(myValidateOrReject(instance)).rejects.toThrow(ClassValidatorError)
    })
  })
})
