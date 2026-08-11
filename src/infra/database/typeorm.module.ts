import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: 'likelion_14th_hackathon.db',
      autoLoadEntities: true,
      synchronize: true,
    }),
  ],
})
export class TypeOrmModuleForRoot {}
