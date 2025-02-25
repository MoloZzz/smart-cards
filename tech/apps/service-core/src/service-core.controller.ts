import { Controller, Get } from '@nestjs/common';

@Controller()
export class ServiceCoreController {
  @Get()
  async getHello(): Promise<string> {
    return "Hello from service-core";
  }
}
