import { Controller, Get, Post, Body, Patch, Param, Delete, Res } from '@nestjs/common';
import { RssService } from './rss.service';
import { CreateRssFeedDto } from './dto/create-rss-feed.dto';
import { UpdateRssFeedDto } from './dto/update-rss-feed.dto';
import { Response } from 'express';

@Controller('rss')
export class RssController {
  constructor(private readonly rssService: RssService) {}

  @Post()
  create(@Body() createRssFeedDto: CreateRssFeedDto) {
    console.log(createRssFeedDto);
    return this.rssService.create(createRssFeedDto);
  }

  @Get()
  findAll() {
    return this.rssService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rssService.findOne(+id);
  }

  @Get('feed/:route')
  async getFeedByRoute(@Param('route') route: string, @Res() res: Response) {
    const rssFeed = await this.rssService.findByRoute(route);
    const xml = this.rssService.generateXml(rssFeed);
    res.header('Content-Type', 'application/xml');
    return res.send(xml);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRssFeedDto: UpdateRssFeedDto) {
    return this.rssService.update(+id, updateRssFeedDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rssService.remove(+id);
  }
} 