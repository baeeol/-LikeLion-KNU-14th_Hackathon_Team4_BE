import z from 'zod';

const canSolveZObj = z.object({
  canSolveNow: z.boolean(),
  reason: z.string(),
});

export { canSolveZObj };
