import { DynamicModule, Module, Logger } from '@nestjs/common';
import IORedis from 'ioredis';
import { ConfigService } from '@nestjs/config';

import { REDIS } from './redis.constants';

@Module({})
export class RedisModule {
    static async registerAsync(): Promise<DynamicModule> {
        const redisProvider = {
            provide: REDIS,
            useFactory: async (configService: ConfigService) => {
                const logger = new Logger('RedisModule');
                const { connectionOptions, onClientReady } = {
                    connectionOptions: {
                        host: configService.get('REDIS_HOST'),
                        port: configService.get('REDIS_PORT'),
                    },
                    onClientReady: (client) => {
                        logger.log('Redis client ready');

                        client.on('error', (err) => {
                            logger.error('Redis Client Error: ', err);
                        });

                        client.on('connect', () => {
                            logger.log(`Connected to redis on ${client.options.host}:${client.options.port}`);
                        });
                    },
                };

                const client = await new IORedis(connectionOptions);

                onClientReady(client);

                return client;
            },
            inject: [ConfigService],
        };

        return {
            module: RedisModule,
            imports: [],
            providers: [redisProvider],
            exports: [redisProvider],
        };
    }
}
