import { Controller } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from 'src/prisma/prisma.service';

@Controller('auto-loud')
export class AutoLoudController {
  constructor(private readonly prisma: PrismaService) {}

  @Cron(CronExpression.EVERY_30_MINUTES, {
    timeZone: 'Asia/Tashkent',
  })
  async avg_Reyting() {
    try {
      const result = await this.prisma.reyting.groupBy({
        by: ['menyu_id'],
        _avg: { ball: true },
      });

      const allMenyular = await this.prisma.menyu.findMany({
        select: { id: true },
      });
  
      const reytingMap = new Map<number, number>();
      result.forEach((item) => {
        const avg = item._avg.ball ?? 0;
        reytingMap.set(item.menyu_id, parseFloat(avg.toFixed(1)));
      });
  
      const updates = allMenyular.map((menyu) => {
        const avg = reytingMap.get(menyu.id) ?? 0;
        return this.prisma.menyu.update({
          where: { id: menyu.id },
          data: { avg_reytig: avg },
        });
      });
  
      await this.prisma.$transaction(updates);
    } catch (error) {
      console.error('❌ Xatolik:', error.message);
    }
  }
  

  @Cron('0 9 * * *', {
    timeZone: 'Asia/Tashkent',
  })
  async DeletReyting() {
    try {
      await this.prisma.reyting.deleteMany();
    } catch (error) {
      console.log(error.message);
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT, {
    timeZone: 'Asia/Tashkent',
  })
  async Saralanganlar() {
    try {
      await this.prisma.bugun.deleteMany();
    } catch (error) {
      console.log(error.message);
    }
  }
}
