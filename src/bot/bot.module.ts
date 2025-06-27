import { Module } from '@nestjs/common';
import { BotService } from './bot.service';
import { BotUpdate } from './bot.update';
import { TelegrafModule } from 'nestjs-telegraf';

@Module({
  providers: [BotService, BotUpdate],
})
export class BotModul {}
