import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserSkinType } from 'src/domain/user_skin_type.entity';
import { Repository } from 'typeorm';
import { ModifySkinTypeDto } from './dto/ModifySkinType.dto';
import { User } from 'src/domain/user.entity';

@Injectable()
export class SkinTypeService {
  constructor(
    @InjectRepository(UserSkinType)
    private userSkinTypeRepository: Repository<UserSkinType>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async modifySkinType(userId: number, skinTypeData: ModifySkinTypeDto) {
    try {
      const user = await this.userRepository.findOneBy({ id: userId });

      if (user === null) {
        throw new BadRequestException('Does not exist user');
      }

      let userSkinType = await this.userSkinTypeRepository.findOneBy({
        user: { id: userId },
      });

      if (userSkinType === null) {
        userSkinType = UserSkinType.create(user, skinTypeData.type);
      }

      userSkinType.type = skinTypeData.type;

      await this.userSkinTypeRepository.save(userSkinType);
    } catch (e) {
      if (e instanceof HttpException) {
        throw e;
      } else {
        console.error(e);
        throw new InternalServerErrorException('internal server Error');
      }
    }
  }
}
