import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import bull from 'bull';

@Injectable()
export class OrdersQueueService {
  constructor(@InjectQueue('orders') private queue: bull.Queue) {}

  async addOrder(order: any) {
    await this.queue.add('create-order', order);
  }
}
