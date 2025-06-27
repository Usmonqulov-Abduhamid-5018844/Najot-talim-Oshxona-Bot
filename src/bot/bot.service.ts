import { Injectable } from '@nestjs/common';
import { IMyContext } from 'src/helpers/bot.sessin';
import { PrismaService } from 'src/prisma/prisma.service';
import { Markup } from 'telegraf';

@Injectable()
export class BotService {
  constructor(private readonly prisma: PrismaService) {}

  async onStartAdmin(ctx: IMyContext) {
    try {
      await ctx.reply(
        `Botga xush kelibsiz ${ctx.from?.first_name}`,
        Markup.keyboard([["Admin Paneliga o'tish"]])
          .resize()
          .oneTime(),
      );
    } catch (error) {
      return ctx.reply('❌ Xatolik yuz berdi');
    }
  }

  async onAdmineditMenyu(ctx: IMyContext) {
    try {
      await ctx.reply(
        'Mahsulodlarni boshqarish',
        Markup.inlineKeyboard([
          [Markup.button.callback(`Ovqatlarni ko'rish`, `findAll`)],
          [Markup.button.callback(`Yangi Ovqat qo'shish`, `Create`)],
          [Markup.button.callback(`Ovqatlarni o'chirish`, `Delete`)],
        ]),
      );
    } catch (error) {
      return ctx.reply('❌ Xatolik yuz berdi');
    }
  }

  async onUserAllMenyu(ctx: IMyContext) {
    ctx.session.bishtex = null
    ctx.session.lagmon = null
    ctx.session.kfc = null
    ctx.session.jarkop = null
    ctx.session.osh = null
    ctx.session.somsa = null
    ctx.session.xonim = null
    ctx.session.data = null
    ctx.session.lagmon = null
    ctx.session.id = null
    ctx.session.image = null
    ctx.session.description = null
    try {
      await ctx.reply(
        `Ushbu menyudan birini tanyand`,
        Markup.inlineKeyboard([
          [Markup.button.callback('Osh', 'osh')],
          [Markup.button.callback('Xonim', 'xonim')],
          [Markup.button.callback('Jarkop', 'jarkop')],
          [Markup.button.callback('KFC', 'kfc')],
          [Markup.button.callback('Somsa', 'somsa')],
          [Markup.button.callback('Bishtex', 'bishtex')],
          [Markup.button.callback(`Lag'mon`, `lagmon`)],
          [Markup.button.callback('Ortga', 'ortga')],
        ]),
      );
    } catch (error) {
      return ctx.reply('Xatolik yuz berdi');
    }
  }

  async onStart(ctx: IMyContext) {
    ctx.session.bishtex = null
    ctx.session.lagmon = null
    ctx.session.kfc = null
    ctx.session.jarkop = null
    ctx.session.osh = null
    ctx.session.somsa = null
    ctx.session.xonim = null
    ctx.session.data = null
    ctx.session.lagmon = null
    ctx.session.id = null
    ctx.session.image = null
    ctx.session.description = null
    try {
      const user = await this.prisma.user.findFirst({
        where: { chat_id: ctx.from?.id },
      });
      if (!user) {
        await this.prisma.user.create({
          data: {
            first_name: ctx.from?.first_name,
            chat_id: ctx.from?.id,
            is_bot: ctx.from?.is_bot,
          },
        });
      }
      await ctx.reply(
        `Botga hush kelibsiz  ${ctx.from?.first_name}`,
        Markup.keyboard([['Menyu', 'Reyting', 'Help']])
          .resize()
          .oneTime(),
      );
    } catch (error) {
     await ctx.reply("❌ Xatolik yuz berdi?  keyinroq urinib qo'ying");
    }
  }

