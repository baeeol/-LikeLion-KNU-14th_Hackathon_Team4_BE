import { Module } from '@nestjs/common';
import { SkinTypeService } from './skin_type.service';
import { SkinTypeController } from './skin_type.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSkinType } from 'src/domain/user_skin_type.entity';
import { User } from 'src/domain/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserSkinType, User])],
  providers: [SkinTypeService],
  controllers: [SkinTypeController],
})
export class SkinTypeModule {}
