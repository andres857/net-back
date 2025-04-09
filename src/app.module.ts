import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RssModule } from './rss/rss.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RssFeed } from './rss/entities/rss-feed.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST || 'localhost',
      // port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
      port: 5411,
      username: process.env.DATABASE_USER || 'postgres',
      password: process.env.DATABASE_PASSWORD || 'postgres',
      database: process.env.DATABASE_NAME || 'postgres',
      entities: [RssFeed],
      synchronize: true, // Solo para desarrollo
    }),
    RssModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
