import { TransformJsonObject } from './transformation.helper'
import { plainToInstance } from 'class-transformer'

describe('TransformJsonObject', () => {
  it('parses JSON string to object', () => {
    class TestClass {
      @TransformJsonObject()
      data: any
    }

    const instance = plainToInstance(TestClass, { data: '{"key": "value"}' })
    expect(instance.data).toEqual({ key: 'value' })
  })

  it('returns object as is if value is already an object', () => {
    class TestClass {
      @TransformJsonObject()
      data: any
    }

    const instance = plainToInstance(TestClass, { data: { key: 'value' } })
    expect(instance.data).toEqual({ key: 'value' })
  })

  it('throws error if JSON string is invalid', () => {
    class TestClass {
      @TransformJsonObject()
      data: any
    }

    expect(() => plainToInstance(TestClass, { data: '{"key": "value"' })).toThrow(SyntaxError)
  })

  it('returns null if value is null', () => {
    class TestClass {
      @TransformJsonObject()
      data: any
    }

    const instance = plainToInstance(TestClass, { data: null })
    expect(instance.data).toBeNull()
  })

  it('returns undefined if value is undefined', () => {
    class TestClass {
      @TransformJsonObject()
      data: any
    }

    const instance = plainToInstance(TestClass, { data: undefined })
    expect(instance.data).toBeUndefined()
  })
})
