import { DataSource, EntitySubscriberInterface, EventSubscriber, InsertEvent } from 'typeorm';
import { Order } from './order.entity';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { WebhookSubscription, WebhookEvent } from '../webhooks/webhook-subscription.entity';
import { WebhookDelivery } from '../webhooks/webhook-delivery.entity';

@EventSubscriber()
export class OrderSubscriber implements EntitySubscriberInterface<Order> {
  constructor(private ds: DataSource, private http: HttpService) {
    this.ds.subscribers.push(this);
  }

  listenTo() {
    return Order;
  }

  async afterInsert(event: InsertEvent<Order>) {
    const order = event.entity;

    const hookRepo = this.ds.getRepository(WebhookSubscription);
    const deliveryRepo = this.ds.getRepository(WebhookDelivery);

    const hooks = await hookRepo.find({
      where: { event: WebhookEvent.ORDER_CREATED, isActive: true },
    });

    for (const hook of hooks) {
      const delivery = deliveryRepo.create({ webhook: hook });

      try {
        const resp = await firstValueFrom(
          this.http.post(
            hook.url,
            { event: WebhookEvent.ORDER_CREATED, orderId: order.id, total: order.total },
            { timeout: 5000 },
          ),
        );

        delivery.statusCode = resp.status;
        delivery.responseBody = typeof resp.data === 'string' ? resp.data : JSON.stringify(resp.data);
      } catch (e: any) {
        delivery.statusCode = e?.response?.status;
        delivery.error = e?.message ?? 'Unknown error';
        delivery.responseBody = e?.response?.data
          ? (typeof e.response.data === 'string' ? e.response.data : JSON.stringify(e.response.data))
          : undefined;
      }

      await deliveryRepo.save(delivery);
    }
  }
}
