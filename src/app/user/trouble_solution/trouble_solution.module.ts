import { Module } from '@nestjs/common';
import { TroubleSolutionService } from './trouble_solution.service';
import { TroubleSolutionController } from './trouble_solution.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/domain/user.entity';
import { CareRoutineModule } from 'src/app/care_routine/care_routine.module';
import { OwnedProductModule } from '../owned_product/owned_product.module';
import { CareProduct } from 'src/domain/care_product';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, CareProduct]),
    CareRoutineModule,
    OwnedProductModule,
  ],
  providers: [TroubleSolutionService],
  controllers: [TroubleSolutionController],
})
export class TroubleSolutionModule {}
