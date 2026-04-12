import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { AuthModule } from './auth/auth.module';

import { OrderSubscriber } from './orders/order.subscriber';
import { WebhookTestController } from './webhooks/webhook-test.controller';
import { OrdersService } from './orders/orders.service';
import { OrdersController } from './orders/orders.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

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
      }),
    }),

    // ✅ потрібен для webhook HTTP POST
    HttpModule,

    // існуючі модулі
    UsersModule,
    ProductsModule,
    AuthModule,
  ],

  // ✅ тестовий endpoint для webhook (щоб працювало без інтернету)
  controllers: [WebhookTestController, OrdersController],

  // ✅ subscriber (слухає INSERT в orders)
  providers: [OrderSubscriber, OrdersService],
})
export class AppModule {}
