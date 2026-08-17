import { IsNotEmpty, IsNumber } from 'class-validator';

export class DeleteOwnedProductRequestDto {
  @IsNumber()
  @IsNotEmpty()
  careProductId: number;
}
