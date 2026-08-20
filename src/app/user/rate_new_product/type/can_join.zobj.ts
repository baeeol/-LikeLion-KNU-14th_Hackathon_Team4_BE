import z from 'zod';

const canJoinZObj = z.object({
  canJoinNow: z.boolean(),
});

export { canJoinZObj };
