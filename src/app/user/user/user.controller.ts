import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { GetUserByIdResponseDto } from './dto/get_user_by_id.response.dto';

@Controller('/user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('/:userId')
  async getById(
    @Param('userId') userId: number,
  ): Promise<GetUserByIdResponseDto> {
    return await this.userService.findById(userId);
  }
}
