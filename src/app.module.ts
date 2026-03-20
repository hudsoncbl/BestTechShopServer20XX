import { Module } from '@nestjs/common';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { AuthModule } from './auth/auth.module';
import { UploadModule } from './upload/upload.module';

import { OrderSubscriber } from './orders/order.subscriber';
import { WebhookTestController } from './webhooks/webhook-test.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    {
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
    },

    HttpModule,

    UsersModule,
  ],

  controllers: [WebhookTestController],
  providers: [OrderSubscriber],
})
export class AppModule {}
