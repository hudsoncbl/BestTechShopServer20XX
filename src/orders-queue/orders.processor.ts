import { Process, Processor } from '@nestjs/bull';
import bull from 'bull';

@Processor('orders')
export class OrdersProcessor {
  @Process('create-order')
  async handleCreateOrder(job: bull.Job) {
    console.log('Processing order:', job.data);

    // тут можна:
    // - зберегти в БД
    // - викликати products service
    // - відправити email

    return {
      status: 'completed',
      order: job.data,
    };
  }
}
