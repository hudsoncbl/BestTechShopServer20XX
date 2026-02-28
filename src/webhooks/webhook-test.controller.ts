import { Body, Controller, Post } from '@nestjs/common';

@Controller()
export class WebhookTestController {
  @Post('webhook-test')
  test(@Body() body: any) {
    return { ok: true, received: body };
  }
}
