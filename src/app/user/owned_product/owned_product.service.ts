import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { GetAllOwnedProductResponseDto } from './dto/get_all_owned_product.response.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/domain/user.entity';
import { Repository } from 'typeorm';
import { PostOwnedProductRequestDto } from './dto/post_owned_product.request.dto';
import { CareProduct } from 'src/domain/care_product';
import { DeleteOwnedProductRequestDto } from './dto/delete_owned_product.request.dto';

@Injectable()
export class OwnedProductService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(CareProduct)
    private careProductRepository: Repository<CareProduct>,
  ) {}

  async findAll(userId: number): Promise<GetAllOwnedProductResponseDto> {
    try {
      const user = await this.userRepository.findOne({
        where: { id: userId },
        relations: { ownedProducts: true },
      });

      if (user === null) {
        throw new BadRequestException('Does not exist user');
      }

      const response = new GetAllOwnedProductResponseDto();
      response.products = user.ownedProducts.map((ownedProduct) => {
        return {
          id: ownedProduct.id,
          category: ownedProduct.type,
          brand: ownedProduct.brand,
          name: ownedProduct.name,
        };
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

  async create(
    userId: number,
    careProductData: PostOwnedProductRequestDto,
  ): Promise<void> {
    try {
      const careProduct = await this.careProductRepository.findOneBy({
        id: careProductData.careProductId,
      });

      if (careProduct === null) {
        throw new BadRequestException('Does not exist care product');
      }

      const user = await this.userRepository.findOne({
        where: { id: userId },
        relations: { ownedProducts: true },
      });

      if (user === null) {
        throw new BadRequestException('Does not exist user');
      }

      user.ownedProducts.push(careProduct);
      await this.userRepository.save(user);

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

  async delete(
    userId: number,
    careProductData: DeleteOwnedProductRequestDto,
  ): Promise<void> {
    try {
      const user = await this.userRepository.findOne({
        where: { id: userId },
        relations: { ownedProducts: true },
      });

      if (user === null) {
        throw new BadRequestException('Does not exist user');
      }

      const beforeOwnedProductsLength = user.ownedProducts.length;
      user.ownedProducts = user.ownedProducts.filter((ownedProduct) => {
        return ownedProduct.id !== careProductData.careProductId;
      });
      const afterOwnedProductsLength = user.ownedProducts.length;

      if (beforeOwnedProductsLength === afterOwnedProductsLength) {
        throw new BadRequestException('Does not owned care product');
      }

      await this.userRepository.save(user);

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
