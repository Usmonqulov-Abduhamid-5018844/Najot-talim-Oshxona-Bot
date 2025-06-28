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
import { PrismaService } from 'src/prisma/prisma.service';
import { Markup } from 'telegraf';
const ChatID_1 = process.env.ChatID_1;
@Update()
@Injectable()
export class BotUpdate {
  constructor(
    private readonly botService: BotService,
    private readonly prisma: PrismaService,
  ) {}

  @Start()
  onStart(@Ctx() ctx: IMyContext) {
    if (ctx.from?.id == ChatID_1) {
      return this.botService.onStartAdmin(ctx);
    } else {
      return this.botService.onStart(ctx);
    }
  }
  @Hears('Asosiy sahifa')
  async Asosiy(@Ctx() ctx: IMyContext) {
    if (ctx.from?.id == ChatID_1) {
      ctx.session.stepAdmin = 'Asosiy';
      ctx.reply(
        `Siz asosiy sahifaga o'tdingiz`,
        Markup.keyboard([
          ['Reyting', 'Kunlik foydalanuvchilar', 'Menyu'],
        ]).resize(),
      );
    } else {
      await ctx.reply(
        `Siz asosiy sahifaga o'tdingiz`,
        Markup.keyboard([['reyting qoldirish', `Menyularni ko'rish`]]).resize(),
      );
      return;
    }
  }
  @Hears('Ortga')
  async OnOrqaga(@Ctx() ctx: IMyContext) {
    const asosiyMenu = Markup.keyboard([
      ['Reyting', 'Kunlik foydalanuvchilar', 'Menyu'],
    ]).resize();

    if (ctx.session.stepAdmin === 'Menyu') {
      ctx.session.stepAdmin = 'Asosiy';
      ctx.reply(`Siz asosiy sahifaga o'tdingiz`, asosiyMenu);
      return;
    } else if (ctx.session.stepAdmin === 'Asosiy') {
      ctx.reply('Siz bosh sahifadasiz');
      return;
    } else if (ctx.session.stepAdmin === 'Reyting') {
      ctx.session.stepAdmin = 'Asosiy';
      ctx.reply(`Siz asosiy sahifaga o'tdingiz`, asosiyMenu);
      return;
    } else if (ctx.session.stepAdmin === 'Kunlik_foydalanuvchilar') {
      ctx.session.stepAdmin = 'Asosiy';
      ctx.reply(`Siz asosiy sahifaga o'tdingiz`, asosiyMenu);
      return;
    } else if (ctx.session.name === 'name') {
      ctx.session.name = null;
      ctx.session.price = null;
      ctx.session.description = null;
      ctx.session.image = null;
      ctx.session.stepAdmin = 'Menyu';
      await ctx.reply(
        `Menyu`,
        Markup.keyboard([['Asosiy sahifa', 'Ortga']]).resize(),
      );
      return this.botService.onAdmineditMenyu(ctx);
    } else if (ctx.session.price === 'price') {
      ctx.session.price = null;
      ctx.session.name = null;
      ctx.session.description = null;
      ctx.session.image = null;
      return this.botService.create(ctx);
    } else if (ctx.session.description === 'description') {
      ctx.session.price = 'price';
      ctx.session.name = null;
      ctx.session.description = null;
      ctx.session.image = null;
      return this.botService.textmessage(ctx);
    } else if (ctx.session.image === 'img') {
      ctx.session.price = null;
      ctx.session.name = null;
      ctx.session.description = 'description';
      ctx.session.image = null;
      return this.botService.textmessage(ctx);
    } else if (ctx.session.stepAdmin === 'Creyt') {
      ctx.session.stepAdmin = 'Menyu';
      await ctx.reply(
        `Menyu`,
        Markup.keyboard([['Asosiy sahifa', 'Ortga']]).resize(),
      );
      return this.botService.onAdmineditMenyu(ctx);
    } else if (ctx.session.stepAdmin === 'FindAll') {
      ctx.session.stepAdmin = 'Menyu';
      await ctx.reply(
        `Menyu`,
        Markup.keyboard([['Asosiy sahifa', 'Ortga']]).resize(),
      );
      return this.botService.onAdmineditMenyu(ctx);
    } else if (ctx.session.stepAdmin === 'Delet') {
      ctx.session.stepAdmin = 'Menyu';
      await ctx.reply(
        `Menyu`,
        Markup.keyboard([['Asosiy sahifa', 'Ortga']]).resize(),
      );
      return this.botService.onAdmineditMenyu(ctx);
    } else {
      if (ctx.from?.id == ChatID_1) {
        ctx.session.stepAdmin = 'Asosiy';
        ctx.reply(
          'Uzoq vaqt foydalatilmagani sababli asosiy menyuga qaytildi',
          asosiyMenu,
        );
        return;
      } else {
        if (ctx.session.stepUser == 'menyu') {
          await ctx.reply(
            `Asosiy menyudasiz`,
            Markup.keyboard([
              ['reyting qoldirish',`Menyularni ko'rish`],
            ]).resize(),
          );
        }
         else {
          ctx.session.stepUser = 'menyu';
          await ctx.reply(
            `Uzoq vaqt foydalatilmagani sababli asosiy menyuga qaytildi`,
            Markup.keyboard([
              ['reyting qoldirish',`Menyularni ko'rish`],
            ]).resize(),
          );
        }
      }
    }
  }

