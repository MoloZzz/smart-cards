import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ServiceCoreModule } from './service-core.module';

async function bootstrap() {
    const app = await NestFactory.create(ServiceCoreModule);
    app.setGlobalPrefix('api/service-core');
    const configService = app.get(ConfigService);
    await app.listen(configService.get<number>('PORT'));
}
bootstrap();
