import { ImageAnalysisResult, ImageAnalysisResultProps } from '@domain/value-objects/image/image-analysis-result.vo'

export const createImageAnalysisResultMock = async (
  imageAnalysisResultProps?: Partial<ImageAnalysisResultProps>
): Promise<ImageAnalysisResult> => {
  const props = {
    text: 'This image contains a blue sky with white clouds',
    vendor: 'OpenAI',
    raw: '{"id":"chatcmpl-9zR3OMLnxfFCYj7Rrhg0LESVxTTXO","object":"chat.completion","created":1724429030,"model":"gpt-4o-mini-2024-07-18","choices":[{"index":0,"message":{"role":"assistant","content":"This image contains a blue sky with white clouds.","refusal":null},"logprobs":null,"finish_reason":"stop"}],"usage":{"prompt_tokens":36878,"completion_tokens":130,"total_tokens":37008},"system_fingerprint":"fp_507c9469a1"}',
    ...imageAnalysisResultProps,
  }

  return await ImageAnalysisResult.from(props)
}
