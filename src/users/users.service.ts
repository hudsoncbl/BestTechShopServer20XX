import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { instanceToPlain } from 'class-transformer';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly repo: Repository<User>,
  ) {}

  async create(dto: Partial<User>) {
    console.log(dto);
    const created = await this.repo.save(this.repo.create(dto));
    console.log(created);
    return instanceToPlain(created);
  }

  findAll() {
    return this.repo.find();
  }
}
