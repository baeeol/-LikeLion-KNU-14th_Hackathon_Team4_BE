import { Module } from '@nestjs/common';
import { OwnedProductService } from './owned_product.service';
import { OwnedProductController } from './owned_product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/domain/user.entity';
import { CareProduct } from 'src/domain/care_product';

@Module({
  imports: [TypeOrmModule.forFeature([User, CareProduct])],
  providers: [OwnedProductService],
  controllers: [OwnedProductController],
  exports: [OwnedProductService],
})
export class OwnedProductModule {}
