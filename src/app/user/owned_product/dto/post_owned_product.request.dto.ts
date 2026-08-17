import { IsNotEmpty, IsNumber } from 'class-validator';

export class PostOwnedProductRequestDto {
  @IsNumber()
  @IsNotEmpty()
  careProductId: number;
}
