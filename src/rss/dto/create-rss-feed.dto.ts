import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateRssFeedDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  imageUrl: string;

  @IsString()
  @IsNotEmpty()
  imageTitle: string;

  @IsString()
  @IsNotEmpty()
  imageLink: string;

  @IsString()
  @IsNotEmpty()
  link: string;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsString()
  @IsOptional()
  route?: string;
} 