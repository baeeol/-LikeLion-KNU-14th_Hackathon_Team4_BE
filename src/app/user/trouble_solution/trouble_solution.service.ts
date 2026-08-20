import {
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import OpenAI from 'openai';
import { SolveTroublePrompt } from './constants/solve_trouble_prompt.constant';
import { canSolveZObj } from './type/can_solve.zobj';
import { zodTextFormat } from 'openai/helpers/zod.mjs';
import { CareProductDataForPrompt } from 'src/app/care_routine/type/care_routine.type';
import { recommendCareProductIdForSolutionZObj } from './type/recommended_care_product_for_solution.zobj';
import { RecommendCareProductPrompt } from './constants/recommend_care_product_prompt.constant';

@Injectable()
export class TroubleSolutionService {
  constructor() {}

  async decideCanSolveNow(
    skinType: string,
    trouble: string,
    careProductDataForPrompt: CareProductDataForPrompt,
  ): Promise<{ canSolveNow: boolean; reason: string }> {
    try {
      const userPrompt = `
                        나의 피부 타입: ${skinType}.
                        현재 나의 피부 트러블: '${trouble}'.
                        내가 보유한 스킨 케어 제품: ${JSON.stringify(careProductDataForPrompt)}.`;

      const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      const apiResponse = await client.responses.parse({
        model: process.env.OPENAI_API_MODEL,
        tools: [{ type: 'web_search' }],
        input: [
          {
            role: 'system',
            content: SolveTroublePrompt.SYSTEM_PROMPT,
          },
          {
            role: 'developer',
            content: SolveTroublePrompt.DEVELOPER_PROMPT,
          },
          {
            role: 'user',
            content: userPrompt,
          },
        ],
        text: {
          format: zodTextFormat(canSolveZObj, 'response'),
        },
      });

      if (apiResponse.output_parsed === null) {
        throw new InternalServerErrorException('Internal server error');
      }

      return apiResponse.output_parsed;
    } catch (e) {
      if (e instanceof HttpException) {
        throw e;
      } else {
        console.error(e);
        throw new InternalServerErrorException('Internal server error');
      }
    }
  }

  async recommendCareProductForSolution(
    skinType: string,
    trouble: string,
    careProductDataForPrompt: CareProductDataForPrompt,
    careProductList: CareProductDataForPrompt,
  ) {
    try {
      const userPrompt = `
                        나의 피부 타입: ${skinType}.
                        현재 나의 피부 트러블: '${trouble}'.
                        내가 보유한 스킨 케어 제품: ${JSON.stringify(careProductDataForPrompt)}.
                        스킨 케어 제품 리스트: ${JSON.stringify(careProductList)}`;

      const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      const apiResponse = await client.responses.parse({
        model: process.env.OPENAI_API_MODEL,
        tools: [{ type: 'web_search' }],
        input: [
          {
            role: 'system',
            content: RecommendCareProductPrompt.SYSTEM_PROMPT,
          },
          {
            role: 'developer',
            content: RecommendCareProductPrompt.DEVELOPER_PROMPT,
          },
          {
            role: 'user',
            content: userPrompt,
          },
        ],
        text: {
          format: zodTextFormat(
            recommendCareProductIdForSolutionZObj,
            'response',
          ),
        },
      });

      if (apiResponse.output_parsed === null) {
        throw new InternalServerErrorException('Internal server error');
      }

      return apiResponse.output_parsed;
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
