import z from 'zod';

const recommendCareProductIdForSolutionZObj = z.object({
  careProductId: z.number(),
});

export { recommendCareProductIdForSolutionZObj };
