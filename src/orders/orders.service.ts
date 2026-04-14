import { Injectable } from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class OrdersService {
  private client: ClientProxy;

  constructor() {
    this.client = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: { port: 4001 }, // порт мікросервісу products
    });
  }

  // 🔥 отримати товари з products
  async getProducts() {
    return firstValueFrom(this.client.send({ cmd: 'get_products' }, {}));
  }

  // 🔥 створення замовлення
  async createOrder() {
    const products = await this.getProducts();

    return {
      message: 'Order created',
      products,
    };
  }
}
