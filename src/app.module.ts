import { Module } from '@nestjs/common';
import { TypeOrmModuleForRoot } from './infra/database/typeorm.module';
import { DataSource } from 'typeorm';

@Module({
  imports: [TypeOrmModuleForRoot],
})
export class AppModule {
  constructor(private dataSoource: DataSource) {}
}
