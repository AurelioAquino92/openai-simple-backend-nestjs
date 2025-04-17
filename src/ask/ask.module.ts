import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AskService } from './ask.service';
import { AskController } from './ask.controller';

@Module({
  imports: [ConfigModule],
  controllers: [AskController],
  providers: [AskService],
})
export class AskModule {}
