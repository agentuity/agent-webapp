import type { AgentContext, AgentRequest, AgentResponse } from '@agentuity/sdk';
import { groq } from '@ai-sdk/groq';
import { generateObject } from 'ai';
import { explanationSchema, explanationSystemPrompt } from '../../util';

export default async function RegexExplanation(
  req: AgentRequest,
  resp: AgentResponse,
  ctx: AgentContext
) {
  const regex = await req.data.text();
  const model = groq('llama-3.1-8b-instant');

  try {
    const explanation = await generateObject({
      model,
      system: explanationSystemPrompt,
      prompt: `Explain this regex: ${regex}`,
      temperature: 1,
      schema: explanationSchema,
      maxRetries: 3,
    });

    return resp.json({
      explanation: explanation.object.explanation,
      examples: explanation.object.example,
    });
  } catch (error) {
    ctx.logger.error('Error explaining regex:', error);
    return new Response('Bad Request', { status: 400 });
  }
}
