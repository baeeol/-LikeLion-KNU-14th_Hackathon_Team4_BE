import { CareRoutine } from 'src/app/care_routine/type/care_routine.type';

export type NeededCareProductForTroubleSolution = {
  id: number;
  category: string;
  brand: string;
  name: string;
  price: number;
};

export class GetSolutionResponseDto {
  canSolveNow: boolean;
  data: CareRoutine | NeededCareProductForTroubleSolution;
}
