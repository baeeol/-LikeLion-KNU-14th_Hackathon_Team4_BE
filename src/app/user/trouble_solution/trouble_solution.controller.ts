import {
  BadRequestException,
  Controller,
  Get,
  InternalServerErrorException,
  Param,
  Query,
} from '@nestjs/common';
import { TroubleSolutionService } from './trouble_solution.service';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/domain/user.entity';
import { Repository } from 'typeorm';
import { CareProductDataForPrompt } from 'src/app/care_routine/type/care_routine.type';
import { CareProductType } from 'src/types/CareProductType';
import { CareRoutineService } from 'src/app/care_routine/care_routine.service';
import { GetSolutionResponseDto } from './dto/get_solution.response.dto';
import { OwnedProductService } from '../owned_product/owned_product.service';
import { CareProduct } from 'src/domain/care_product';

@Controller('/user/:userId/trouble_solution')
export class TroubleSolutionController {
  constructor(
    private troubleSolutionService: TroubleSolutionService,
    @InjectRepository(User) private userRepository: Repository<User>,
    private careRoutineService: CareRoutineService,
    @InjectRepository(CareProduct)
    private careProductRepository: Repository<CareProduct>,
    private ownedProductService: OwnedProductService,
  ) {}

  @Get()
  async getSolution(
    @Param('userId') userId: number,
    @Query('trouble') trouble: string,
  ): Promise<GetSolutionResponseDto> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: { ownedProducts: true, skinType: true },
    });

    if (user === null) {
      throw new BadRequestException('Does not exist user');
    }

    const careProductDataForPrompt: CareProductDataForPrompt =
      user.ownedProducts.map((ownedProduct) => {
        return {
          id: ownedProduct.id,
          type: ownedProduct.type as CareProductType,
          brand: ownedProduct.brand,
          name: ownedProduct.name,
          keyword: ownedProduct.keyword,
        };
      });

    const getSolutionResponseDto = new GetSolutionResponseDto();

    getSolutionResponseDto.canSolveNow =
      await this.troubleSolutionService.decideCanSolveNow(
        ['건성', '지성', '복합성', '수부지', '미정'][user.skinType.type],
        trouble,
        careProductDataForPrompt,
      );

    if (getSolutionResponseDto.canSolveNow) {
      const careProductIdList = user.ownedProducts.map((careProduct) => {
        return careProduct.id;
      });

      const routineTarget = `다음을 만족하며 '${trouble}'이란 피부 고민을 해결할 수 있는 최적화된 스킨 케어 루틴.
                              1. 나의 피부 타입에 적합.
                              2. 스킨 케어 성분이 과하게 중복되지 않고, 부족하지 않음.
                              3. 스킨 케어 제품의 주요 효과를 극대화.
                              루틴에서 가장 중요한 것은 앞의 피부 고민을 해결할 수 있는 것.`;

      getSolutionResponseDto.data =
        await this.careRoutineService.suggestCareRoutine(
          ['건성', '지성', '복합성', '수부지', '미정'][user.skinType.type],
          careProductIdList,
          routineTarget,
        );
    } else {
      const allCareProduct = await this.careProductRepository.find();
      const careProductList: CareProductDataForPrompt = allCareProduct.map(
        (careProduct) => {
          return {
            id: careProduct.id,
            type: careProduct.type as CareProductType,
            brand: careProduct.brand,
            name: careProduct.name,
            keyword: careProduct.keyword,
          };
        },
      );

      const { careProductId } =
        await this.troubleSolutionService.recommendCareProductForSolution(
          ['건성', '지성', '복합성', '수부지', '미정'][user.skinType.type],
          trouble,
          careProductDataForPrompt,
          careProductList,
        );

      const recommendedCareProduct = await this.careProductRepository.findOneBy(
        {
          id: careProductId,
        },
      );

      if (recommendedCareProduct === null) {
        throw new InternalServerErrorException(
          'Does not exist recommended care product',
        );
      }

      getSolutionResponseDto.data = {
        id: recommendedCareProduct.id,
        category: recommendedCareProduct.type,
        brand: recommendedCareProduct.brand,
        name: recommendedCareProduct.name,
        price: recommendedCareProduct.price,
      };
    }

    return getSolutionResponseDto;
  }
}
