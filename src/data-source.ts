import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

import { User } from './users/user.entity';
import { Product } from './products/product.entity';
import { UserProfile } from './profiles/user-profile.entity';
import { Order } from './orders/order.entity';
import { OrderItem } from './orders/order-item.entity';
import { Category } from './categories/category.entity';
import { WebhookSubscription } from './webhooks/webhook-subscription.entity';
import { WebhookDelivery } from './webhooks/webhook-delivery.entity';

dotenv.config();

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: false,
  entities: [User, Product, UserProfile, Order, OrderItem, Category, WebhookSubscription, WebhookDelivery],
  migrations: ['src/migrations/*.ts'],
});
