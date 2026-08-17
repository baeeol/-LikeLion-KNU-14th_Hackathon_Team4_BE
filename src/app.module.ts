import { Module } from '@nestjs/common';
import { TypeOrmModuleForRoot } from './infra/database/typeorm.module';
import { DataSource } from 'typeorm';
import { RegisterModule } from './app/register/register.module';
import { LoginModule } from './app/login/login.module';
import { SkinTypeModule } from './app/skin/type/skin_type.module';
import { CareProductModule } from './app/care_product/care_product.module';

@Module({
  imports: [
    TypeOrmModuleForRoot,
    RegisterModule,
    LoginModule,
    SkinTypeModule,
    CareProductModule,
  ],
})
export class AppModule {
  constructor(private dataSoource: DataSource) {}
}
