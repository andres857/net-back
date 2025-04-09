import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RssController } from './rss.controller';
import { RssService } from './rss.service';
import { RssFeed } from './entities/rss-feed.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RssFeed])],
  controllers: [RssController],
  providers: [RssService],
  exports: [RssService],
})
export class RssModule {} 