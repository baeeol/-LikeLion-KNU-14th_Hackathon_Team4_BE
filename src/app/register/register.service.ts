import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/domain/user.entity';
import { randomBytes } from 'crypto';
import argon2 from 'argon2';

@Injectable()
export class RegisterService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async register(registerData: RegisterDto): Promise<void> {
    try {
      const nickname: string = registerData.nickname;
      const age: number = registerData.age;
      const password: string = registerData.password;

      const sameNicknameUser = await this.userRepository.findOneBy({
        nickname: nickname,
      });

      if (sameNicknameUser !== null) {
        throw new BadRequestException('Duplicate nickname');
      }

      const salt: string = randomBytes(16).toString('hex');
      const digest: string = await argon2.hash(password + salt);

      const user = User.create(nickname, age, digest, salt);
      await this.userRepository.save(user);

      return;
    } catch (e) {
      console.error(e);

      if (e instanceof HttpException) {
        throw e;
      } else {
        throw new InternalServerErrorException('Internal server error');
      }
    }
  }
}
