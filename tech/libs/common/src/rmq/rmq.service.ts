import { Injectable } from '@nestjs/common';
import { RmqContext, RmqOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RmqService {
    constructor(private configService: ConfigService) {}

    getOptions = (queueName: string): RmqOptions => ({
        transport: Transport.RMQ,
        options: {
            urls: [this.configService.get<string>('RABBIT_MQ_URI')],
            queue: queueName,
            noAck: true,
            persistent: true,
        },
    });

    ackMessage(context: RmqContext) {
        const channel = context.getChannelRef();
        const originalMsg = context.getMessage();
        channel.ack(originalMsg);
    }
}
