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
      port: parseInt(process.env.DATABASE_PORT ?? '5432', 10),
      // port: 5432,
      database: process.env.DATABASE_NAME || 'net_db',
      username: process.env.DATABASE_USER || 'postgres',
      password: process.env.DATABASE_PASSWORD || 'postgres',
      entities: [RssFeed],
      synchronize: true, // Solo para desarrollo
    }),
    RssModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