  async create(ctx: IMyContext) {
    try {
      await ctx.reply('Mahsulot nomini kiriting: ');
      ctx.session.name = 'name';
    } catch (error) {
      return await ctx.reply('❌ Xatolik yuz berdi');
    }
  }
  async onhelp(ctx: IMyContext) {
    ctx.session.bishtex = null
    ctx.session.lagmon = null
    ctx.session.kfc = null
    ctx.session.jarkop = null
    ctx.session.osh = null
    ctx.session.somsa = null
    ctx.session.xonim = null
    ctx.session.data = null
    ctx.session.lagmon = null
    ctx.session.id = null
    ctx.session.image = null
    ctx.session.description = null
    await ctx.reply(
      `📋 <b>Yordam bo'limi</b>\n
    Assalomu alaykum! Bu bot orqali siz oshxonadagi taomlar bilan tanishishingiz va ularga baho berishingiz mumkin.\n
    🧾 <b>Bot imkoniyatlari:</b>
    
    🍽 <b>Taomlar ro'yxati</b> - mavjud barcha taomlarni rasm, narx va tavsifi bilan ko'rishingiz mumkin.
    
    ⭐️ <b>Reyting berish</b> - har bir taomga 1 dan 5 gacha baho berishingiz mumkin.
    
    🏆 <b>Eng yuqori baholangan taomlar</b> - foydalanuvchilar tomonidan eng ko'p baholangan taomlarni ko'rishingiz mumkin.
    
    ❓ <b>Yordam</b> - ushbu bo'lim orqali botdan qanday foydalanishni bilib olasiz.
    
    Agar sizda savollar bo'lsa, admin bilan bog'laning: @Abduhamid_1852
    
    `,
      { parse_mode: 'HTML' },
    );
  }

