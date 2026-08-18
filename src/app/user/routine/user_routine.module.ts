import { Module } from '@nestjs/common';
import { UserRoutineController } from './user_routine.controller';
import { UserModule } from '../user/user.module';
import { OwnedProductModule } from '../owned_product/owned_product.module';
import { CareRoutineModule } from 'src/app/care_routine/care_routine.module';

@Module({
  imports: [UserModule, OwnedProductModule, CareRoutineModule],
  controllers: [UserRoutineController],
})
export class UserRoutineModule {}
