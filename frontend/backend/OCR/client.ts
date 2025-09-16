import * as genai from '@google/generative-ai'

export function createGeminiClient(apiKey: string) {
  return new genai.GoogleGenerativeAI(apiKey)
}
