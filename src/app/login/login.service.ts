import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { LoginRequestDto } from './dto/login.request.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/domain/user.entity';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';

@Injectable()
export class LoginService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async login(loginData: LoginRequestDto): Promise<string> {
    try {
      const user = await this.userRepository.findOneBy({
        nickname: loginData.nickname,
      });

      // 동일 닉네임 유저 존재 여부 검사
      if (user === null) {
        throw new BadRequestException('Wrong nickname or password');
      }

      // 페스워드 일치 여부 검사
      const hashedPassword = user.password;
      const requestedPasswordCombineSalt = loginData.password + user.salt;
      const isCorrectPassword = await argon2.verify(
        hashedPassword,
        requestedPasswordCombineSalt,
      );
      if (!isCorrectPassword) {
        throw new BadRequestException('Wrong nickname or password');
      }

      // JWT 발행
      if (process.env.JWT_SECRET === undefined) {
        throw new InternalServerErrorException('Internal server error');
      }

      const token: string = jwt.sign(
        {
          nickname: user.nickname,
          age: user.age,
        },
        process.env.JWT_SECRET,
      );

      return token;
    } catch (e) {
      if (e instanceof HttpException) {
        throw e;
      } else {
        console.error(e);
        throw new InternalServerErrorException('Internal server error');
      }
    }
  }
}
