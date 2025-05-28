import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { StartPageData } from '../types/block-data.types';

@Injectable()
export class BlocksService {
  constructor(private readonly prisma: PrismaService) {}

  async getStartPage(): Promise<StartPageData> {
    const result = await this.prisma.blocks.findFirst({
      where: {
        block_type: 'start_page',
      },
      select: {
        data: true,
      },
    });

    return (result?.data as StartPageData) || null;
  }
}
