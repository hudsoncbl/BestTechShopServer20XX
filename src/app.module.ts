import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { AuthModule } from './auth/auth.module';

import { OrderSubscriber } from './orders/order.subscriber';
import { WebhookTestController } from './webhooks/webhook-test.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        type: 'postgres',
        host: cfg.get<string>('DB_HOST'),
        port: Number(cfg.get<string>('DB_PORT')),
        username: cfg.get<string>('DB_USERNAME'),
        password: cfg.get<string>('DB_PASSWORD'),
        database: cfg.get<string>('DB_NAME'),
        autoLoadEntities: true,
        synchronize: cfg.get<string>('DB_SYNC') === 'true',
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
  controllers: [WebhookTestController],

  // ✅ subscriber (слухає INSERT в orders)
  providers: [OrderSubscriber],
})
export class AppModule {}
