import { Injectable } from '@nestjs/common';
import { IMyContext } from 'src/helpers/bot.sessin';
import { PrismaService } from 'src/prisma/prisma.service';
import { Markup } from 'telegraf';

@Injectable()
export class BotService {
  constructor(private readonly prisma: PrismaService) {}

  async onStartAdmin(ctx: IMyContext) {
    try {
      ctx.session.stepAdmin = 'Asosiy';
      ctx.reply(
        `Siz asosiy sahifadasiz`,
        Markup.keyboard([
          ['Reyting', 'Kunlik foydalanuvchilar', 'Menyu'],
        ]).resize(),
      );
    } catch (error) {
       ctx.reply('❌ Xatolik yuz berdi');
       return
    }
  }

  async onAdmineditMenyu(ctx: IMyContext) {
    try {
      ctx.session.data = null;
      ctx.session.id = null;
      ctx.session.image = null;
      ctx.session.description = null;
      await ctx.reply(
        'Mahsulodlarni boshqarish',
        Markup.inlineKeyboard([
          [Markup.button.callback(`Ovqatlarni ko'rish`, `findAll`)],
          [Markup.button.callback(`Yangi Ovqat qo'shish`, `Create`)],
          [Markup.button.callback(`Ovqatlarni o'chirish`, `Delete`)],
          [Markup.button.callback(`Bugun qilinadigan ovqatlar`,"Bugun")]
        ]),
      );
    } catch (error) {
       ctx.reply('❌ Xatolik yuz berdi');
       return
    }
  }

  async onStart(ctx: IMyContext) {
    ctx.session.data = null;
    ctx.session.id = null;
    ctx.session.image = null;
    ctx.session.description = null;
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
      ctx.session.stepUser = 'menyu';
      await ctx.reply(
        `Botga hush kelibsiz ${ctx.from?.first_name || 'Hurmatli foydalanuvchi'}`,
        Markup.keyboard([
          ['📊 reyting qoldirish', `📖 Menyularni ko'rish`, '🙋🏼‍♂️ Help'],
        ]).resize(),
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
       await ctx.reply('❌ Xatolik yuz berdi');
       return
    }
  }
  async Kunlik(ctx: IMyContext) {
    try {
      const kunlikFoydalanuvchilar = await this.prisma.reyting.findMany({
        select: {
          user_id: true,
        },
        distinct: ['user_id'],
      });

      const soni = kunlikFoydalanuvchilar.length;

      ctx.reply(`📊 Bugungi foydalanuvchilar soni: ${soni} ta`);
      return;
    } catch (error) {
       ctx.reply(
        `❌ Xatolik yuz berdi. Iltimos, keyinroq urinib ko'ring.`,
      );
      return
    }
  }

  //******************************  USER  ************************/

  async onUserAllMenyu(ctx: IMyContext) {
    ctx.session.id = null;
    ctx.session.image = null;
    ctx.session.description = null;
    try {
      const menyular = await this.prisma.menyu.findMany({
        orderBy: { id: 'asc' },
      });

      if (!menyular.length) {
         ctx.reply('🛑 Hozircha xech qanday menyu mavjud eman.');
         return
      }

      const buttonlar = menyular.map((menu) => [
        Markup.button.callback(menu.name!, `menu:${menu.name!.toLowerCase()}`),
      ]);

      buttonlar.push([Markup.button.callback('Ortga', 'ortga')]);

      await ctx.reply(
        `Ushbu menyulardan birini tanlang 👇`,
        Markup.inlineKeyboard(buttonlar),
      );
    } catch (error) {
      console.error(error);
       ctx.reply(`❌ Xatolik yuz berdi. Qaytadan urinib ko'ring.`);
       return
    }
  }

