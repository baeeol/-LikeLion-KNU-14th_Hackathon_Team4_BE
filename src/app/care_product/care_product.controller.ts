import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { CareProductService } from './care_product.service';
import { GetCareProductByKeywordResponseDto } from './dto/getCareProductByKeywordResponse.dto';
import { PostCareProductRequestDto } from './dto/postCareProductRequest.dto';

@Controller('/care_products')
export class CareProductController {
  constructor(private careProductService: CareProductService) {}

  @Get()
  async getCareProduct(
    @Query('keyword') keyword: string,
  ): Promise<GetCareProductByKeywordResponseDto> {
    keyword = keyword.replaceAll(' ', '');
    keyword = keyword.replaceAll('%20', '');

    return await this.careProductService.findBySearchKeyword(keyword);
  }

  @Post()
  async postCareProduct(
    @Body() postCareProductRequestDto: PostCareProductRequestDto,
  ) {
    await this.careProductService.addCareProduct(postCareProductRequestDto);

    return;
  }

  @Delete('/:productId')
  async deleteCareProduct(@Param('productId') productId: number) {
    await this.careProductService.deleteCareProduct(productId);

    return;
  }
}