  @Hears('Menyu')
  async onStartAdmin(@Ctx() ctx: IMyContext) {
    if (ctx.from?.id == ChatID_1) {
      ctx.session.stepAdmin = 'Menyu';
      await ctx.reply(
        `Menyu`,
        Markup.keyboard([['Asosiy sahifa', 'Ortga']]).resize(),
      );
      return this.botService.onAdmineditMenyu(ctx);
    } else {
      ctx.reply("Siz admin paneliga o'taolmaysiz");
      return;
    }
  }

  @Hears('Reyting')
  OnReyting(@Ctx() ctx: IMyContext) {
    if (ctx.from?.id == ChatID_1) {
      ctx.session.stepAdmin = 'Reyting';
      ctx.reply(
        `Reyting`,
        Markup.keyboard([['Asosiy sahifa', 'Ortga']]).resize(),
      );
      return this.botService.findAll(ctx);
    }
  }
  @Hears("Menyularni ko'rish")
  OnMenyuler(@Ctx() ctx: IMyContext) {
    ctx.session.stepUser = 'menyu';
    ctx.reply(`Menuylar`, Markup.keyboard([['ortga']]).resize());
    return this.botService.findAll(ctx);
  }

  @Hears('Kunlik foydalanuvchilar')
  Kunlik(@Ctx() ctx: IMyContext) {
    ctx.session.stepAdmin = 'Kunlik_foydalanuvchilar';
    ctx.reply('Kunlik foydalanuvchilar', Markup.keyboard([['Ortga']]).resize());
    return this.botService.Kunlik(ctx);
  }

  @Command('menyu')
  onMenue(@Ctx() ctx: IMyContext) {
    if (ctx.from?.id == ChatID_1) {
      ctx.session.stepAdmin = 'Menyu';
      return this.botService.onAdmineditMenyu(ctx);
    } else {
      ctx.session.stepUser = 'menyu';
      return this.botService.findAll(ctx);
    }
  }
  @Command('info')
  onInfo(@Ctx() ctx: IMyContext) {
    return this.botService.onInfo(ctx);
  }
  @Command('help')
  OnHelp(@Ctx() ctx: IMyContext) {
    if (ctx.from?.id == ChatID_1) {
      return this.botService.OnHelp(ctx);
    } else {
      return this.botService.onhelp(ctx);
    }
  }
  @Hears('Orqaga qaytish')
  Ortga(@Ctx() ctx: IMyContext) {
    if (ctx.from?.id == ChatID_1) {
      ctx.session.stepAdmin = 'Menyu';
      return this.botService.onAdmineditMenyu(ctx);
    } else {
      ctx.reply(
        `Siz asosiy sahifaga o'tdingiz`,
        Markup.keyboard([['reyting qoldirish', `Menyularni ko'rish`]]).resize(),
      );
    }
  }
  @On('photo')
  OnPhoto(@Ctx() ctx: IMyContext) {
    if (ctx.from?.id == ChatID_1) {
      return this.botService.OnPhoto(ctx);
    } else {
      ctx.reply(`❌ Bu botga rasim yuborib bo'lmaydi`);
      return;
    }
  }

  @Action('Create')
  async createAction(@Ctx() ctx: IMyContext) {
    ctx.answerCbQuery();
    if (ctx.from?.id == ChatID_1) {
      ctx.session.stepAdmin = 'Creyt';
      await ctx.reply(
        'Tovar',
        Markup.keyboard([['Asosiy sahifa', 'Ortga']]).resize(),
      );
      return this.botService.create(ctx);
    } else {
      ctx.reply("Siz admin paneliga o'ta olmaysiz");
      return;
    }
  }
  @Action('findAll')
  find_all(@Ctx() ctx: IMyContext) {
    ctx.session.stepAdmin = 'FindAll';
    ctx.reply(
      'Barcha Tavomlar',
      Markup.keyboard([['Asosiy sahifa', 'Ortga']])
        .resize()
        .oneTime(),
    );
    return this.botService.findAll(ctx);
  }
  @Action('Delete')
  delet(@Ctx() ctx: IMyContext) {
    ctx.answerCbQuery();
    if (ctx.from?.id == ChatID_1) {
      ctx.session.stepAdmin = 'Delet';
      ctx.reply(
        "Tavomlarni o'chirish",
        Markup.keyboard([['Asosiy sahifa', 'Ortga']])
          .resize()
          .oneTime(),
      );
      return this.botService.delet(ctx);
    } else {
      ctx.reply("Siz admin paneliga o'ta olmaysiz");
      return;
    }
  }
  @Action(/del:(\d+)/)
  async deleteMenu(@Ctx() ctx: IMyContext) {
    try {
      const id = parseInt(ctx.match[1]);

      const menu = await this.prisma.menyu.findUnique({ where: { id } });

      if (!menu) {
        return ctx.reply('❌ Bu menyu topilmadi.');
      }

      await this.prisma.menyu.delete({ where: { id } });

      await ctx.answerCbQuery();
      await ctx.reply(`✅ ${menu.name} nomli tavom o'chirildi.`);
    } catch (err) {
      console.error(err);
      await ctx.reply('❌ Xatolik yuz berdi.');
    }
  }

