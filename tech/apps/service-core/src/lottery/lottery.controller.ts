import { Controller, Get, Req } from '@nestjs/common';
import { LotteryService } from './lottery.service';
import { Request } from 'express';
import { IUser } from '@app/common';

@Controller('lottery')
export class LotteryController {
    constructor(private readonly serviceLottery: LotteryService){}

    @Get('/run')
    async run(@Req() req: Request){
        const currentUser = { id: 1 } // req.user as IUser;
        return await this.serviceLottery.spinLottery(currentUser.id);
    }
}