  async onhelp(ctx: IMyContext) {
    ctx.session.id = null;
    ctx.session.image = null;
    ctx.session.description = null;
    await ctx.reply(
      `📋 <b>Yordam bo'limi</b>\n
    Assalomu alaykum! ${ctx.from?.first_name || 'Hurmatli foydalanuvchi'}   Bu bot orqali siz oshxonadagi taomlar bilan tanishishingiz va ularga baho berishingiz mumkin.\n
    🧾 <b>Bot imkoniyatlari:</b>
    
    🍽 <b>Taomlar ro'yxati</b> - mavjud barcha taomlarni rasm, narx va tavsifi bilan ko'rishingiz mumkin.
    
    ⭐️ <b>Reyting berish</b> - har bir taomga 1 dan 5 gacha baho berishingiz mumkin.
    
    🏆 <b>Eng yuqori baholangan taomlar</b> - foydalanuvchilar tomonidan eng ko'p baholangan taomlarni ko'rishingiz mumkin.
    
    ❓ <b>Yordam</b> - ushbu bo'lim orqali botdan qanday foydalanishni bilib olasiz.
    
    Agar sizda savollar bo'lsa, admin bilan bog'laning: @Abduhamid_1852 Yoki  @lm_faxa
    
    `,
      { parse_mode: 'HTML' },
    );
  }

  async OnHelp(ctx: IMyContext) {
    ctx.session.data = null;
    ctx.session.id = null;
    ctx.session.image = null;
    ctx.session.description = null;
    await ctx.reply(
      `📋 <b>Admin Yordam Bo'limi</b>\n
    Assalomu alaykum, ${ctx.from?.first_name || 'Hurmatli foydalanuvchi'}!\n
    Siz admin sifatida quyidagi imkoniyatlarga egasiz:
    
    👨‍🍳 <b>Yangi ovqat qo'shish:</b> menyuga yangi taomlar, ularning nomi, narxi, tavsifi va rasm bilan qo'shishingiz mumkin.
    
    🗑 <b>Ovqatni o'chirish:</b> mavjud menyudan istalgan taomni o'chirishingiz mumkin.
    
    📋 <b>Menyu ro'yxatini ko'rish:</b> barcha mavjud taomlarni to'liq ro'yxati bilan ko'rishingiz mumkin.
    
    📊 <b>Reyting statistikasi:</b> foydalanuvchilar tomonidan eng ko'p baho berilgan taomlarni ko'rib, oshxonada shu taomni tayyorlash haqida qaror qabul qilishingiz mumkin.
    
    🛠 <b>To'liq nazorat:</b> foydalanuvchilar faoliyati, reytinglar va taomlar haqida umumiy nazoratga egasiz.
    
    Agar sizga texnik yordam kerak bo'lsa yoki muammo yuzaga kelsa, quyidagi kontakt orqali bog'laning: @Abduhamid_1852 Yoki @lm_faxa
    `,
      { parse_mode: 'HTML' },
    );
  }

  async onOrtga(ctx: IMyContext) {
    try {
      if (ctx.session.stepUser == 'menyu') {
        await ctx.reply(
          `Siz menyu oynasidasiz`,
          Markup.keyboard([
            ['📊 reyting qoldirish', `📖 Menyularni ko'rish`, "🙋🏼‍♂️ Help"],
          ]).resize(),
        );
        return;
      }
      if (ctx.session.stepUser == 'reyting') {
        await ctx.reply(
          `Siz menyu oynasiga o'tdingiz`,
          Markup.keyboard([
            ['📊 reyting qoldirish', `📖 Menyularni ko'rish`, "🙋🏼‍♂️ Help"],
          ]).resize(),
        );
        return;
      }
      if ((ctx.session.stepUser = 'Tavom')) {
        return this.onUserAllMenyu(ctx);
      }
    } catch (error) {
      ctx.reply("❌ Xatolik yuz berdi?  Keyinrok urinib ko'ring");
    }
  }

