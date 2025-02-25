import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ServiceCoreModule } from './service-core.module';
import { RmqService } from '@app/common/rmq/rmq.service';
import { MicroserviceOptions } from '@nestjs/microservices';

async function bootstrap() {
    const app = await NestFactory.create(ServiceCoreModule);
    app.setGlobalPrefix('api/service-core');
    const configService = app.get(ConfigService);
    const rmq = app.get<RmqService>(RmqService);
    app.connectMicroservice<MicroserviceOptions>(rmq.getOptions(configService.get<string>('RABBIT_MQ_CORE_QUEUE')));
    await app.listen(configService.get<number>('PORT'));
}
bootstrap();
