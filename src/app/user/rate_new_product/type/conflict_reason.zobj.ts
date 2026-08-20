import z from 'zod';

const conflictReasonZObj = z.object({
  conflictMsg: z.string(),
});

export { conflictReasonZObj };
