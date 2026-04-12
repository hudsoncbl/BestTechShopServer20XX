import { Test, TestingModule } from '@nestjs/testing';
import { OrdersQueueService } from './orders-queue.service';

describe('OrdersQueueService', () => {
  let service: OrdersQueueService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrdersQueueService],
    }).compile();

    service = module.get<OrdersQueueService>(OrdersQueueService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
