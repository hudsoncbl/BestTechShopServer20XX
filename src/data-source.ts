import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

import { User } from './users/user.entity';
import { Product } from './products/product.entity';
import { UserProfile } from './profiles/user-profile.entity';
import { Order } from './orders/order.entity';
import { OrderItem } from './orders/order-item.entity';

import { WebhookSubscription } from './webhooks/webhook-subscription.entity';
import { WebhookDelivery } from './webhooks/webhook-delivery.entity';
import { Category } from './categories/category.entity';

dotenv.config();

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.PGPORT),
  username: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  synchronize: false,
  entities: [
    User,
    Product,
    UserProfile,
    Order,
    OrderItem,
    Category,
    WebhookSubscription,
    WebhookDelivery,
  ],
  migrations: ['src/migrations/*.ts'],
});
