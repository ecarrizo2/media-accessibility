import { CreateImageCommand, CreateImageCommandProps } from '../../src/application/commands/image/create-image-command'

export const createImageCommandExampleProps = {
  url: 'http://localhost:8080',
  prompt: 'Describe this image in 5 words',
  imageAnalysisResult: {
    text: 'A beautiful sunset',
    vendor: 'OpenAI',
    raw: '{"key": "value"}',
  },
}

export const createCreateImageCommandMock = (props?: Partial<CreateImageCommandProps>): CreateImageCommand => {
  return CreateImageCommand.from({
    ...createImageCommandExampleProps,
    ...props,
  })
}
