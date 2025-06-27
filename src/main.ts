import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const Port = Number(process.env.PORT) || 3000
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(Port, ()=>{
    console.log(`Bot Server started on port ${Port}`);
    
  });
}
bootstrap();
