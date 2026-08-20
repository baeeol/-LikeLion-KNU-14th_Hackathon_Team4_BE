import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
} from '@nestjs/common';
import { GetRateNewProductReportResponseDto } from './dto/get_rate_new_product_report.response.dto';
import { RateNewProductService } from './rate_new_product.service';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/domain/user.entity';
import { Repository } from 'typeorm';
import { CareProduct } from 'src/domain/care_product';
import { CareProductType } from 'src/types/CareProductType';
import { CareRoutineService } from 'src/app/care_routine/care_routine.service';
import { CareProductDataForPrompt } from 'src/app/care_routine/type/care_routine.type';

@Controller('/user/:userId/question_new_product')
export class RateNewProductController {
  constructor(
    private rateNewProductService: RateNewProductService,
    @InjectRepository(User) private userRepository: Repository<User>,
    private careRoutineService: CareRoutineService,
    @InjectRepository(CareProduct)
    private careProductRepository: Repository<CareProduct>,
  ) {}

  @Get()
  async getReport(
    @Param('userId') userId: number,
    @Query('productId') newProductId: number,
  ): Promise<GetRateNewProductReportResponseDto> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: { skinType: true, ownedProducts: true },
    });

    if (user === null) {
      throw new BadRequestException('Does not exist user');
    }

    const newProduct = await this.careProductRepository.findOneBy({
      id: newProductId,
    });

    if (newProduct === null) {
      throw new BadRequestException('Does not exist new product');
    }

    const newProductForPrompt: CareProductDataForPrompt = [
      {
        id: newProduct.id,
        type: newProduct.type as CareProductType,
        brand: newProduct.brand,
        name: newProduct.name,
        keyword: newProduct.keyword,
        ingredient: newProduct.ingredient,
      },
    ];

    const ownedProductForPrompt: CareProductDataForPrompt =
      user.ownedProducts.map((ownedProduct) => {
        return {
          id: ownedProduct.id,
          type: ownedProduct.type as CareProductType,
          brand: ownedProduct.brand,
          name: ownedProduct.name,
          keyword: ownedProduct.keyword,
          ingredient: ownedProduct.ingredient,
        };
      });

    const response = new GetRateNewProductReportResponseDto();

    response.canJoinNow = await this.rateNewProductService.decideCanJoinNow(
      ['건조', '지성', '복합성', '수부지'][user.skinType.type],
      newProductForPrompt,
      ownedProductForPrompt,
    );

    if (response.canJoinNow) {
      const careProductIdList = user.ownedProducts.map((careProduct) => {
        return careProduct.id;
      });
      careProductIdList.push(newProductId);

      const routineTarget = `다음을 만족하는 최적화된 스킨 케어 루틴.
                              1. 나의 피부 타입에 적합.
                              2. 스킨 케어 성분이 과하게 중복되지 않고, 부족하지 않음.
                              3. 스킨 케어 제품의 주요 효과를 극대화.`;

      response.data = await this.careRoutineService.suggestCareRoutine(
        ['건성', '지성', '복합성', '수부지', '미정'][user.skinType.type],
        careProductIdList,
        routineTarget,
      );
    } else {
      const conflictMsg = await this.rateNewProductService.getConflictReason(
        ['건성', '지성', '복합성', '수부지', '미정'][user.skinType.type],
        newProductForPrompt,
        ownedProductForPrompt,
      );

      response.data = {
        conflictMsg: conflictMsg,
        conflictProduct: {
          id: newProduct.id,
          category: newProduct.type,
          brand: newProduct.brand,
          name: newProduct.name,
        },
      };
    }

    return response;
  }
}
