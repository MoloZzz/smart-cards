import * as Joi from 'joi';
import { Module } from '@nestjs/common';
import { ServiceCoreController } from './service-core.controller';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { PostgresqlModule } from '@app/db';
import { entities } from './common/entities';
import { migrations } from './common/migrations';
import { LotteryModule } from './lottery/lottery.module';
import { RmqModule } from '@app/common/rmq/rmq.module';
import { CardModule } from './card/card.module';

@Module({
    imports: [
        UserModule,
        LotteryModule,
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: [`apps/service-core/.env`],
            validationSchema: Joi.object({
                API_DOCS_ENABLED: Joi.string().optional(),
                PORT: Joi.number().required(),
                POSTGRES_USER: Joi.string().required(),
                POSTGRES_DB_NAME: Joi.string().required(),
                POSTGRES_IS_LOGGING_ENABLED: Joi.string().required(),
                POSTGRES_HOST: Joi.string().required(),
                POSTGRES_PORT: Joi.string().required(),
                POSTGRES_PASS: Joi.string().required(),
                RABBIT_MQ_URI: Joi.string().required(),
                RABBIT_MQ_CORE_QUEUE: Joi.string().required(),
            }),
        }),
        PostgresqlModule.register(entities, migrations, []),
        RmqModule,
        RmqModule.register({
            name: 'GENERATION_CLIENT',
            queueName: 'RABBIT_MQ_GENERATOR_QUEUE',
        }),
        CardModule,
    ],
    controllers: [ServiceCoreController],
})
export class ServiceCoreModule {}
