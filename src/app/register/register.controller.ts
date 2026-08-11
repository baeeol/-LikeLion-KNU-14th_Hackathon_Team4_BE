import { Body, Controller, Post } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { RegisterService } from './register.service';

@Controller('/submit/register')
export class RegisterController {
  constructor(private registerService: RegisterService) {}

  @Post()
  async register(@Body() registerDto: RegisterDto): Promise<void> {
    await this.registerService.register(registerDto);
    return;
  }
}
