import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    // Підключення .env
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // Підключення PostgreSQL через TypeORM
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

    // Наші модулі
    UsersModule,
    ProductsModule,
    AuthModule,
  ],
})
export class AppModule {}
