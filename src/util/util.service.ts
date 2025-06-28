import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectBot } from 'nestjs-telegraf';
import { Telegraf } from 'telegraf';

@Injectable()
export class UtilService implements OnModuleInit {
  constructor(@InjectBot() private readonly Bot: Telegraf) {}

  async onModuleInit() {
    await this.Bot.telegram.setMyCommands([
      { command: '/start', description: 'Botni boshlash' },
      { command: '/menyu', description: "Menyuga o'tish" },
      { command: '/info', description: "O'zi haqida malumod" },
      { command: '/help', description: 'Yordam olish' },
    ]);
  }
}
