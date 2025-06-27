import { Controller } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from 'src/prisma/prisma.service';

@Controller('auto-loud')
export class AutoLoudController {
  constructor(private readonly prisma: PrismaService) {}
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT, {
    timeZone: 'Asia/Tashkent',
  })
  async avg_Reyting() {
    try {
      let sum: number = 0;
      let sch: number = 0;
      let Avg: number = 0;
      const SetReyting = new Set<number>();
      const Reyting = await this.prisma.reyting.findMany();
      for (let R of Reyting) {
        SetReyting.add(R.menyu_id);
      }
      for (let menyu of SetReyting) {
        sum = 0;
        sch = 0;
        Avg = 0;
        for (let i of Reyting) {
          if (menyu == i.menyu_id) {
            sch += 1;
            sum += Number(i.ball);
          }
        }
        Avg = parseFloat((sum / sch).toFixed(1));
        await this.prisma.menyu.update({
          where: { id: menyu },
          data: { avg_reytig: Avg },
        });
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  @Cron(CronExpression.EVERY_2ND_MONTH, {
    timeZone: 'Asia/Tashkent',
  })
  async DeletReyting() {
    try {
      const data = await this.prisma.reyting.findMany();

      if (data.length) {
        for (let Reyting of data) {
          await this.prisma.reyting.delete({ where: { id: Reyting.id } });
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  }
}
