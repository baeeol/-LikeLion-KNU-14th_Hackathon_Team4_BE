import { CareProductType } from 'src/types/CareProductType';
import { z } from 'zod';

export type CareProductInRoutine = {
  id: number;
  category: CareProductType;
  name: string;
  volume: number;
};

export type CareProductFromAIOutput = {
  id: number;
  volume: number;
};

export type DayRoutine = {
  morning: CareProductInRoutine[];
  evening: CareProductInRoutine[];
};

export type DayRoutineFromAIOutput = {
  morning: CareProductFromAIOutput[];
  evening: CareProductFromAIOutput[];
};

export type CareRoutine = {
  routines: DayRoutine[];
};

export type CareRoutineFromAIOutput = {
  routines: DayRoutineFromAIOutput[];
};

export type CareProductDataForPrompt = {
  id: number;
  type: CareProductType;
  brand: string;
  name: string;
  keyword: string;
  ingredient: string;
}[];

const WeekdayRoutineZObj = z.object({
  routines: z.array(
    z.object({
      morning: z.array(
        z.object({
          id: z.number(),
          volume: z.number(),
        }),
      ),
      evening: z.array(
        z.object({
          id: z.number(),
          volume: z.number(),
        }),
      ),
    }),
  ),
});
export { WeekdayRoutineZObj };
