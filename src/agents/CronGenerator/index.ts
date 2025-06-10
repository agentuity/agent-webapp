import type {
  AgentContext,
  AgentRequest,
  AgentResponse,
  AgentWelcomeResult,
} from '@agentuity/sdk';
import { groq } from '@ai-sdk/groq';
import { generateText } from 'ai';

export default async function Agent(
  req: AgentRequest,
  resp: AgentResponse,
  ctx: AgentContext
) {
  const prompt = await req.data.text();

  try {
    const result = await generateText({
      model: groq('llama-3.1-8b-instant'),
      system: `You are a helpful assistant that knows how to convert a plain-language description of a schedule into a cron expression. Take the user's description and convert it into a cron expression; only return the cron expression, no other text. If the user's description is not clear, return "ERROR".`,
      prompt,
    });

    if (result.text === 'ERROR') {
      return new Response('Bad Request', { status: 400 });
    }

    return resp.text(result.text);
  } catch (error) {
    ctx.logger.error('Error running agent:', error);

    return new Response('Internal Server Error', { status: 500 });
  }
}
