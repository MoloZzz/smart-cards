import { Test, TestingModule } from '@nestjs/testing';
import { RmqService } from './rmq.service';
import { ConfigService } from '@nestjs/config';

describe('RmqService', () => {
    let service: RmqService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [RmqService, ConfigService],
        }).compile();

        service = module.get<RmqService>(RmqService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
