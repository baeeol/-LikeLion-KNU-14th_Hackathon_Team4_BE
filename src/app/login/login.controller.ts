import { Body, Controller, Post } from '@nestjs/common';
import { LoginService } from './login.service';
import { LoginRequestDto } from './dto/login.request.dto';
@Controller('/submit/login')
export class LoginController {
  constructor(private loginService: LoginService) {}

  @Post()
  async login(@Body() loginDto: LoginRequestDto): Promise<string> {
    const jwt: string = await this.loginService.login(loginDto);
    return jwt;
  }
}
