import { Module } from '@nestjs/common';
import { UserRoutineController } from './user_routine.controller';
import { UserModule } from '../user/user.module';
import { OwnedProductModule } from '../owned_product/owned_product.module';
import { CareRoutineModule } from 'src/app/care_routine/care_routine.module';
import { UserRoutineService } from './user_routine.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CareProduct } from 'src/domain/care_product';
import { User } from 'src/domain/user.entity';
import { UserRoutine } from 'src/domain/user_routine';

@Module({
  imports: [
    UserModule,
    OwnedProductModule,
    CareRoutineModule,
    TypeOrmModule.forFeature([CareProduct, User, UserRoutine]),
  ],
  providers: [UserRoutineService],
  controllers: [UserRoutineController],
})
export class UserRoutineModule {}
