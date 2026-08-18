import { CareProductType } from 'src/types/CareProductType';

type CareProductField = {
  id: number;
  category: CareProductType;
  name: string;
  volume: number;
};

type DayRoutine = {
  morning: CareProductField[];
  evening: CareProductField[];
};

export class GetUserRoutineResponseDto {
  routines: DayRoutine[];
}
