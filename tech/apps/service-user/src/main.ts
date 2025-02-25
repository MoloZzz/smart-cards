import { NestFactory } from '@nestjs/core';
import { ServiceUserModule } from './service-user.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
    const app = await NestFactory.create(ServiceUserModule);
    app.setGlobalPrefix('api/service-user');
    const configService = app.get(ConfigService);
    await app.listen(configService.get<number>('PORT'));
}
bootstrap();
