import type { AgentContext, AgentRequest, AgentResponse } from '@agentuity/sdk';
import { groq } from '@ai-sdk/groq';
import { generateObject } from 'ai';
import {
  explanationSchema,
  explanationSystemPrompt,
  regexSchema,
  regexSystemPrompt,
} from '../../util';

export default async function RegexGenerator(
  req: AgentRequest,
  resp: AgentResponse,
  ctx: AgentContext
) {
  const prompt = await req.data.text();
  const model = groq('llama-3.1-8b-instant');

  try {
    const regex = await generateObject({
      model,
      system: regexSystemPrompt,
      prompt,
      schema: regexSchema,
      maxRetries: 3,
    });

    const explanation = await generateObject({
      model,
      system: explanationSystemPrompt,
      prompt: `Explain this regex: ${regex}`,
      temperature: 1,
      schema: explanationSchema,
      maxRetries: 3,
    });

    return resp.json({
      regex: regex.object.regex,
      explanation: explanation.object.explanation,
      examples: explanation.object.example,
    });
  } catch (error) {
    ctx.logger.error('Error generating regex:', error);
    return new Response('Bad Request', { status: 400 });
  }
}
