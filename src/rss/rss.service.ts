import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RssFeed } from './entities/rss-feed.entity';
import { CreateRssFeedDto } from './dto/create-rss-feed.dto';
import { UpdateRssFeedDto } from './dto/update-rss-feed.dto';

@Injectable()
export class RssService {
  constructor(
    @InjectRepository(RssFeed)
    private rssFeedRepository: Repository<RssFeed>,
  ) {}

  async create(createRssFeedDto: CreateRssFeedDto) {
    // Generar una ruta única basada en el título
    const baseRoute = createRssFeedDto.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    
    // Buscar todas las rutas que coincidan con el patrón baseRoute-*
    const existingRoutes = await this.rssFeedRepository
      .createQueryBuilder('rss')
      .where('rss.route LIKE :pattern', { pattern: `${baseRoute}%` })
      .getMany();

    // Si no hay rutas existentes, usar la baseRoute
    if (existingRoutes.length === 0) {
      const rssFeed = this.rssFeedRepository.create({
        ...createRssFeedDto,
        route: baseRoute,
      });
      return await this.rssFeedRepository.save(rssFeed);
    }

    // Encontrar el número más alto usado en las rutas existentes
    const maxNumber = existingRoutes.reduce((max, feed) => {
      const match = feed.route.match(new RegExp(`${baseRoute}-(\\d+)$`));
      if (match) {
        const num = parseInt(match[1], 10);
        return num > max ? num : max;
      }
      return max;
    }, 0);

    // Crear nueva ruta con el siguiente número
    const rssFeed = this.rssFeedRepository.create({
      ...createRssFeedDto,
      route: `${baseRoute}-${maxNumber + 1}`,
    });
    
    return await this.rssFeedRepository.save(rssFeed);
  }

  async findAll() {
    return await this.rssFeedRepository.find();
  }

  async findOne(id: number) {
    const rssFeed = await this.rssFeedRepository.findOne({ where: { id } });
    if (!rssFeed) {
      throw new NotFoundException(`RSS feed with ID ${id} not found`);
    }
    return rssFeed;
  }

  async findByRoute(route: string) {
    const rssFeed = await this.rssFeedRepository.findOne({ where: { route } });
    if (!rssFeed) {
      throw new NotFoundException(`RSS feed with route ${route} not found`);
    }
    return rssFeed;
  }

  async update(id: number, updateRssFeedDto: UpdateRssFeedDto) {
    const rssFeed = await this.findOne(id);
    
    // Si se actualiza el título, actualizar la ruta
    if (updateRssFeedDto.title && updateRssFeedDto.title !== rssFeed.title) {
      const baseRoute = updateRssFeedDto.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      
      // Buscar todas las rutas que coincidan con el patrón baseRoute-*
      const existingRoutes = await this.rssFeedRepository
        .createQueryBuilder('rss')
        .where('rss.route LIKE :pattern', { pattern: `${baseRoute}%` })
        .getMany();

      // Si no hay rutas existentes, usar la baseRoute
      if (existingRoutes.length === 0) {
        updateRssFeedDto.route = baseRoute;
      } else {
        // Encontrar el número más alto usado en las rutas existentes
        const maxNumber = existingRoutes.reduce((max, feed) => {
          const match = feed.route.match(new RegExp(`${baseRoute}-(\\d+)$`));
          if (match) {
            const num = parseInt(match[1], 10);
            return num > max ? num : max;
          }
          return max;
        }, 0);

        // Crear nueva ruta con el siguiente número
        updateRssFeedDto.route = `${baseRoute}-${maxNumber + 1}`;
      }
    }
    
    Object.assign(rssFeed, updateRssFeedDto);
    return await this.rssFeedRepository.save(rssFeed);
  }

  async remove(id: number) {
    const rssFeed = await this.findOne(id);
    return await this.rssFeedRepository.remove(rssFeed);
  }

  generateXml(rssFeed: RssFeed) {
    const now = new Date();
    return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:slash="http://purl.org/rss/1.0/modules/slash/">
<channel>
  <title>${rssFeed.title}</title>
  <description>${rssFeed.description}</description>
  <image>
    <url>${rssFeed.imageUrl}</url>
    <title>${rssFeed.imageTitle}</title>
    <link>${rssFeed.imageLink}</link>
  </image>
  <pubDate>${now.toUTCString()}</pubDate>
  <lastBuildDate>${now.toUTCString()}</lastBuildDate>
  <generator>RSS Feed Generator</generator>
  <link>${rssFeed.link}</link>
  <category>${rssFeed.category}</category>
  <atom:link rel="self" type="application/rss+xml" href="${rssFeed.link}"/>
</channel>
</rss>`;
  }
} 