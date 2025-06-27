import { Injectable } from '@nestjs/common';
import { Action, Ctx, Hears, On, Start, Update } from 'nestjs-telegraf';
import { BotService } from './bot.service';
import { IMyContext } from 'src/helpers/bot.sessin';
@Update()
@Injectable()
export class BotUpdate {
  constructor(private readonly botService: BotService) {}

  @Start()
   onStart(@Ctx() ctx: IMyContext) {
    if (ctx.from?.id === 5107358906) {
      return this.botService.onStartAdmin(ctx);
    } else {
      return this.botService.onStart(ctx);
    }
  }

  @Hears("Admin Paneliga o'tish")
   onStartAdmin(@Ctx() ctx: IMyContext) {
    return this.botService.onAdmineditMenyu(ctx);
  }

  @Hears('Menyu')
   onStartUser(@Ctx() ctx: IMyContext) {
    return this.botService.onUserAllMenyu(ctx);
  }
  @Hears("Orqaga qaytish")
  Ortga(@Ctx()ctx: IMyContext){
    return this.botService.onAdmineditMenyu(ctx)
  }
  @On('text')
   text(@Ctx() ctx: IMyContext){
    return this.botService.textmessage(ctx)
  }
  @On("photo")
  OnPhoto(@Ctx() ctx: IMyContext){
    return this.botService.OnPhoto(ctx)
  }

  @Action('Create')
   createAction(@Ctx() ctx: IMyContext) {
    return this.botService.create(ctx);
  }

  @Action("findAll")
  find_all(@Ctx() ctx: IMyContext){
    return this.botService.findAll(ctx)
  }
  @Action("Delete")
  delet(@Ctx() ctx: IMyContext){
    return this.botService.delet(ctx)
  }


  //UUUUUUUUUUUUUUUUZZZZZZZZZZZZZZZZZZZZZZEEEEEEEEEEEEEEEEEEEEEEERRRRRRRRRRRRRRRRRRRR

  @Action("osh")
  osh(@Ctx() ctx: IMyContext){
    return this.botService.osh(ctx)
  }
}
