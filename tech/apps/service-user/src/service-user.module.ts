import * as Joi from 'joi';
import { Module } from '@nestjs/common';
import { ServiceUserController } from './service-user.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: [`apps/service-user/.env`],
            validationSchema: Joi.object({
                API_DOCS_ENABLED: Joi.string().optional(),
                PORT: Joi.number().required(),
            }),
        }),
    ],
    controllers: [ServiceUserController],
    providers: [],
})
export class ServiceUserModule {}
