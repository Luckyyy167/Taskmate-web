import { z } from 'zod';

/**
 * Maps Zod v4 issues to our API error detail format.
 * Zod v4 uses `issues` and path entries can be PropertyKey (string | number | symbol).
 */
export function zodToApiDetails(error: z.ZodError): Array<{ field: string; message: string }> {
  return error.issues.map((issue) => ({
    field: issue.path.map(String).join('.'),
    message: issue.message,
  }));
}
