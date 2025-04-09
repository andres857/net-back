import { PartialType } from '@nestjs/mapped-types';
import { CreateRssFeedDto } from './create-rss-feed.dto';

export class UpdateRssFeedDto extends PartialType(CreateRssFeedDto) {} 