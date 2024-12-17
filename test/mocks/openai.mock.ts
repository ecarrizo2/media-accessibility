import { ChatCompletion } from 'openai/src/resources/chat/completions'

export const openaiImageAnalysisResultMock = {
  id: 'chatcmpl-9zR3OMLnxfFCYj7Rrhg0LESVxTTXO',
  object: 'chat.completion',
  created: 1724429030,
  model: 'gpt-4o-mini-2024-07-18',
  choices: [
    {
      index: 0,
      message: {
        role: 'assistant',
        content:
          "The image showcases the vibrant Googleplex, the headquarters of Google, set against a bright blue sky. In the foreground, a large, cheerful green Android mascot stands prominently on a decorative base, symbolizing Google's popular mobile operating system. Behind the mascot is the Google logo, displayed in its iconic multicolored letters—blue, red, yellow, and green—spanning the glass façade of the building. Surrounding the area are lush plants and flowers, adding a touch of nature, while bicycles are lined up in the background, hinting at a bike-friendly environment. This lively scene reflects Google’s innovative spirit and commitment to creating an inviting workspace.",
        refusal: null,
      },
      logprobs: null,
      finish_reason: 'stop',
    },
  ],
  usage: {
    prompt_tokens: 36878,
    completion_tokens: 130,
    total_tokens: 37008,
  },
  system_fingerprint: 'fp_507c9469a1',
} as ChatCompletion
