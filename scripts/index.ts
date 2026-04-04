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

  // Get final result with usage stats
  const finalResult = await result

  console.log('\n\n--- Token Usage ---')
  console.log('Prompt tokens:', finalResult.usage?.promptTokens)
  console.log('Completion tokens:', finalResult.usage?.completionTokens)
  console.log('Total tokens:', finalResult.usage?.totalTokens)
}

main().catch(console.error)
