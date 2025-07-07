import { Catch, Injectable } from '@nestjs/common';
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
import { bindCallback } from 'rxjs';
const ChatID_1 = process.env.ChatID_1;
const ChatID_2 = process.env.ChatID_2;
@Update()
@Injectable()
export class BotUpdate {
  constructor(
    private readonly botService: BotService,
    private readonly prisma: PrismaService,
  ) {}

  @Start()
  onStart(@Ctx() ctx: IMyContext) {
    if (ctx.from?.id == ChatID_1 || ctx.from?.id == ChatID_2) {
      return this.botService.onStartAdmin(ctx);
    } else {
      return this.botService.onStart(ctx);
    }
  }
  @Hears('Asosiy sahifa')
  async Asosiy(@Ctx() ctx: IMyContext) {
    if (ctx.from?.id == ChatID_1 || ctx.from?.id == ChatID_2) {
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
    } else if (ctx.session.stepAdmin === 'bugun') {
      ctx.session.SS = null;
      ctx.session.stepAdmin = 'Menyu';
      await ctx.reply(
        `Menyu`,
        Markup.keyboard([['Asosiy sahifa', 'Ortga']]).resize(),
      );
      return this.botService.onAdmineditMenyu(ctx);
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
      if (ctx.from?.id == ChatID_1 || ctx.from?.id == ChatID_2) {
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
              ['📊 reyting qoldirish', `📖 Menyularni ko'rish`, '🙋🏼‍♂️ Help'],
            ]).resize(),
          );
        } else {
          ctx.session.stepUser = 'menyu';
          await ctx.reply(
            `Uzoq vaqt foydalatilmagani sababli asosiy menyuga qaytildi`,
            Markup.keyboard([
              ['📊 reyting qoldirish', `📖 Menyularni ko'rish`, '🙋🏼‍♂️ Help'],
            ]).resize(),
          );
        }
      }
    }
  }

  @Hears('Menyu')
  async onStartAdmin(@Ctx() ctx: IMyContext) {
    if (ctx.from?.id == ChatID_1 || ctx.from?.id == ChatID_2) {
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
    if (ctx.from?.id == ChatID_1 || ctx.from?.id == ChatID_2) {
      ctx.session.stepAdmin = 'Reyting';
      ctx.reply(
        `Reyting`,
        Markup.keyboard([['Asosiy sahifa', 'Ortga']]).resize(),
      );
      return this.botService.findAll(ctx);
    }
  }
  @Hears("📖 Menyularni ko'rish")
  OnMenyuler(@Ctx() ctx: IMyContext) {
    ctx.session.stepUser = 'menyu';
    ctx.reply(`Menuylar`, Markup.keyboard([['🔙 ortga',"🍱 Bugun qilinadigan ovqatlar"]]).resize());
    return this.botService.findAll(ctx);
  }

  @Hears("🍱 Bugun qilinadigan ovqatlar")
  async onOnqatlar(@Ctx() ctx:IMyContext){
    try {
      const bugun = await this.prisma.bugun.findMany();
      
      if (!bugun.length) {
        await ctx.reply('🤷‍♂️ Bugun qilinadigan ovqatlar elon qilinmagan!');
        return;
      }
  
      for (const item of bugun) {
        const menyu = await this.prisma.menyu.findUnique({
          where: { id: item.menyuId },
        });
  
        if (!menyu) continue;
  
        const text =
          `🍽 <b>${menyu.name || "Noma'lum ovqat"}</b>\n\n` +
          `⭐ Reyting: ${menyu.avg_reytig ?? 0}\n\n` +
          `💰 Narxi: ${menyu.price || "Noma'lum"} so'm\n\n` +
          `📝 ${menyu.description || 'Tavsif mavjud emas.'}\n\n` +
          `🆔 ID: ${item.id}`;
  
        if (menyu.image) {
          await ctx.replyWithPhoto(menyu.image, {
            caption: text,
            parse_mode: 'HTML',
          });
        } else {
          await ctx.reply(text, { parse_mode: 'HTML' });
        }
      }
    } catch (error) {
      console.error(error);
      await ctx.reply("❌ Xatolik yuz berdi. Keyinroq urinib ko'ring.");
    }
  }

  @Hears('Kunlik foydalanuvchilar')
  Kunlik(@Ctx() ctx: IMyContext) {
    if(ctx.from?.id == ChatID_1 || ctx.from?.id == ChatID_2){
      ctx.session.stepAdmin = 'Kunlik_foydalanuvchilar';
      ctx.reply('Kunlik foydalanuvchilar', Markup.keyboard([['Ortga']]).resize());
      return this.botService.Kunlik(ctx);
    }
    else{
      ctx.reply("🚫 Bunday buyruq mavjud emas")
    }
  }

  @Command('menyu')
  onMenue(@Ctx() ctx: IMyContext) {
    if (ctx.from?.id == ChatID_1 || ctx.from?.id == ChatID_2) {
      ctx.session.stepAdmin = 'Menyu';
      ctx.reply(
        `Siz asosiy sahifaga o'tdingiz`,
        Markup.keyboard([
          ['Reyting', 'Kunlik foydalanuvchilar', 'Menyu'],
        ]).resize(),
      );
      return this.botService.onAdmineditMenyu(ctx);
    } else {
      ctx.session.stepUser = 'menyu';
      ctx.reply(
        `Siz asosiy sahifaga o'tdingiz`,
        Markup.keyboard([
          ['📊 reyting qoldirish', `📖 Menyularni ko'rish`, '🙋🏼‍♂️ Help'],
        ]).resize(),
      );
      return this.botService.findAll(ctx);
    }
  }
  @Command('info')
  onInfo(@Ctx() ctx: IMyContext) {
    if (ctx.from?.id == ChatID_1 || ctx.from?.id == ChatID_2) {
      ctx.reply(
        `O'z haqingizda maluot`,
        Markup.keyboard([
          ['Reyting', 'Kunlik foydalanuvchilar', 'Menyu'],
        ]).resize(),
      );
    } else {
      ctx.reply(
        `O'z haqingizda maluot`,
        Markup.keyboard([
          ['📊 reyting qoldirish', `📖 Menyularni ko'rish`, '🙋🏼‍♂️ Help'],
        ]).resize(),
      );
    }
    return this.botService.onInfo(ctx);
  }
  @Command('help')
  OnHelp(@Ctx() ctx: IMyContext) {
    if (ctx.from?.id == ChatID_1 || ctx.from?.id == ChatID_2) {
      ctx.reply(
        `Yordam bo'limi`,
        Markup.keyboard([
          ['Reyting', 'Kunlik foydalanuvchilar', 'Menyu'],
        ]).resize(),
      );
      return this.botService.OnHelp(ctx);
    } else {
      ctx.reply(
        `Yordam bo'limi`,
        Markup.keyboard([
          ['📊 reyting qoldirish', `📖 Menyularni ko'rish`, '🙋🏼‍♂️ Help'],
        ]).resize(),
      );
      return this.botService.onhelp(ctx);
    }
  }
  @Hears('Orqaga qaytish')
  Ortga(@Ctx() ctx: IMyContext) {
    if (ctx.from?.id == ChatID_1 || ctx.from?.id == ChatID_2) {
      ctx.session.stepAdmin = 'Menyu';
      ctx.reply(
        `Siz asosiy sahifadasiz`,
        Markup.keyboard([
          ['Reyting', 'Kunlik foydalanuvchilar', 'Menyu'],
        ]).resize(),
      );
    } else {
      ctx.reply(
        `Siz asosiy sahifaga o'tdingiz`,
        Markup.keyboard([
          ['📊 reyting qoldirish', `📖 Menyularni ko'rish`, '🙋🏼‍♂️ Help'],
        ]).resize(),
      );
    }
  }
  @On('photo')
  OnPhoto(@Ctx() ctx: IMyContext) {
    if (ctx.from?.id == ChatID_1 || ctx.from?.id == ChatID_2) {
      return this.botService.OnPhoto(ctx);
    } else {
      ctx.reply(`❌ Bu botga rasim yuborib bo'lmaydi`);
      return;
    }
  }

  @Action('Create')
  async createAction(@Ctx() ctx: IMyContext) {
    ctx.answerCbQuery();
    if (ctx.from?.id == ChatID_1 || ctx.from?.id == ChatID_2) {
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
    ctx.answerCbQuery()
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
    if (ctx.from?.id == ChatID_1 || ctx.from?.id == ChatID_2) {
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
        ctx.reply('❌ Bu menyu topilmadi.');
        return;
      }

      await this.prisma.menyu.delete({ where: { id } });

      await ctx.answerCbQuery();
      await ctx.reply(`✅ ${menu.name} nomli tavom o'chirildi.`);
    } catch (err) {
      await ctx.reply('❌ Xatolik yuz berdi.');
    }
  }
  @Action(/^UU:(\d+)$/)
  async deleteOvqat(@Ctx() ctx: IMyContext) {
    const id = Number(ctx.match[1]);

    await this.prisma.bugun.deleteMany({
      where: { menyuId: id },
    });

    await ctx.answerCbQuery(`❌ Ovqat o'chirildi`);
    await ctx.editMessageReplyMarkup(undefined);
  }

  @Action('save_menu')
  async saveMenu(@Ctx() ctx: IMyContext) {
    try {
      const data = ctx.session.data;
      if (!data?.name || !data?.price || !data?.description || !data?.image) {
        ctx.reply(`❌ Saqlash uchun to'liq ma'lumot yo'q!`);
        return;
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
      ctx.reply('❌ Xatolik yuz berdi');
      return;
    }
  }

  @Action('cancel_save')
  async cancelSave(@Ctx() ctx: IMyContext) {
    ctx.session.data = null;
    ctx.session.image = null;
    ctx.session.stepAdmin = 'Menyu';
    ctx.reply('❌ Saqlash bekor qilindi');
    return this.botService.onAdmineditMenyu(ctx);
  }

  //*********************************** Bugun qilinadigan ovqatlar ************************** */
  @Action('Bugun')
  async bugun(@Ctx() ctx: IMyContext) {
    ctx.answerCbQuery();
    return this.botService.Bugun(ctx);
  }
  @Action(/bugun:(\d+)/)
  async Bugungi(@Ctx() ctx: IMyContext) {
    if (ctx.session.SS == 'ss') {
      ctx.session.ovqatlar ??= [];
      ctx.answerCbQuery();
      try {
        let id = parseInt(ctx.match[1]);
        ctx.session.ovqatlar.push(id);
      } catch (error) {
        console.log(error);
        await ctx.reply('❌ Xatolik yuz berdi.');
      }
    }
  }

  @Hears('✅ Saqlash')
  Onsaqlash(@Ctx() ctx: IMyContext) {
    ctx.session.ovqatlar ??= [];
    if (ctx.session.SS == 'ss') {
      ctx.session.SS = null;
      if (ctx.session.ovqatlar.length !== 0) {
        return this.botService.Saqlash(ctx);
      } else {
        ctx.reply('🤷‍♂️ Siz hozircha hech narsa tanlamadingiz');
      }
    }
  }

  @Hears("💎 Saralangan ovqatlar")
  async saralangan(@Ctx() ctx: IMyContext) {
    try {
      const bugun = await this.prisma.bugun.findMany();

      if (bugun.length == 0) {
        await ctx.reply('🤷‍♂️ Bugun qilinadigan ovqatlar tanlanmagan!');
        return;
      }
      
      for (const item of bugun) {
        try {
          const menyu = await this.prisma.menyu.findUnique({
            where: { id: item.menyuId },
          });
  
          if (!menyu) continue;
  
          const text =
            `🍽 <b>${menyu.name || "Noma'lum ovqat"}</b>\n\n` +
            `⭐ Reyting: ${menyu.avg_reytig ?? 0}\n\n` +
            `💰 Narxi: ${menyu.price || "Noma'lum"} so'm\n\n` +
            `📝 ${menyu.description || 'Tavsif mavjud emas.'}\n\n` +
            `🆔 ID: ${item.id}`;
  
          if (menyu.image) {
            await ctx.replyWithPhoto(menyu.image, {
              caption: text,
              parse_mode: 'HTML',
            });
          } else {
            await ctx.reply(text, { parse_mode: 'HTML' });
          }
        } catch (err) {
          console.error(`Ovqatni yuborishda xato: ${item.id}`, err);
        }
      }
    } catch (error) {
      console.error(error);
      await ctx.reply("❌ Umumiy xatolik yuz berdi. Keyinroq urinib ko'ring.");
    }
  }
  
  

  @Hears("🗑 O'chirish")
  Ondelete(@Ctx() ctx: IMyContext) {
    return this.botService.saralanganlar(ctx);
  }

  //******************************************* ADMIN ************************************⬆️ */

  //************************************************ USER *******************************⬇️ */
  @Hears('📊 reyting qoldirish')
  async onReytingUser(@Ctx() ctx: IMyContext) {
    ctx.session.stepUser = 'reyting';
    await ctx.reply(`Menyu`, Markup.keyboard([['🔙 ortga']]).resize());
    return this.botService.onUserAllMenyu(ctx);
  }
  @Hears('🔙 ortga')
  onOrtga(@Ctx() ctx: IMyContext) {
    return this.botService.onOrtga(ctx);
  }

  @Hears('🙋🏼‍♂️ Help')
  onHelp(@Ctx() ctx: IMyContext) {
    if (ctx.from?.id == ChatID_1 || ctx.from?.id == ChatID_2) {
      return this.botService.OnHelp(ctx);
    } else {
      return this.botService.onhelp(ctx);
    }
  }
  @On('text')
  text(@Ctx() ctx: IMyContext) {
    return this.botService.textmessage(ctx);
  }

  @Action('ortga')
  async ortgamenu(@Ctx() ctx: IMyContext) {
    await ctx.reply(
      `Asosiy menyuga o'tdingiz`,
      Markup.keyboard([
        ['📊 reyting qoldirish', `📖 Menyularni ko'rish`, '🙋🏼‍♂️ Help'],
      ]).resize(),
    );
  }

  @Action(/^menu:.+/)
  async handleMenuSelection(@Ctx() ctx: IMyContext) {
    const menyuName = ctx.match[0].split(':')[1];

    const menyu = await this.prisma.menyu.findFirst({
      where: { name: { equals: menyuName, mode: 'insensitive' } },
    });

    if (!menyu) {
      ctx.reply(`❌ ${menyuName} menyusi topilmadi.`);
      return;
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
      ctx.reply('❌ Foydalanuvchi topilmadi.');
      return;
    }

    const menuName = ctx.session.menuName;

    if (!menuName) {
      ctx.reply('❌ Avval menyuni tanlang.');
      return;
    }

    const menu = await this.prisma.menyu.findFirst({
      where: { name: { equals: menuName, mode: 'insensitive' } },
    });

    if (!menu) {
      ctx.reply(`❌ ${menuName} menyusi topilmadi.`);
      return;
    }

    const existing = await this.prisma.reyting.findFirst({
      where: { user_id: user.id, menyu_id: menu.id },
    });

    if (existing) {
      ctx.reply(`❌ Siz "${menu.name}" uchun allaqachon reyting qoldirgansiz.`);
      return;
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
