import z from 'zod';

const canSolveZObj = z.object({
  canSolveNow: z.boolean(),
});

export { canSolveZObj };