  async onreyting(ctx: IMyContext) {
    try {
      const menyular = await this.prisma.menyu.findMany({
        orderBy: { avg_reytig: 'desc' },
      });

      if (!menyular.length) {
        await ctx.reply('🛑 Hozircha ovqatlar mavjud emas.');
        return;
      }

      for (const item of menyular) {
        const caption = `🍽 <b>${item.name}</b>\n\n💰 Narxi: ${item.price} so'm\n\n📝 Tavsif: ${item.description}\n\n📈 reyting: ${item.avg_reytig}\n\n🆔 ID: ${item.id}`;

        if (item.image) {
          await ctx.replyWithPhoto(item.image, {
            caption,
            parse_mode: 'HTML',
          });
        } else {
          await ctx.reply(caption, { parse_mode: 'HTML' });
        }
      }
    } catch (error) {
      await ctx.reply("❌ Xatolik yuz berdi?  Keyinroq urinib ko'ring.");
    }
    return;
  }
  async textmessage(ctx: IMyContext) {
    ctx.session.data ??= {};

    if (
      ctx.session.name === 'name' &&
      ctx.message &&
      'text' in ctx.message &&
      typeof ctx.message.text === 'string'
    ) {
      ctx.session.data.name = ctx.message.text;
      ctx.session.name = null;
      ctx.session.price = 'price';
      await ctx.reply('📥 Mahsulot narxini kiriting:');
      return;
    }

    if (
      ctx.session.price === 'price' &&
      ctx.message &&
      'text' in ctx.message &&
      typeof ctx.message.text === 'string'
    ) {
      const price = parseInt(ctx.message.text);
      if (isNaN(price)) {
        await ctx.reply('❌ Iltimos, faqat raqam kiriting!');
        return;
      }
      ctx.session.data.price = price;
      ctx.session.price = null;
      ctx.session.description = 'description';
      await ctx.reply('📥 Mahsulot haqida tavsif kiriting:');
      return;
    }

    if (
      ctx.session.description === 'description' &&
      ctx.message &&
      'text' in ctx.message &&
      typeof ctx.message.text === 'string'
    ) {
      ctx.session.data.description = ctx.message.text;
      ctx.session.description = null;
      ctx.session.image = 'img';
      await ctx.reply('📸 Mahsulot rasmini yuboring:');
      return;
    }
    if (ctx.session.id == 'id' && ctx.message && 'text' in ctx.message) {
      try {
        const id = parseInt(ctx.message.text);

        if (isNaN(id)) {
          await ctx.reply('❌ Iltimos,faqat id kiriting!');
          return;
        }
        const R = await this.prisma.menyu.findUnique({ where: { id } });
        if (!R) {
          ctx.reply(`${id} Bunday id topilmadi`);
          return;
        }
        await this.prisma.menyu.delete({ where: { id: R.id } });
        ctx.reply("✅  Muvofiyaqatli o'chirildi");
        ctx.session.id = null
        return;
      } catch (error) {
        ctx.reply(`❌ Xatolik yoz berdi?  keyinroq urinib ko'ring`);
      }
    }
    //*************************************  MENU  **********************************

    if (ctx.session.osh == 'osh' && ctx.message && 'text' in ctx.message) {
      try {
        const Menyu = await this.prisma.menyu.findFirst({
          where: { name: 'Osh' },
        });
        if (!Menyu) {
          await ctx.reply(
            "❌ Kechirasiz siz tanlagan taom bazadan vaxtinchalik o'chirilgan",
          );
          return;
        }
        const ball = parseInt(ctx.message.text);
        if (isNaN(ball)) {
          await ctx.reply('❌ Iltimos faqat raqam kiriting!');
          return;
        }
        if (!(ball >= 1 && ball <= 5)) {
          await ctx.reply(
            '❌ Reytingniga 1 dan 5 gachga oraliqda raqam kritish mumkin',
          );
          return;
        }
        const user = await this.prisma.user.findFirst({
          where: { chat_id: ctx.from?.id },
        });
        if (!user) {
          await ctx.reply('❌ User malumotlari tipilmadi');
          return;
        }
        const reyting = await this.prisma.reyting.findFirst({
          where: { user_id: user.id, menyu_id: Menyu.id },
        });
        if (reyting) {
          await ctx.reply(
            '❌ Siz avval ushbu tavom uchun reyting qoldirgansiz',
          );
          return;
        }
        await this.prisma.reyting.create({
          data: { user_id: user.id, menyu_id: Menyu.id, ball: ball },
        });
      } catch (error) {
        await ctx.reply(`❌ Xatolik yoz berdi?  keyinroq urinib ko'ring`);
        return
      }
      ctx.session.osh = null
    }

    if (ctx.session.xonim == 'xonim' && ctx.message && 'text' in ctx.message) {
      try {
        const Menyu = await this.prisma.menyu.findFirst({
          where: { name: 'Xonim' },
        });
        if (!Menyu) {
          await ctx.reply(
            "❌ Kechirasiz siz tanlagan taom bazadan vaxtinchalik o'chirilgan",
          );
          return;
        }
        const ball = parseInt(ctx.message.text);
        if (isNaN(ball)) {
          await ctx.reply('❌ Iltimos faqat raqam kiriting!');
          return;
        }
        if (!(ball >= 1 && ball <= 5)) {
          await ctx.reply(
            '❌ Reytingniga 1 dan 5 gachga oraliqda raqam kritish mumkin',
          );
          return;
        }
        const user = await this.prisma.user.findFirst({
          where: { chat_id: ctx.from?.id },
        });
        if (!user) {
          await ctx.reply('❌ User malumotlari tipilmadi');
          return;
        }
        const reyting = await this.prisma.reyting.findFirst({
          where: { user_id: user.id, menyu_id: Menyu.id },
        });
        if (reyting) {
          await ctx.reply(
            '❌ Siz avval ushbu tavom uchun reyting qoldirgansiz',
          );
          return;
        }
        await this.prisma.reyting.create({
          data: { user_id: user.id, menyu_id: Menyu.id, ball: ball },
        });
      } catch (error) {
        await ctx.reply(`❌ Xatolik yoz berdi?  keyinroq urinib ko'ring`);
        return
      }
      ctx.session.xonim = null
    }

    if (ctx.session.jarkop == 'jarkop' && ctx.message && 'text' in ctx.message) {
      try {
        const Menyu = await this.prisma.menyu.findFirst({
          where: { name: 'Jarkop' },
        });
        if (!Menyu) {
          await ctx.reply(
            "❌ Kechirasiz siz tanlagan taom bazadan vaxtinchalik o'chirilgan",
          );
          return;
        }
        const ball = parseInt(ctx.message.text);
        if (isNaN(ball)) {
          await ctx.reply('❌ Iltimos faqat raqam kiriting!');
          return;
        }
        if (!(ball >= 1 && ball <= 5)) {
          await ctx.reply(
            '❌ Reytingniga 1 dan 5 gachga oraliqda raqam kritish mumkin',
          );
          return;
        }
        const user = await this.prisma.user.findFirst({
          where: { chat_id: ctx.from?.id },
        });
        if (!user) {
          await ctx.reply('❌ User malumotlari tipilmadi');
          return;
        }
        const reyting = await this.prisma.reyting.findFirst({
          where: { user_id: user.id, menyu_id: Menyu.id },
        });
        if (reyting) {
          await ctx.reply(
            '❌ Siz avval ushbu tavom uchun reyting qoldirgansiz',
          );
          return;
        }
        await this.prisma.reyting.create({
          data: { user_id: user.id, menyu_id: Menyu.id, ball: ball },
        });
        ctx.session.jarkop = null
      } catch (error) {
        await ctx.reply(`❌ Xatolik yoz berdi?  keyinroq urinib ko'ring`);
        return
      }
    }

    if (ctx.session.kfc == 'kfc' && ctx.message && 'text' in ctx.message) {
      try {
        const Menyu = await this.prisma.menyu.findFirst({
          where: { name: 'KFC' },
        });
        if (!Menyu) {
          await ctx.reply(
            "❌ Kechirasiz siz tanlagan taom bazadan vaxtinchalik o'chirilgan",
          );
          return;
        }
        const ball = parseInt(ctx.message.text);
        if (isNaN(ball)) {
          await ctx.reply('❌ Iltimos faqat raqam kiriting!');
          return;
        }
        if (!(ball >= 1 && ball <= 5)) {
          await ctx.reply(
            '❌ Reytingniga 1 dan 5 gachga oraliqda raqam kritish mumkin',
          );
          return;
        }
        const user = await this.prisma.user.findFirst({
          where: { chat_id: ctx.from?.id },
        });
        if (!user) {
          await ctx.reply('❌ User malumotlari tipilmadi');
          return;
        }
        const reyting = await this.prisma.reyting.findFirst({
          where: { user_id: user.id, menyu_id: Menyu.id },
        });
        if (reyting) {
          await ctx.reply(
            '❌ Siz avval ushbu tavom uchun reyting qoldirgansiz',
          );
          return;
        }
        await this.prisma.reyting.create({
          data: { user_id: user.id, menyu_id: Menyu.id, ball: ball },
        });
        ctx.session.kfc = null
      } catch (error) {
        await ctx.reply(`❌ Xatolik yoz berdi?  keyinroq urinib ko'ring`);
        return
      }
    }
    
    if (ctx.session.somsa == 'somsa' && ctx.message && 'text' in ctx.message) {
      try {
        const Menyu = await this.prisma.menyu.findFirst({
          where: { name: 'Somsa' },
        });
        if (!Menyu) {
          await ctx.reply(
            "❌ Kechirasiz siz tanlagan taom bazadan vaxtinchalik o'chirilgan",
          );
          return;
        }
        const ball = parseInt(ctx.message.text);
        if (isNaN(ball)) {
          await ctx.reply('❌ Iltimos faqat raqam kiriting!');
          return;
        }
        if (!(ball >= 1 && ball <= 5)) {
          await ctx.reply(
            '❌ Reytingniga 1 dan 5 gachga oraliqda raqam kritish mumkin',
          );
          return;
        }
        const user = await this.prisma.user.findFirst({
          where: { chat_id: ctx.from?.id },
        });
        if (!user) {
          await ctx.reply('❌ User malumotlari tipilmadi');
          return;
        }
        const reyting = await this.prisma.reyting.findFirst({
          where: { user_id: user.id, menyu_id: Menyu.id },
        });
        if (reyting) {
          await ctx.reply(
            '❌ Siz avval ushbu tavom uchun reyting qoldirgansiz',
          );
          return;
        }
        await this.prisma.reyting.create({
          data: { user_id: user.id, menyu_id: Menyu.id, ball: ball },
        });
        ctx.session.somsa = null
      } catch (error) {
        await ctx.reply(`❌ Xatolik yoz berdi?  keyinroq urinib ko'ring`);
        return
      }
    }

    if (ctx.session.bishtex == 'bishtex' && ctx.message && 'text' in ctx.message) {
      try {
        const Menyu = await this.prisma.menyu.findFirst({
          where: { name: 'Bishtex' },
        });
        if (!Menyu) {
          await ctx.reply(
            "❌ Kechirasiz siz tanlagan taom bazadan vaxtinchalik o'chirilgan",
          );
          return;
        }
        const ball = parseInt(ctx.message.text);
        if (isNaN(ball)) {
          await ctx.reply('❌ Iltimos faqat raqam kiriting!');
          return;
        }
        if (!(ball >= 1 && ball <= 5)) {
          await ctx.reply(
            '❌ Reytingniga 1 dan 5 gachga oraliqda raqam kritish mumkin',
          );
          return;
        }
        const user = await this.prisma.user.findFirst({
          where: { chat_id: ctx.from?.id },
        });
        if (!user) {
          await ctx.reply('❌ User malumotlari tipilmadi');
          return;
        }
        const reyting = await this.prisma.reyting.findFirst({
          where: { user_id: user.id, menyu_id: Menyu.id },
        });
        if (reyting) {
          await ctx.reply(
            '❌ Siz avval ushbu tavom uchun reyting qoldirgansiz',
          );
          return;
        }
        await this.prisma.reyting.create({
          data: { user_id: user.id, menyu_id: Menyu.id, ball: ball },
        });
        ctx.session.bishtex = null
      } catch (error) {
        await ctx.reply(`❌ Xatolik yoz berdi?  keyinroq urinib ko'ring`);
        return
      }
    }

    if (ctx.session.lagmon == 'lagmon' && ctx.message && 'text' in ctx.message) {
      try {
        const Menyu = await this.prisma.menyu.findFirst({
          where: { name: "Lag'mon" },
        });
        if (!Menyu) {
          await ctx.reply(
            "❌ Kechirasiz siz tanlagan taom bazadan vaxtinchalik o'chirilgan",
          );
          return;
        }
        const ball = parseInt(ctx.message.text);
        if (isNaN(ball)) {
          await ctx.reply('❌ Iltimos faqat raqam kiriting!');
          return;
        }
        if (!(ball >= 1 && ball <= 5)) {
          await ctx.reply(
            '❌ Reytingniga 1 dan 5 gachga oraliqda raqam kritish mumkin',
          );
          return;
        }
        const user = await this.prisma.user.findFirst({
          where: { chat_id: ctx.from?.id },
        });
        if (!user) {
          await ctx.reply('❌ User malumotlari tipilmadi');
          return;
        }
        const reyting = await this.prisma.reyting.findFirst({
          where: { user_id: user.id, menyu_id: Menyu.id },
        });
        if (reyting) {
          await ctx.reply(
            '❌ Siz avval ushbu tavom uchun reyting qoldirgansiz',
          );
          return;
        }
        await this.prisma.reyting.create({
          data: { user_id: user.id, menyu_id: Menyu.id, ball: ball },
        });
        ctx.session.lagmon = null
      } catch (error) {
        await ctx.reply(`❌ Xatolik yoz berdi?  keyinroq urinib ko'ring`);
        return
      }
    }
    return
  }

