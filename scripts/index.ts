import 'dotenv/config'
import { streamText } from 'ai'

async function main() {
  console.log('Starting AI Gateway text generation...\n')

  const result = streamText({
    model: 'openai/gpt-5.4',
    prompt: 'Write a haiku about programming.',
  })

  // Stream the text response
  for await (const textPart of result.textStream) {
    process.stdout.write(textPart)
  }

  // Get usage stats (must await after stream completes)
  const usage = await result.usage

  console.log('\n\n--- Token Usage ---')
  console.log('Prompt tokens:', usage.promptTokens)
  console.log('Completion tokens:', usage.completionTokens)
  console.log('Total tokens:', (usage.promptTokens ?? 0) + (usage.completionTokens ?? 0))
}

main().catch(console.error)
