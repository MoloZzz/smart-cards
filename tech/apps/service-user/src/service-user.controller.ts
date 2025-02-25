import { Controller, Get } from '@nestjs/common';

@Controller()
export class ServiceUserController {
    @Get()
    async getHello(): Promise<string> {
        return 'Hello from service-user';
    }
}
