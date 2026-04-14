import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { OrdersProcessor } from './orders.processor';
import { OrdersQueueService } from './orders-queue.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'orders',
    }),
  ],
  providers: [OrdersProcessor, OrdersQueueService],
  exports: [OrdersQueueService],
})
export class OrdersQueueModule {}
