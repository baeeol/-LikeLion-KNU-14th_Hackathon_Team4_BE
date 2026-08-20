import { Module } from '@nestjs/common';
import { RateNewProductService } from './rate_new_product.service';
import { RateNewProductController } from './rate_new_product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/domain/user.entity';
import { CareProduct } from 'src/domain/care_product';
import { CareRoutineModule } from 'src/app/care_routine/care_routine.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, CareProduct]), CareRoutineModule],
  providers: [RateNewProductService],
  controllers: [RateNewProductController],
})
export class RateNewProductModule {}
