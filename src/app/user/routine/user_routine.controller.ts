import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
} from '@nestjs/common';
import { CareRoutineService } from 'src/app/care_routine/care_routine.service';
import { OwnedProductService } from '../owned_product/owned_product.service';
import { GetUserRoutineResponseDto } from './dto/get_user_routine.response.dto';
import { UserRoutineService } from './user_routine.service';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/domain/user.entity';
import { Repository } from 'typeorm';
import { UserRoutine } from 'src/domain/user_routine';
import {
  CareProductInRoutine,
} from 'src/app/care_routine/type/care_routine.type';
import { CareProductType } from 'src/types/CareProductType';
import { PatchUserRoutineRequestDto } from './dto/patch_user_routine.request.dto';

@Controller('/user/:userId/routine')
export class UserRoutineController {
  constructor(
    private ownedProductService: OwnedProductService,
    private careRoutineService: CareRoutineService,
    private userRoutineService: UserRoutineService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  @Get()
  async get(
    @Param('userId') userId: number,
  ): Promise<GetUserRoutineResponseDto> {
    const userRoutines: UserRoutine[] =
      await this.userRoutineService.getRoutine(userId);

    const response = new GetUserRoutineResponseDto();
    response.routines = [];
    userRoutines.forEach((userRoutine) => {
      if (response.routines[userRoutine.weekday] === undefined) {
        response.routines[userRoutine.weekday] = { morning: [], evening: [] };
      }

      const routineData: CareProductInRoutine = {
        id: userRoutine.careProduct.id,
        category: userRoutine.careProduct.type as CareProductType,
        name: userRoutine.careProduct.name,
        volume: userRoutine.volume,
      };

      if (userRoutine.time === 0) {
        response.routines[userRoutine.weekday].morning[userRoutine.order] =
          routineData;
      } else {
        response.routines[userRoutine.weekday].evening[userRoutine.order] =
          routineData;
      }
    });

    return response;
  }

  @Patch()
  async patch(
    @Param('userId') userId: number,
    @Body() body?: PatchUserRoutineRequestDto,
  ): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: { skinType: true },
    });

    if (user === null) {
      throw new BadRequestException('Does not exist user');
    }

    // 트러블 상담 등에서 AI가 이미 만든 조정 루틴을 사용자가 적용한 경우
    // 새로 생성하지 않고 전달받은 루틴을 그대로 저장합니다.
    const routines = body?.routines;
    if (Array.isArray(routines)) {
      await this.userRoutineService.patchRoutine(user, { routines });
      return;
    }

    const ownedCareProduct = await this.ownedProductService.findAll(userId);
    const careProductIdList = ownedCareProduct.products.map((careProduct) => {
      return careProduct.id;
    });

    const solutionTarget =
      '나의 피부타입에 적합하며 성분이 과하게 중복되지 않고, 부족하지 않아 스킨 케어 제품의 주요 기능의 효과를 최대화하는 최적화된 피부 루틴의 추천.';

    const suggestCareRoutine = await this.careRoutineService.suggestCareRoutine(
      ['건성', '지성', '복합성', '수부지', '미정'][user.skinType.type],
      careProductIdList,
      solutionTarget,
    );

    await this.userRoutineService.patchRoutine(user, suggestCareRoutine);

    return;
  }
}
