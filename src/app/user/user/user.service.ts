/* eslint-disable @typescript-eslint/no-unsafe-enum-comparison */
import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/domain/user.entity';
import { Repository } from 'typeorm';
import { GetUserByIdResponseDto } from './dto/get_user_by_id.response.dto';
import { SkinType } from 'src/types/SkinType';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async findById(userId: number): Promise<GetUserByIdResponseDto> {
    try {
      const user = await this.userRepository.findOne({
        where: { id: userId },
        relations: { skinType: true },
      });

      if (user === null) {
        throw new BadRequestException('Does not exist user');
      }

      const response = new GetUserByIdResponseDto();
      response.user = {
        id: -1,
        nickname: '',
        age: -1,
        skinType: { type: '미정' },
      };
      response.user.id = user.id;
      response.user.nickname = user.nickname;
      response.user.age = user.age;
      if (user.skinType.type === SkinType.DRY)
        response.user.skinType = { type: '건성' };
      else if (user.skinType.type === SkinType.OILY)
        response.user.skinType = { type: '지성' };
      else if (user.skinType.type === SkinType.COMBINATION)
        response.user.skinType = { type: '복합성' };
      else if (user.skinType.type === SkinType.DEHYDRATED_OILY)
        response.user.skinType = { type: '수부지' };
      else response.user.skinType = { type: '미정' };

      return response;
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
