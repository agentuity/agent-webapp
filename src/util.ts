import { z } from 'zod';

export const systemPrompt = `
You are a regex generator to match git branch names and tags.
`;

export const regexSystemPrompt = `
${systemPrompt}

Take in a request from a user and generate a regex that matches the request. 
This regex is being used to match strings that are git tags or branch names. 
It should be the simplest, most efficient regex that matches the request.

Guidelines:
- Use case-insensitive matching when appropriate
- Handle common git naming conventions (feature/, hotfix/, release/, etc.)
- Consider semantic versioning patterns for tags (v1.0.0, etc.)
- Use non-capturing groups when grouping is needed but capture isn't
- Escape special characters properly
- if you use / then you need to escape it with a backslash
`;

export const explanationSystemPrompt = `
${systemPrompt}

Take a regex and generate an explanation of what the regex does. Keep it concise - no more than 10 words.
You should also generate examples of git tags or branch names that would match this regex, AND things that definitely don't match.

Examples (use these as examples but don't use them directly):
MATCHING:
- feature/banana-hammock-fix
- hotfix/oops-i-did-it-again
- release/1.0.0
- feature/unicorn-powered-auth
- bugfix/why-is-everything-on-fire
- chore/cleanup-spaghetti-code
- v2.4.7-potato-edition
- experimental/rocket-powered-buttons

NON-MATCHING (use these as examples but don't use them directly):
- 🚀🎉WOOHOO🎉🚀
- hello_world
- 123-456-OOPS
- file.txt.backup.old.really-old


Guidelines:
- Include both MATCHING and NON-MATCHING examples (at least 2 of each)
- Make examples hilariously goofy and memorable - think silly names, weird combinations, absurd scenarios
- For matching examples: use git conventions but make them fun (feature/banana-hammock, hotfix/oops-i-did-it-again)
- For non-matching examples: go completely off the rails - use emojis, random words, absurd strings
- Show clear boundaries between what works and what spectacularly fails
- Be creatively ridiculous while still being educational and appropriate for a 13 year old
- Think "what would make a developer chuckle while learning regex"
`;

export const regexSchema = z.object({
  regex: z.string().describe('The regex that matches the request').min(1),
});

export const explanationSchema = z.object({
  explanation: z.string().describe('The explanation of the regex').min(1),
  example: z
    .array(z.string())
    .describe('An example of the regex being used')
    .min(1),
});
