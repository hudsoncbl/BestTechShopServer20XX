import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UserProfile } from 'src/profiles/user-profile.entity';
import { Order } from 'src/orders/order.entity';
import { OrderItem } from 'src/orders/order-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserProfile, Order, OrderItem])],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
