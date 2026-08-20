import { Module } from '@nestjs/common';
import { TypeOrmModuleForRoot } from './infra/database/typeorm.module';
import { DataSource } from 'typeorm';
import { RegisterModule } from './app/register/register.module';
import { LoginModule } from './app/login/login.module';
import { SkinTypeModule } from './app/user/skin_type/skin_type.module';
import { CareProductModule } from './app/care_product/care_product.module';
import { OwnedProductModule } from './app/user/owned_product/owned_product.module';
import { UserModule } from './app/user/user/user.module';
import { UserRoutineModule } from './app/user/routine/user_routine.module';
import { TroubleSolutionModule } from './app/user/trouble_solution/trouble_solution.module';
import { RateNewProductModule } from './app/user/rate_new_product/rate_new_product.module';

@Module({
  imports: [
    TypeOrmModuleForRoot,
    RegisterModule,
    LoginModule,
    UserModule,
    SkinTypeModule,
    CareProductModule,
    OwnedProductModule,
    UserRoutineModule,
    TroubleSolutionModule,
    RateNewProductModule,
  ],
})
export class AppModule {
  constructor(private dataSoource: DataSource) {}
}
