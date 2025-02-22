import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  async getHello(): Promise<string> {
    const hello : string = "Hello world";
    return hello;
  }
}
