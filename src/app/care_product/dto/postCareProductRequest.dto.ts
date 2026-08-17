import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
} from 'class-validator';
import { CareProductType } from 'src/types/CareProductType';

export class PostCareProductRequestDto {
  @IsEnum(CareProductType)
  category: CareProductType;

  @IsString()
  @MaxLength(20)
  @IsNotEmpty()
  brand: string;

  @IsString()
  @MaxLength(50)
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsString()
  @MaxLength(1000)
  @IsNotEmpty()
  ingredient: string;

  @IsString()
  @MaxLength(200)
  @IsNotEmpty()
  keyword: string;
}
