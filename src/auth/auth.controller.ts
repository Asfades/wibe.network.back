import { Controller, Post, Body, ValidationPipe, Get, UseGuards, Response } from '@nestjs/common';

import { AuthService, AuthResponse } from './auth.service';
import { SignUpCredentialsDto } from './dto/signup-credentials.dto';
import { SignInCredentialsDto } from './dto/signin-credentials.dto';
import { AuthGuard } from '@nestjs/passport';
import { RefreshAccessTokenDto } from './dto/refresh-access-token.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  signUp(
    @Body(ValidationPipe) authCredentialsDto: SignUpCredentialsDto
  ): Promise<AuthResponse> {
    console.log('try to signup');
    return this.authService.signUp(authCredentialsDto);
  }

  @Post('/signin')
  signIn(
    @Body(ValidationPipe) authCredentialsDto: SignInCredentialsDto
  ): Promise<AuthResponse> {
    return this.authService.signIn(authCredentialsDto);
  }

  @Post('/refresh-access-token')
  refreshToken(
    @Body() refreshTokenDto: RefreshAccessTokenDto
  ): Promise<AuthResponse> {
    return this.authService.refreshAccessToken(refreshTokenDto);
  }

  @UseGuards(AuthGuard())
  @Get('/test')
  test(
    @Response() res
  ) {
    // console.log(res.setHeader());
    res.setHeader('Set-Cookie', 'foo=bar; HttpOnly');
    return true;
  }
}
