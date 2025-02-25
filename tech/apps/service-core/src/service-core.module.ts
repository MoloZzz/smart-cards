import * as Joi from 'joi';
import { Module } from '@nestjs/common';
import { ServiceCoreController } from './service-core.controller';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [UserModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`apps/service-core/.env`],
      validationSchema: Joi.object({
          API_DOCS_ENABLED: Joi.string().optional(),
          PORT: Joi.number().required(),
      }),
  }),
  ],
  controllers: [ServiceCoreController],
})
export class ServiceCoreModule {}
