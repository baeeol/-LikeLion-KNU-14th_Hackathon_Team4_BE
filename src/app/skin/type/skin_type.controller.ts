import { Body, Controller, Param, Put } from '@nestjs/common';
import { SkinTypeService } from './skin_type.service';
import { ModifySkinTypeDto } from '../dto/ModifySkinType.dto';

@Controller('/users/:userId/skin/type')
export class SkinTypeController {
  constructor(private skinTypeService: SkinTypeService) {}

  @Put()
  async modifySkinType(
    @Param('userId') userId: number,
    @Body()
    modifySkinTypeDto: ModifySkinTypeDto,
  ) {
    await this.skinTypeService.modifySkinType(userId, modifySkinTypeDto);
    return;
  }
}
