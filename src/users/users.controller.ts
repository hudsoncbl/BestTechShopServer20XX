import { Body, Controller, Get, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserRole } from './user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(
    @Body()
    body: { email: string; fullName: string; password: string; role?: UserRole },
  ) {
    return this.usersService.create({
      email: body.email,
      fullName: body.fullName,
      password: body.password,
      role: body.role ?? UserRole.CUSTOMER,
    });
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }
}