  async onreyting(ctx: IMyContext) {
    try {
      ctx.session.stepUser = 'reyting';
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
  async onInfo(ctx: IMyContext) {
    ctx.session.id = null;
    ctx.session.image = null;
    ctx.session.description = null;
    try {
      ctx.reply(
        `👤 <b>Foydalanuvchi ma'lumotlari</b>\n\n` +
          `📛 <b>Username:</b> @${ctx.from?.username || `Noma'lum`}\n` +
          `🧍 <b>Ismi:</b> ${ctx.from?.first_name || `Noma'lum`}\n` +
          `🧍‍♂️ <b>Familiyasi:</b> ${ctx.from?.last_name || `Yo'q`}\n` +
          `🆔 <b>Chat ID:</b> ${ctx.from?.id}\n` +
          `🌐 <b>Til kodi:</b> ${ctx.from?.language_code || `Noma'lum`}\n` +
          `💎 <b>Premium foydalanuvchi:</b> ${ctx.from?.is_premium ? 'Ha' : `Yo'q`}\n` +
          `🤖 <b>Botmi:</b> ${ctx.from?.is_bot ? 'Ha' : `Yo'q`}`,
        { parse_mode: 'HTML' },
      );
    } catch (error) {
      ctx.reply('❌ Xatolik yuz berdi');
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
      await ctx.reply(
        'Davom etamiz...',
        Markup.keyboard([['Ortga']])
          .resize()
          .persistent(),
      );
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
      await ctx.reply(
        'Davom etamiz...',
        Markup.keyboard([['Ortga']])
          .resize()
          .persistent(),
      );
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
      await ctx.reply(
        'Davom etamiz...',
        Markup.keyboard([['Ortga']])
          .resize()
          .persistent(),
      );
      await ctx.reply('📸 Mahsulot rasmini yuboring:');
      return;
    }
    if (ctx.session.image == 'img') {
      await ctx.reply(
        'Davom etamiz...',
        Markup.keyboard([['Ortga']])
          .resize()
          .persistent(),
      );
      await ctx.reply('📸 Mahsulot rasmini yuboring:');
      return;
    }
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
        await ctx.replyWithPhoto(image, {
          caption: `📝 Ma'lumotlar:\n🍽 <b>${name}</b>\n💰 ${price} so'm\n📄 ${description}\n\n✅ Saqlashni xohlaysizmi?`,
          parse_mode: 'HTML',
          ...Markup.inlineKeyboard([
            [Markup.button.callback('✅ Saqlash', 'save_menu')],
            [Markup.button.callback('🔙 Bekor qilish', 'cancel_save')],
          ]),
        });
        return;
      } else {
         await ctx.reply("❌ Ma'lumotlar to'liq emas!");
         return
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
      await ctx.reply(
        "📢 <b>Bugungi reyting g'oliblari yuqorida joylashgan!</b>",
        { parse_mode: 'HTML' },
      );
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

  async Bugun(ctx: IMyContext) {
    try {
      const menyular = await this.prisma.menyu.findMany();

      if (!menyular.length) {
        await ctx.reply('🛑 Hozircha ovqatlar mavjud emas.');
        return;
      }
      ctx.session.stepAdmin = "bugun"
      ctx.session.SS = "ss"
      const buttons = menyular.map((menu) => [
        Markup.button.callback(menu.name || 'Nomalum', `bugun:${menu.id}`),
      ]);

      await ctx.reply(
        "📃 Bugun qilinatigan ovqatlarni tanlayng:",
        Markup.inlineKeyboard(
          menyular.map((menu) => [
            Markup.button.callback(
              menu.name?.trim() ? menu.name : `ID:${menu.id}`,
              `bugun:${menu.id}`,
            ),
          ]),
        ),
      );
      ctx.answerCbQuery()
      ctx.reply("Menyu",Markup.keyboard([["✅ Saqlash", "Ortga"],["💎 Saralangan ovqatlar","🗑 O'chirish"]
      ]).resize())
    } catch (error) {
       ctx.reply("❌ Xatolik yuz berdi? Keyinroq urinib ko'ring.");
       return
    }
  }

  async Saqlash(ctx: IMyContext) {
    try {
      const mavjudlar = await this.prisma.bugun.findMany();
      const mavjudIds = new Set(mavjudlar.map(i => i.menyuId));
      const sessiyaOvqatlar = ctx.session.ovqatlar || [];
      const yangiOvqatlar = sessiyaOvqatlar.filter(id => !mavjudIds.has(id));
      
      if (yangiOvqatlar.length > 0) {
        await Promise.all(
          yangiOvqatlar.map(id => 
            this.prisma.bugun.create({ data: { menyuId: id } })
          )
        );
        ctx.session.ovqatlar = [];
        ctx.reply("✅ Yangi ma'lumotlar saqlandi 🎉");
      } else {
        ctx.reply("ℹ️ Bu ovqat allaqachon tanlangan!");
      }
  
    } catch (error) {
      console.error(error);
      ctx.reply("❌ Xatolik yuz berdi. Keyinroq urinib ko'ring.");
    }
  }
  

  async delet(ctx: IMyContext) {
    try {
      const menyular = await this.prisma.menyu.findMany();

      if (!menyular.length) {
        await ctx.reply('🛑 Hozircha ovqatlar mavjud emas.');
        return;
      }

      const buttons = menyular.map((menu) => [
        Markup.button.callback(menu.name || 'Nomalum', `del:${menu.id}`),
      ]);

      await ctx.answerCbQuery();
      await ctx.reply(
        "🗑 O'chirmoqchi bo'lgan ovqatni tanlang:",
        Markup.inlineKeyboard(
          menyular.map((menu) => [
            Markup.button.callback(
              menu.name?.trim() ? menu.name : `ID:${menu.id}`,
              `del:${menu.id}`,
            ),
          ]),
        ),
      );
    } catch (error) {
       ctx.reply("❌ Xatolik yuz berdi? Keyinroq urinib ko'ring.");
       return
    }
  }

  async sendReytingPrompt(ctx: IMyContext, menuName: string) {
    await ctx.answerCbQuery();

    await ctx.reply(
      `🍽 Siz <b>${menuName}</b> taomini tanladingiz.\nReyting bering (1-5):`,
      {
        parse_mode: 'HTML',
        reply_markup: Markup.inlineKeyboard([
          [
            Markup.button.callback('1', 'reyting:1'),
            Markup.button.callback('2', 'reyting:2'),
            Markup.button.callback('3', 'reyting:3'),
            Markup.button.callback('4', 'reyting:4'),
            Markup.button.callback('5', 'reyting:5'),
          ],
        ]).reply_markup,
      },
    );
  }


  async saralanganlar(ctx: IMyContext) {
    try {
      const bugungiOvqatlar = await this.prisma.bugun.findMany();
  
      if (!bugungiOvqatlar.length) {
        await ctx.reply('🤷‍♂️ Bugun uchun hech qanday ovqat tanlanmagan.');
        return;
      }

      const menyuIds = bugungiOvqatlar.map(item => item.menyuId);
  
      const menyular = await this.prisma.menyu.findMany({
        where: { id: { in: menyuIds } },
      });
  
      if (!menyular.length) {
        await ctx.reply("🛑 Tanlangan menyular topilmadi.");
        return;
      }
  
      const buttons = menyular.map(menu => [
        Markup.button.callback(
          `🗑 ${menu.name || 'Noma\'lum'}`,
          `UU:${menu.id}`
        )
      ]);
  
      await ctx.reply(
        "🗑 O'chirish uchun saralangan ovqatni tanlang:",
        Markup.inlineKeyboard(buttons)
      );
    } catch (error) {
      console.error(error);
      await ctx.reply("❌ Xatolik yuz berdi. Keyinroq urinib ko'ring.");
    }
  }
  
}
