import type {
  AgentContext,
  AgentRequest,
  AgentResponse,
  Data,
} from '@agentuity/sdk';
import { groq } from '@ai-sdk/groq';
import { generateObject, streamText } from 'ai';
import { z } from 'zod';

const logTypeOptions = ['DEBUG', 'INFO', 'WARN', 'ERROR'] as const;

const categorizationOptions = [
  'Agentuity',
  'GitHub',
  'Network',
  'SourceCode',
  'Unknown',
] as const;

type LogType = (typeof logTypeOptions)[number];
type Categorization = (typeof categorizationOptions)[number];

const PromptSchema = z.object({
  environment: z
    .object({
      platform: z.string().optional(),
      framework: z.string().optional(),
    })
    .optional(),
  log: z.string(),
  logType: z.enum(logTypeOptions),
});

export default async function Agent(
  req: AgentRequest,
  resp: AgentResponse,
  ctx: AgentContext
) {
  const model = groq('llama-3.1-8b-instant');
  const prompt = PromptSchema.parse(await req.data.json());
  const logType: LogType = prompt.logType;
  let category: Categorization = 'Unknown';
  let agentuityDocs: string | undefined | Data;

  // Non-error query
  if (logType !== 'ERROR') {
    try {
      const result = await streamText({
        model,
        system:
          "You are a helpful assistant that summarizes AI agent session logs. Given the following log and environment details, provide the user a summary of the session log. If the log seems to be the input to or output of an agent, such as a text response, a JSON object, an email message, a user query, etc., then summarize the content of the log. If it seems like a code-related log, then tell the user any relevant information you can find. Be concise and to the point, don't include useless information like metadata or timestamps. If the log is not related to the user's AI agent session, then explain to the user that you can't help them with that. The user cannot provide you further details, so end the conversation.",
        prompt: `
        Environment: ${JSON.stringify(prompt.environment)}
  
        Log: ${prompt.log}
      `,
      });

      return resp.stream(result.textStream);
    } catch (error) {
      ctx.logger.error('Error running agent:', error);

      return new Response('Internal Server Error', { status: 500 });
    }
  }

  // Error query
  try {
    const resultCategorization = await generateObject({
      model,
      system:
        'You are a helpful assistant that knows a lot about software development, specifically AI agents. Given the following log and environment details, determine which part of the software stack the user is experiencing an issue with. If you cannot determine the issue, choose "Unknown".',
      schema: z.object({
        type: z.enum(categorizationOptions),
      }),
      prompt: `
        Environment: ${JSON.stringify(prompt.environment)}

        Log: ${prompt.log}
      `,
    });

    category = resultCategorization.object.type;
  } catch (error) {
    ctx.logger.error('Error running agent:', error);

    return new Response('Internal Server Error', { status: 500 });
  }

  // It's an Agentuity issue
  if (category === 'Agentuity') {
    // Check for existing docs in KV (1 day TTL)
    const docsResult = await ctx.kv.get('agent-webapp', 'agentuity-docs');

    if (docsResult.exists) {
      agentuityDocs = await docsResult.data.text();
    } else {
      // If no docs are found, fetch them from the web
      try {
        const response = await fetch('https://agentuity.dev/llms.txt');

        agentuityDocs = await response.text();

        await ctx.kv.set('agent-webapp', 'agentuity-docs', agentuityDocs, {
          ttl: 60 * 60 * 24,
        });
      } catch (error) {
        ctx.logger.error('Error fetching Agentuity docs:', error);

        return new Response('Internal Server Error', { status: 500 });
      }
    }

    try {
      const result = await streamText({
        model,
        system:
          'You are a helpful assistant that knows a lot about software development for AI agents, and specifically the Agentuity cloud platform. Given the following log and environment details, try to provide the user with a solution to their problem. If a solution is not obvious, suggest ways to debug the issue. At the start of your response, let the user know they can visit the Agentuity Discord server to get help at https://discord.gg/agentuity, then include the rest of your response.',
        prompt: `
        Environment: ${JSON.stringify(prompt.environment)}
  
        Log: ${prompt.log}
  
        Agentuity docs: ${agentuityDocs}
      `,
      });

      return resp.stream(result.textStream);
    } catch (error) {
      ctx.logger.error('Error running agent:', error);

      return new Response('Internal Server Error', { status: 500 });
    }
  }

  // It's something else
  try {
    const result = await streamText({
      model,
      system: `You are a helpful assistant that knows a lot about software development, specifically AI agents. Given the following log and environment details, try to provide the user with a solution to their problem. If a solution is not obvious, suggest ways to debug the issue. If the log is not related to the user's AI agent session, then explain to the user that you can't help them with that. The user cannot provide you further details, so end the conversation.`,
      prompt: `
      Environment: ${JSON.stringify(prompt.environment)}

      Log: ${prompt.log}
    `,
    });

    return resp.stream(result.textStream);
  } catch (error) {
    ctx.logger.error('Error running agent:', error);

    return new Response('Internal Server Error', { status: 500 });
  }
}