  async OnPhoto(ctx: IMyContext) {
    ctx.session.data ??= {};

    if (ctx.session.image === 'img' && ctx.message && 'photo' in ctx.message) {
      const photos = ctx.message.photo;
      const bestPhoto = photos[photos.length - 1];
      const fileId = bestPhoto.file_id;

      ctx.session.data.image = fileId;

      const { name, price, description, image } = ctx.session.data;

      if (name && price && description && image) {
        const yangi = await this.prisma.menyu.create({
          data: { name, price, description, image },
        });

        await ctx.replyWithPhoto(image, {
          caption: `✅ Saqlandi!\n🍽 <b>${name}</b>\n💰 ${price} so'm\n📝 ${description}`,
          parse_mode: 'HTML',
        });
        return;
      } else {
        return await ctx.reply("❌ Ma'lumotlar to'liq emas!");
      }
    }
    ctx.session.data = null;
    ctx.session.image = null;
    return;
  }

  async findAll(ctx: IMyContext) {
    try {
      const menyular = await this.prisma.menyu.findMany({
        orderBy: { avg_reytig: 'desc' },
      });

      if (!menyular.length) {
        await ctx.reply('🛑 Hozircha ovqatlar mavjud emas.');
        return;
      }

      for (const item of menyular) {
        const caption = `🍽 <b>${item.name}</b>\n\n💰 Narxi: ${item.price} so'm\n\n📝 Tavsif: ${item.description}\n\n📈 reyting: ${item.avg_reytig}\n\n🆔 ID: ${item.id}`;

        if (item.image) {
          await ctx.replyWithPhoto(item.image, {
            caption,
            parse_mode: 'HTML',
          });
        } else {
          await ctx.reply(caption, { parse_mode: 'HTML' });
        }
      }
    } catch (error) {
      await ctx.reply(
        "❗️ Xatolik yuz berdi?  Keyinroq urinib ko'ring.",
        Markup.keyboard([['Orqaga qaytish']])
          .resize()
          .oneTime(),
      );
    }
    return;
  }

