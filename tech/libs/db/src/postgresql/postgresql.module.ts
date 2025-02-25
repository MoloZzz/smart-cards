import { DynamicModule, Module } from '@nestjs/common';
import { PostgresqlService } from './postgresql.service';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

@Module({
    providers: [PostgresqlService],
})
export class PostgresqlModule {
    static register(entities: Function[], migrations: Function[], subscribers: Function[]): DynamicModule {
        return {
            module: PostgresqlModule,
            imports: [
                TypeOrmModule.forRootAsync({
                    useFactory: (configService: ConfigService): TypeOrmModuleOptions => ({
                        type: 'postgres',
                        host: configService.get<string>('POSTGRES_HOST'),
                        port: configService.get<number>('POSTGRES_PORT'),
                        username: configService.get<string>('POSTGRES_USER'),
                        password: configService.get<string>('POSTGRES_PASS'),
                        database: configService.get<string>('POSTGRES_DB_NAME'),
                        logging: configService.get<string>('POSTGRES_IS_LOGGING_ENABLED') === 'true',
                        migrationsTableName: '_migrations',
                        logger: 'advanced-console',
                        migrations,
                        entities,
                        subscribers,
                        migrationsRun: true,
                        synchronize: false,
                        namingStrategy: new SnakeNamingStrategy(),
                    }),
                    inject: [ConfigService],
                }),
            ],
            exports: [TypeOrmModule],
        };
    }
}
