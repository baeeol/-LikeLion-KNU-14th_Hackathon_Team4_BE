import { Module } from '@nestjs/common';
import { CareRoutineService } from './care_routine.service';
import { CareProduct } from 'src/domain/care_product';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([CareProduct])],
  providers: [CareRoutineService],
  exports: [CareRoutineService],
})
export class CareRoutineModule {}
