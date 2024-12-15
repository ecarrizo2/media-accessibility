export interface Speech {
  id: string
  text: string
  speechUrl: string
  createdAt: string
  updatedAt: string
}

export interface VoiceParameters {
  voice?: 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer'
  model?: 'ts-1'
}
