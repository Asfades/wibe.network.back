import {
  Controller,
  Get,
  Param
} from '@nestjs/common';

import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService
  ) {}

  @Get(':profile')
  getProfile(
    @Param('profile') username: string
  ) {
    return this.usersService.getProfile(username);
  }
}
