import z from 'zod';

const canJoinZObj = z.object({
  canJoinNow: z.boolean(),
  reason: z.string(),
});

export { canJoinZObj };
