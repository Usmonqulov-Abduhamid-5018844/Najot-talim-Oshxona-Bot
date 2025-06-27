import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AutoLoudController } from './auto-loud.controller';

@Module({
  imports: [ScheduleModule.forRoot()],
  controllers: [AutoLoudController],
})
export class AutoLoudModule {}
