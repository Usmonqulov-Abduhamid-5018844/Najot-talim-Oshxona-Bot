import { Injectable } from '@nestjs/common';
import {
  Action,
  Command,
  Ctx,
  Hears,
  On,
  Start,
  Update,
} from 'nestjs-telegraf';
import { BotService } from './bot.service';
import { IMyContext } from 'src/helpers/bot.sessin';
const ChatID_1 = process.env.ChatID_1;
@Update()
@Injectable()
export class BotUpdate {
  constructor(private readonly botService: BotService) {}

  @Start()
  onStart(@Ctx() ctx: IMyContext) {
    if (ctx.from?.id == ChatID_1) {
      return this.botService.onStartAdmin(ctx);
    } else {
      return this.botService.onStart(ctx);
    }
  }

  @Hears("Admin Paneliga o'tish")
  onStartAdmin(@Ctx() ctx: IMyContext) {
    if (ctx.from?.id == ChatID_1) {
      return this.botService.onAdmineditMenyu(ctx);
    } else {
      ctx.reply("Admin paneliga o'taolmaysiz");
      return;
    }
  }
  @Command('menu')
  onMenue(@Ctx() ctx: IMyContext) {
    if (ctx.from?.id == ChatID_1) {
      return this.botService.onAdmineditMenyu(ctx);
    } else {
      return this.botService.onUserAllMenyu(ctx);
    }
  }
  @Command('info')
  onInfo(@Ctx() ctx: IMyContext) {
    return this.botService.onInfo(ctx);
  }
  @Command('ortga')
  OnOrtga(@Ctx() ctx: IMyContext) {
    if (ctx.from?.id == ChatID_1) {
      return this.botService.onStartAdmin(ctx);
    } else {
      return this.botService.onStart(ctx);
    }
  }
  @Command('help')
  OnHelp(@Ctx() ctx: IMyContext) {
    if (ctx.from?.id == ChatID_1) {
      return this.botService.OnHelp(ctx);
    } else {
      return this.botService.onhelp(ctx);
    }
  }

  @Hears('Menyu')
  onStartUser(@Ctx() ctx: IMyContext) {
    return this.botService.onUserAllMenyu(ctx);
  }
  @Hears('Orqaga qaytish')
  Ortga(@Ctx() ctx: IMyContext) {
    if (ctx.from?.id == ChatID_1) {
      return this.botService.onAdmineditMenyu(ctx);
    } else {
      ctx.reply("Siz admin paneliga o'ta olmaysiz");
      return;
    }
  }

  @Hears('Help')
  onhelp(@Ctx() ctx: IMyContext) {
    return this.botService.onhelp(ctx);
  }
  @Hears('Reyting')
  onreyting(@Ctx() ctx: IMyContext) {
    return this.botService.onreyting(ctx);
  }
  @On('text')
  text(@Ctx() ctx: IMyContext) {
    return this.botService.textmessage(ctx);
  }
  @On('photo')
  OnPhoto(@Ctx() ctx: IMyContext) {
    if (ctx.from?.id == ChatID_1) {
      return this.botService.OnPhoto(ctx);
    } else {
      ctx.reply('Siz rasim yubora olmaysiz');
      return;
    }
  }

  @Action('Create')
  createAction(@Ctx() ctx: IMyContext) {
    if (ctx.from?.id == ChatID_1) {
      return this.botService.create(ctx);
    } else {
      ctx.reply("Siz admin paneliga o'ta olmaysiz");
      return;
    }
  }
  @Action('findAll')
  find_all(@Ctx() ctx: IMyContext) {
    return this.botService.findAll(ctx);
  }
  @Action('Delete')
  delet(@Ctx() ctx: IMyContext) {
    if (ctx.from?.id == ChatID_1) {
      return this.botService.delet(ctx);
    } else {
      ctx.reply("Siz admin paneliga o'ta olmaysiz");
      return;
    }
  }

  //UUUUUUUUUUUUUUUUZZZZZZZZZZZZZZZZZZZZZZEEEEEEEEEEEEEEEEEEEEEEERRRRRRRRRRRRRRRRRRRR

  @Action('ortga')
  ortgamenu(@Ctx() ctx: IMyContext) {
    return this.botService.onStart(ctx);
  }

  @Action('osh')
  osh(@Ctx() ctx: IMyContext) {
    return this.botService.osh(ctx);
  }
  @Action('xonim')
  xonim(@Ctx() ctx: IMyContext) {
    return this.botService.xonim(ctx);
  }
  @Action('jarkop')
  jarkop(@Ctx() ctx: IMyContext) {
    return this.botService.jarkop(ctx);
  }

  @Action('kfc')
  kfc(@Ctx() ctx: IMyContext) {
    return this.botService.kfc(ctx);
  }

  @Action('somsa')
  somsa(@Ctx() ctx: IMyContext) {
    return this.botService.somsa(ctx);
  }

  @Action('bishtex')
  bishtex(@Ctx() ctx: IMyContext) {
    return this.botService.bishtex(ctx);
  }

  @Action('lagmon')
  lagmon(@Ctx() ctx: IMyContext) {
    return this.botService.lagmon(ctx);
  }
}
