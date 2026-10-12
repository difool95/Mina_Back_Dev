import Anthropic from '@anthropic-ai/sdk'

import { env } from '../../config/env.js'
import { MMA_PROMPT_CACHE } from '../../lib/constants.js'
import type { ClaudeProvider, ClaudeUsage } from '../../types/mma/mma.types.js'

export const anthropic = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY })

/**
 * Asks Claude for an MMA step, and returns its answer with what the step
 * stores beside the request: how it was routed and cached, and its usage.
 * `knowledgeFiles` names the guides the system prompt carries.
 */
export async function askClaude(request: Anthropic.MessageCreateParamsNonStreaming, knowledgeFiles: string[]) {
  const message = await anthropic.messages.create(request)
  const { usage } = message
  const cacheRead = usage.cache_read_input_tokens ?? 0
  const cacheCreation = usage.cache_creation_input_tokens ?? 0

  return {
    message,
    routing: {
      prompt_cache: {
        ...MMA_PROMPT_CACHE,
        knowledge_files: knowledgeFiles,
        status: cacheRead ? 'read' : 'write',
        cache_read_input_tokens: cacheRead,
        cache_creation_input_tokens: cacheCreation,
      },
      executed_model: message.model,
      routing_status: message.model === request.model ? 'matched' : 'mismatched',
    },
    usage: {
      model: message.model,
      stop_reason: message.stop_reason,
      input_tokens: usage.input_tokens,
      output_tokens: usage.output_tokens,
      cache_read_input_tokens: cacheRead,
      cache_creation_input_tokens: cacheCreation,
    } satisfies ClaudeUsage,
    provider: { name: 'anthropic', stop_reason: message.stop_reason } satisfies ClaudeProvider,
  }
}