  @Action('save_menu')
  async saveMenu(@Ctx() ctx: IMyContext) {
    try {
      const data = ctx.session.data;
      if (!data?.name || !data?.price || !data?.description || !data?.image) {
        return ctx.reply(`❌ Saqlash uchun to'liq ma'lumot yo'q!`);
      }

      const yangi = await this.prisma.menyu.create({ data });

      await ctx.editMessageCaption?.(
        `✅ Saqlandi!\n🍽 <b>${data.name}</b>\n💰 ${data.price} so'm\n📝 ${data.description}`,
        {
          parse_mode: 'HTML',
        },
      );

      ctx.session.data = null;
      ctx.session.image = null;
    } catch (error) {
      console.error(error);
      return ctx.reply('❌ Xatolik yuz berdi');
    }
  }

  @Action('cancel_save')
  async cancelSave(@Ctx() ctx: IMyContext) {
    ctx.session.data = null;
    ctx.session.image = null;
    ctx.session.stepAdmin = 'Menyu';
    await ctx.reply('❌ Saqlash bekor qilindi');
    return this.botService.onAdmineditMenyu(ctx);
  }

  //******************************************* ADMIN ************************************⬆️ */

  //************************************************ USER *******************************⬇️ */
  @Hears('reyting qoldirish')
  async onReytingUser(@Ctx() ctx: IMyContext) {
    ctx.session.stepUser = 'reyting';
    await ctx.reply(`Menyu`, Markup.keyboard([['ortga']]).resize());
    return this.botService.onUserAllMenyu(ctx);
  }
  @Hears('ortga')
  onOrtga(@Ctx() ctx: IMyContext) {
    return this.botService.onOrtga(ctx);
  }

  @On('text')
  text(@Ctx() ctx: IMyContext) {
    return this.botService.textmessage(ctx);
  }

  @Action('ortga')
  async ortgamenu(@Ctx() ctx: IMyContext) {
    await ctx.reply(
      `Asosiy menyuga o'tdingiz`,
      Markup.keyboard([['reyting qoldirish', `Menyularni ko'rish`]]).resize(),
    );
  }

 @Action(/^menu:.+/)
async handleMenuSelection(@Ctx() ctx: IMyContext) {
  const menyuName = ctx.match[0].split(':')[1];

  const menyu = await this.prisma.menyu.findFirst({
    where: { name: { equals: menyuName, mode: 'insensitive' } },
  });

  if (!menyu) {
    return ctx.reply(`❌ ${menyuName} menyusi topilmadi.`);
  }

  ctx.session.menuName = menyu.name!.toLowerCase();

  return this.botService.sendReytingPrompt(ctx, menyu.name!);
}


@Action(/^reyting:\d$/)
async Reyting(@Ctx() ctx: IMyContext) {
  const reyting = ctx.match[0].split(':')[1];

  await ctx.answerCbQuery();

  const user = await this.prisma.user.findFirst({
    where: { chat_id: ctx.from?.id },
  });

  if (!user) {
    return ctx.reply('❌ Foydalanuvchi topilmadi.');
  }

  const menuName = ctx.session.menuName;

  if (!menuName) {
    return ctx.reply('❌ Avval menyuni tanlang.');
  }

  const menu = await this.prisma.menyu.findFirst({
    where: { name: { equals: menuName, mode: 'insensitive' } },
  });

  if (!menu) {
    return ctx.reply(`❌ ${menuName} menyusi topilmadi.`);
  }

  const existing = await this.prisma.reyting.findFirst({
    where: { user_id: user.id, menyu_id: menu.id },
  });

  if (existing) {
    return ctx.reply(`❌ Siz "${menu.name}" uchun allaqachon reyting qoldirgansiz.`);
  }

  await this.prisma.reyting.create({
    data: {
      user_id: user.id,
      menyu_id: menu.id,
      ball: +reyting,
    },
  });

  ctx.session.menuName = null;

  ctx.reply(`✅ "${menu.name}" uchun ${reyting} ball berildi`);
}

}
