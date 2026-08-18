import { Controller, Get, Param } from '@nestjs/common';
import { CareRoutineService } from 'src/app/care_routine/care_routine.service';
import { OwnedProductService } from '../owned_product/owned_product.service';
import { UserService } from '../user/user.service';
import { GetUserRoutineResponseDto } from './dto/get_user_routine.response.dto';

@Controller('/user/:userId/routine')
export class UserRoutineController {
  constructor(
    private userService: UserService,
    private ownedProductService: OwnedProductService,
    private careRoutineService: CareRoutineService,
  ) {}

  @Get()
  async get(
    @Param('userId') userId: number,
  ): Promise<GetUserRoutineResponseDto> {
    const { user } = await this.userService.findById(userId);

    const ownedCareProduct = await this.ownedProductService.findAll(userId);
    const careProductIdList = ownedCareProduct.products.map((careProduct) => {
      return careProduct.id;
    });

    const solutionTarget =
      '나의 피부타입에 적합하며 성분이 과하게 중복되지 않고, 부족하지 않아 스킨 케어 제품의 주요 기능의 효과를 최대화하는 최적화된 피부 루틴의 추천.';

    const suggestedRoutine = await this.careRoutineService.suggestCareRoutine(
      user.skinType.type,
      careProductIdList,
      solutionTarget,
    );

    const response = new GetUserRoutineResponseDto();
    response.routines = suggestedRoutine.routines;

    return response;
  }
}
