import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CareProduct } from 'src/domain/care_product';
import { Like, Repository } from 'typeorm';
import { GetCareProductByKeywordResponseDto } from './dto/getCareProductByKeywordResponse.dto';
import { CareProductType } from 'src/types/CareProductType';
import { PostCareProductRequestDto } from './dto/postCareProductRequest.dto';

@Injectable()
export class CareProductService {
  constructor(
    @InjectRepository(CareProduct)
    private careProductRepository: Repository<CareProduct>,
  ) {}

  async findBySearchKeyword(
    keyword: string,
  ): Promise<GetCareProductByKeywordResponseDto> {
    try {
      let typeName: CareProductType = CareProductType.CLEANSER;
      if (keyword === '클렌저') typeName = CareProductType.CLEANSER;
      else if (keyword === '로션') typeName = CareProductType.LOTION;
      else if (keyword === '토너') typeName = CareProductType.TONER;
      else if (keyword === '스킨') typeName = CareProductType.SKIN;
      else if (keyword === '앰플') typeName = CareProductType.AMPULE;
      else if (keyword === '세럼') typeName = CareProductType.SERUM;
      else if (keyword === '에센스') typeName = CareProductType.ESSENCE;
      else if (keyword === '선크림') typeName = CareProductType.SUN_CREAM;
      else if (keyword === '수분크림')
        typeName = CareProductType.MOISTURE_CREAM;

      const careProductsContainKeyword = await this.careProductRepository.find({
        where: [
          { type: typeName },
          { name: Like(`%${keyword}%`) },
          { brand: Like(`%${keyword}%`) },
          { ingredient: Like(`%${keyword}%`) },
          { keyword: Like(`%${keyword}%`) },
        ],
      });

      const response = new GetCareProductByKeywordResponseDto();
      response.products = [];

      careProductsContainKeyword.forEach((careProduct) => {
        response.products.push({
          id: careProduct.id,
          category: careProduct.type as CareProductType,
          name: careProduct.name,
          brand: careProduct.brand,
          price: careProduct.price,
        });
      });

      return response;
    } catch (e) {
      if (e instanceof HttpException) {
        throw e;
      } else {
        console.error(e);
        throw new InternalServerErrorException('Internal server error');
      }
    }
  }

  async addCareProduct(
    careProductData: PostCareProductRequestDto,
  ): Promise<void> {
    try {
      const newCareProduct = CareProduct.create(
        careProductData.category,
        careProductData.brand,
        careProductData.name,
        careProductData.price,
        careProductData.ingredient,
        careProductData.keyword,
      );

      await this.careProductRepository.save(newCareProduct);

      return;
    } catch (e) {
      if (e instanceof HttpException) {
        throw e;
      } else {
        console.error(e);
        throw new InternalServerErrorException('Internal server error');
      }
    }
  }

  async deleteCareProduct(productId: number): Promise<void> {
    try {
      const targetCareProduct = await this.careProductRepository.findOneBy({
        id: productId,
      });

      if (targetCareProduct === null) {
        throw new BadRequestException('Does not exist care product');
      }

      await this.careProductRepository.delete({ id: productId });

      return;
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