  async delet(ctx: IMyContext) {
    try {
      ctx.reply("O'chirmiqchi bo'lgan ovqat id sini kriting: ");
      ctx.session.id = 'id';
    } catch (error) {
      return ctx.reply("❌ Xatolik yuz berdi?  Keyinroq urinib ko'ring.");
    }
  }

  async osh(ctx: IMyContext) {
    ctx.reply(
      "Siz Osh taomini tanladingiz. Reyting bering (1-5). Eng yuqori baholangan taomlar ertasi kuni oshxonada taqdim etiladi",
    );
    ctx.session.osh = 'osh';
  }

  async xonim(ctx: IMyContext) {
    ctx.reply(
      "Siz Xonim taomini tanladingiz. Reyting bering (1-5). Eng yuqori baholangan taomlar ertasi kuni oshxonada taqdim etiladi",
    );
    ctx.session.xonim = 'xonim';
  }

  async jarkop(ctx: IMyContext) {
    ctx.reply(
      "Siz jarkop taomini tanladingiz. Reyting bering (1-5). Eng yuqori baholangan taomlar ertasi kuni oshxonada taqdim etiladi",
    );
    ctx.session.jarkop = 'jarkop';
  }

  async kfc(ctx: IMyContext) {
    ctx.reply(
      "Siz KFC taomini tanladingiz. Reyting bering (1-5). Eng yuqori baholangan taomlar ertasi kuni oshxonada taqdim etiladi",
    );
    ctx.session.kfc = 'kfc';
  }

  async somsa(ctx: IMyContext) {
    ctx.reply(
      "Siz somsa taomini tanladingiz. Reyting bering (1-5). Eng yuqori baholangan taomlar ertasi kuni oshxonada taqdim etiladi",
    );
    ctx.session.somsa = 'somsa';
  }

  async bishtex(ctx: IMyContext) {
    ctx.reply(
      "Siz bishtex taomini tanladingiz. Reyting bering (1-5). Eng yuqori baholangan taomlar ertasi kuni oshxonada taqdim etiladi",
    );
    ctx.session.bishtex = 'bishtex';
  }

  async lagmon(ctx: IMyContext) {
    ctx.reply(
      "Siz lag'mon taomini tanladingiz. Reyting bering (1-5). Eng yuqori baholangan taomlar ertasi kuni oshxonada taqdim etiladi",
    );
    ctx.session.lagmon = 'lagmon';
  }

}
