import { CareRoutine } from 'src/app/care_routine/type/care_routine.type';

export class PatchUserRoutineRequestDto {
  routines?: CareRoutine['routines'];
}
