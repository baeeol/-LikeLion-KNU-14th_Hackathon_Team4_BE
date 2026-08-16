import { IsEnum } from 'class-validator';
import { SkinType } from 'src/types/SkinType';

export class ModifySkinTypeDto {
  @IsEnum(SkinType)
  type: SkinType;
}
