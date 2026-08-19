import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CareProductInRoutine,
  CareRoutine,
  DayRoutine,
} from 'src/app/care_routine/type/care_routine.type';
import { CareProduct } from 'src/domain/care_product';
import { User } from 'src/domain/user.entity';
import { UserRoutine } from 'src/domain/user_routine';
import { Repository } from 'typeorm';

@Injectable()
export class UserRoutineService {
  constructor(
    @InjectRepository(UserRoutine)
    private userRoutineRepository: Repository<UserRoutine>,
    @InjectRepository(CareProduct)
    private careProductRepository: Repository<CareProduct>,
  ) {}

  async getRoutine(userId: number): Promise<UserRoutine[]> {
    return await this.userRoutineRepository.find({
      where: { user: { id: userId } },
      relations: { careProduct: true },
    });
  }

  async patchRoutine(user: User, careRoutine: CareRoutine) {
    await this.userRoutineRepository.delete({ user: { id: user.id } });

    await Promise.all(
      careRoutine.routines.map(async (dayRoutine: DayRoutine, weekdayIdx) => {
        await Promise.all(
          dayRoutine.morning.map(
            async (careProductData: CareProductInRoutine, orderIdx) => {
              const careProduct = await this.careProductRepository.findOneBy({
                id: careProductData.id,
              });

              if (careProduct === null) {
                throw new InternalServerErrorException(
                  'Does not exist care product',
                );
              }

              const newCareProductInRoutine = UserRoutine.create(
                user,
                careProduct,
                weekdayIdx,
                0,
                orderIdx,
                careProductData.volume,
              );

              await this.userRoutineRepository.save(newCareProductInRoutine);
            },
          ),
        );
        await Promise.all(
          dayRoutine.evening.map(
            async (careProductData: CareProductInRoutine, orderIdx) => {
              const careProduct = await this.careProductRepository.findOneBy({
                id: careProductData.id,
              });

              if (careProduct === null) {
                throw new InternalServerErrorException(
                  'Does not exist care product',
                );
              }

              const newCareProductInRoutine = UserRoutine.create(
                user,
                careProduct,
                weekdayIdx,
                1,
                orderIdx,
                careProductData.volume,
              );

              await this.userRoutineRepository.save(newCareProductInRoutine);
            },
          ),
        );
      }),
    );
  }
}
