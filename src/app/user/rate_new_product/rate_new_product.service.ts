import {
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import OpenAI from 'openai';
import { CareProductDataForPrompt } from 'src/app/care_routine/type/care_routine.type';
import { DecideCanJoinNowPrompt } from './constants/decide_can_join_now_prompt.constant';
import { zodTextFormat } from 'openai/helpers/zod.mjs';
import { canJoinZObj } from './type/can_join.zobj';
import { ConflictReason } from './constants/conflict_reason_prompt';
import { conflictReasonZObj } from './type/conflict_reason.zobj';

@Injectable()
export class RateNewProductService {
  async decideCanJoinNow(
    skinType: string,
    newProduct: CareProductDataForPrompt,
    ownedProduct: CareProductDataForPrompt,
  ): Promise<boolean> {
    try {
      const userPrompt = `
                        나의 피부 타입: ${skinType},
                        구매를 생각하고 있는 스킨 케어 제품: '${JSON.stringify(newProduct)}'.
                        내가 보유한 스킨 케어 제품: ${JSON.stringify(ownedProduct)}.`;

      const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      const apiResponse = await client.responses.parse({
        model: process.env.OPENAI_API_MODEL,
        tools: [{ type: 'web_search' }],
        input: [
          {
            role: 'system',
            content: DecideCanJoinNowPrompt.SYSTEM_PROMPT,
          },
          {
            role: 'developer',
            content: DecideCanJoinNowPrompt.DEVELOPER_PROMPT,
          },
          {
            role: 'user',
            content: userPrompt,
          },
        ],
        text: {
          format: zodTextFormat(canJoinZObj, 'response'),
        },
      });

      if (apiResponse.output_parsed === null) {
        throw new InternalServerErrorException('Internal server error');
      }

      return apiResponse.output_parsed.canJoinNow;
    } catch (e) {
      if (e instanceof HttpException) {
        throw e;
      } else {
        console.error(e);
        throw new InternalServerErrorException('Internal server error');
      }
    }
  }

  async getConflictReason(
    skinType: string,
    newProduct: CareProductDataForPrompt,
    ownedProduct: CareProductDataForPrompt,
  ): Promise<string> {
    try {
      const userPrompt = `
                        나의 피부 타입: ${skinType},
                        구매를 생각하고 있는 스킨 케어 제품: '${JSON.stringify(newProduct)}'.
                        내가 보유한 스킨 케어 제품: ${JSON.stringify(ownedProduct)}.`;

      const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      const apiResponse = await client.responses.parse({
        model: process.env.OPENAI_API_MODEL,
        tools: [{ type: 'web_search' }],
        input: [
          {
            role: 'system',
            content: ConflictReason.SYSTEM_PROMPT,
          },
          {
            role: 'developer',
            content: ConflictReason.DEVELOPER_PROMPT,
          },
          {
            role: 'user',
            content: userPrompt,
          },
        ],
        text: {
          format: zodTextFormat(conflictReasonZObj, 'response'),
        },
      });

      if (apiResponse.output_parsed === null) {
        throw new InternalServerErrorException('Internal server error');
      }

      return apiResponse.output_parsed.conflictMsg;
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
