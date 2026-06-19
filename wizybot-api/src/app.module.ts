import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatModule } from './chat/chat.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    // This loads your .env file automatically throughout the application
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ChatModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
