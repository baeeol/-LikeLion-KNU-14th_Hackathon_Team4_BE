import { Module } from '@nestjs/common';
import { TypeOrmModuleForRoot } from './infra/database/typeorm.module';
import { DataSource } from 'typeorm';
import { RegisterModule } from './app/register/register.module';

@Module({
  imports: [TypeOrmModuleForRoot, RegisterModule],
})
export class AppModule {
  constructor(private dataSoource: DataSource) {}
}
