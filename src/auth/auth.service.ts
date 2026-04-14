import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(email: string, password: string, fullName: string) {
    const hashed = await bcrypt.hash(password, 10);
    console.log(hashed);
    return this.usersService.create({
      email,
      password: hashed,
      fullName,
    });
  }

  async login(email: string, password: string) {
    const users = await this.usersService.findAll();
    const user = users.find((u) => u.email === email);
    console.log(user);
    if (!user) throw new UnauthorizedException();

    const isMatch = await bcrypt.compare(password, user.password);
    console.log(isMatch);
    if (!isMatch) throw new UnauthorizedException();

    const payload = { sub: user.id, role: user.role };
    console.log('Test1');
    const jwtToken = this.jwtService.sign(payload);
    console.log(jwtToken);
    console.log('Test2');
    return {
      access_token: jwtToken,
    };
  }
}
