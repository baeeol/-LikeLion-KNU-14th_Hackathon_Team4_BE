import { Module } from '@nestjs/common';
import { LoginService } from './login.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/domain/user.entity';
import { LoginController } from './login.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [LoginService],
  controllers: [LoginController],
})
export class LoginModule {}
