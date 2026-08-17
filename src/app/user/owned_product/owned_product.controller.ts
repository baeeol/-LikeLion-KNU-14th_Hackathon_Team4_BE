import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { OwnedProductService } from './owned_product.service';
import { GetAllOwnedProductResponseDto } from './dto/get_all_owned_product.response.dto';
import { PostOwnedProductRequestDto } from './dto/post_owned_product.request.dto';
import { DeleteOwnedProductRequestDto } from './dto/delete_owned_product.request.dto';

@Controller('/user/:userId/care_product')
export class OwnedProductController {
  constructor(private ownedProductService: OwnedProductService) {}

  @Get()
  async getAll(
    @Param('userId') userId: number,
  ): Promise<GetAllOwnedProductResponseDto> {
    return await this.ownedProductService.findAll(userId);
  }

  @Post()
  async post(
    @Param('userId') userId: number,
    @Body() postOwnedProductRequestDt: PostOwnedProductRequestDto,
  ): Promise<void> {
    await this.ownedProductService.create(userId, postOwnedProductRequestDt);

    return;
  }

  @Delete()
  async delete(
    @Param('userId') userId: number,
    @Body() deleteOwnedProductRequestDto: DeleteOwnedProductRequestDto,
  ): Promise<void> {
    await this.ownedProductService.delete(userId, deleteOwnedProductRequestDto);

    return;
  }
}
