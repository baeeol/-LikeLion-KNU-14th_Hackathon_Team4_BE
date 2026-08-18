import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import OpenAI from 'openai';
import { zodTextFormat } from 'openai/helpers/zod.mjs';
import {
  CareProductDataForPrompt,
  CareProductFromAIOutput,
  CareProductInRoutine,
  CareRoutine,
  CareRoutineFromAIOutput,
  DayRoutine,
  WeekdayRoutineZObj,
} from './type/care_routine.type';
import { SuggestCareRoutinePrompt } from './constants/suggest_care_routine_prompt.constants';
import { InjectRepository } from '@nestjs/typeorm';
import { CareProduct } from 'src/domain/care_product';
import { Repository } from 'typeorm';
import { CareProductType } from 'src/types/CareProductType';

@Injectable()
export class CareRoutineService {
  constructor(
    @InjectRepository(CareProduct)
    private careProductRepository: Repository<CareProduct>,
  ) {}

  async suggestCareRoutine(
    skinType: '건성' | '지성' | '복합성' | '수부지' | '미정',
    careProductIdList: number[],
    solutionTarget: string,
  ): Promise<CareRoutine> {
    try {
      const careProductDataForPrompt: CareProductDataForPrompt =
        await this.createCareProductDataForPrompt(careProductIdList);

      const userPrompt = `사용자 본인의 피부 타입은 ${skinType}이다.
                          루틴 생성에 사용할 스킨 케어 제품 정보는 {${JSON.stringify(careProductDataForPrompt)}}이다.
                          사용자가 루틴으로 해결하고자 하는 목표는 ${solutionTarget}이다.
                          위의 사실을 바탕으로 사용자의 목표를 달성할 수 있는 최적의 스킨 케어 루틴을 만들어라.
                          이 과정에서 브랜드의 공식 사이트에서 각 제품의 주요 기능과 성분표를 검색하여 루틴 생성에 참고해라.`;

      const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      const apiResponse = await client.responses.parse({
        model: 'gpt-5.6-luna',
        tools: [{ type: 'web_search' }],
        input: [
          {
            role: 'system',
            content: SuggestCareRoutinePrompt.SYSTEM_PROMPT,
          },
          {
            role: 'developer',
            content: SuggestCareRoutinePrompt.DEVELOPER_PROMPT,
          },
          {
            role: 'user',
            content: userPrompt,
          },
        ],
        text: {
          format: zodTextFormat(WeekdayRoutineZObj, 'response'),
        },
      });

      if (apiResponse.output_parsed === null) {
        throw new InternalServerErrorException('');
      }

      return await this.createCareRoutine(apiResponse.output_parsed);
    } catch (e) {
      if (e instanceof HttpException) {
        throw e;
      } else {
        console.error(e);
        throw new InternalServerErrorException('Internal server error');
      }
    }
  }

  // 스킨 케어 제품 id들로 프롬프트에 입력할 제품 데이터를 repository에서 검색 후 생성
  private async createCareProductDataForPrompt(
    careProductIdList: number[],
  ): Promise<CareProductDataForPrompt> {
    try {
      return await Promise.all(
        careProductIdList.map(async (id) => {
          const careProduct = await this.careProductRepository.findOneBy({
            id: id,
          });

          if (careProduct === null) {
            throw new BadRequestException('Does not exist care product');
          }

          return {
            id: careProduct.id,
            type: careProduct.type as CareProductType,
            brand: careProduct.brand,
            name: careProduct.name,
            keyword: careProduct.keyword,
          };
        }),
      );
    } catch (e) {
      if (e instanceof HttpException) {
        throw e;
      } else {
        console.error(e);
        throw new InternalServerErrorException('Internal server error');
      }
    }
  }

  private async createCareRoutine(
    careRoutineFromAIOutput: CareRoutineFromAIOutput,
  ): Promise<CareRoutine> {
    const careRoutine: CareRoutine = { routines: [] };
    careRoutine.routines = await Promise.all(
      careRoutineFromAIOutput.routines.map(
        async (dayRoutineData): Promise<DayRoutine> => {
          const morningRoutine: CareProductInRoutine[] = await Promise.all(
            dayRoutineData.morning.map((v) =>
              this.fetchCareProductInRoutine(v),
            ),
          );
          const eveningRoutine: CareProductInRoutine[] = await Promise.all(
            dayRoutineData.evening.map((v) =>
              this.fetchCareProductInRoutine(v),
            ),
          );

          return { morning: morningRoutine, evening: eveningRoutine };
        },
      ),
    );

    return careRoutine;
  }

  private async fetchCareProductInRoutine(
    careProductData: CareProductFromAIOutput,
  ): Promise<CareProductInRoutine> {
    const careProduct = await this.careProductRepository.findOneBy({
      id: careProductData.id,
    });

    if (careProduct === null) {
      throw new BadRequestException('Does not exist care product');
    }

    return {
      id: careProduct.id,
      category: careProduct.type as CareProductType,
      name: careProduct.name,
      volume: careProductData.volume,
    };
  }
}
