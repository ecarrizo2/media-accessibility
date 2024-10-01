import { Transform } from 'class-transformer'

export function TransformJsonObject(): PropertyDecorator {
  return Transform(
    ({ value }) => {
      if (typeof value === 'string') {
        return JSON.parse(value) as unknown
      }

      return value as unknown
    },
    { toClassOnly: true }
  )
}
