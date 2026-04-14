import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { BullModule } from '@nestjs/bull';

import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { AuthModule } from './auth/auth.module';

import { OrderSubscriber } from './orders/order.subscriber';
import { WebhookTestController } from './webhooks/webhook-test.controller';
import { OrdersService } from './orders/orders.service';
import { OrdersController } from './orders/orders.controller';
import { OrdersQueueModule } from './orders-queue/orders-queue.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    // 🔥 DATABASE
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('PGHOST'),
        port: Number(configService.get<string>('PGPORT')),
        username: configService.get<string>('PGUSER'),
        password: configService.get<string>('PGPASSWORD'),
        database: configService.get<string>('PGDATABASE'),
        autoLoadEntities: true,
        synchronize: false,
        logging: true,
      }),
    }),

    // 🔥 HTTP module
    HttpModule,

    // 🔥 BULL + REDIS (ДОДАЛИ ОЦЕ)
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),

    // existing modules
    UsersModule,
    ProductsModule,
    AuthModule,
    OrdersQueueModule,
  ],

  controllers: [WebhookTestController, OrdersController],

  providers: [OrderSubscriber, OrdersService],
})
export class AppModule {}
