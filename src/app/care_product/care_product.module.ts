import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CareProduct } from 'src/domain/care_product';
import { CareProductService } from './care_product.service';
import { CareProductController } from './care_product.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CareProduct])],
  providers: [CareProductService],
  controllers: [CareProductController],
})
export class CareProductModule {}
