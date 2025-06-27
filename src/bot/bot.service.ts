import { Injectable } from '@nestjs/common';
import { strict } from 'assert';
import { Ctx, Phone } from 'nestjs-telegraf';
import { CerateInterface, IMyContext } from 'src/helpers/bot.sessin';
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
    try {
      await ctx.reply(
        `Ushbu menyudan birini tanyand`,
        Markup.inlineKeyboard([
          [Markup.button.callback('Osh', 'osh')],
          [Markup.button.callback('Xonim', 'xonim')],
          [Markup.button.callback('Jarkop', 'jarkop')],
          [Markup.button.callback('KFC', ' kfs')],
          [Markup.button.callback('Somsa', ' somsa')],
          [Markup.button.callback('Bishtex', ' bishtex')],
          [Markup.button.callback(`Lag'mon`, ` lag'mon`)],
        ]),
      );
    } catch (error) {
      return ctx.reply('Xatolik yuz berdi');
    }
  }

  async onStart(ctx: IMyContext) {
    try {
      await ctx.reply(
        `Botga hush kelibsiz  ${ctx.from?.first_name}`,
        Markup.keyboard([['Menyu']])
          .resize()
          .oneTime(),
      );
    } catch (error) {}
  }

  async create(ctx: IMyContext) {
    try {
      await ctx.reply('Mahsulot nomini kiriting: ');
      ctx.session.name = 'name';
    } catch (error) {
      return await ctx.reply('❌ Xatolik yuz berdi');
    }
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
        return;
      } catch (error) {
        console.log(error);
        ctx.reply(`❌ Xatolik yoz berdi?  keyinroq urinib ko'ring`);
      }
    }
    return;
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
        if (!item.image) {
          await ctx.reply(`⚠️ ${item.name} uchun rasm topilmadi.`);
          continue;
        }

        await ctx.replyWithPhoto(item.image, {
          caption: `🍽 <b>${item.name}</b>\n\n💰 Narxi: ${item.price} so'm\n\n📝 Tavsif: ${item.description}\n\n📈 reyting: ${item.avg_reytig}\n\n🆔 ID: ${item.id}`,
          parse_mode: 'HTML',
        });
      }
    } catch (error) {
      await ctx.reply("❗️ Xatolik yuz berdi?  Keyinroq urinib ko'ring.");
      ctx.reply(
        'Ortga',
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
      "Siz Oshni tanladingiz ushbu tavom uchun reyting qoldiring va reyting g'oliblari keyingi kuni oshxonada sizni qarshi oladi.(eslatma )",
    );
  }
}
