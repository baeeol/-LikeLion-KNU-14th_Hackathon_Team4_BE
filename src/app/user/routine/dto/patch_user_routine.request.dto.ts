import { CareRoutine } from 'src/app/care_routine/type/care_routine.type';
import { IsArray, IsOptional } from 'class-validator';

export class PatchUserRoutineRequestDto {
  @IsOptional()
  @IsArray()
  routines?: CareRoutine['routines'];
}
