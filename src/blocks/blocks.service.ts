import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { GeneralBlockDataType } from '../types/block-data.types';
import { PagesEnum } from '../types/pages-enum.types';

@Injectable()
export class BlocksService {
  constructor(private readonly prisma: PrismaService) {}

  async getBlockData(blockType: PagesEnum): Promise<GeneralBlockDataType> {
    const result = await this.prisma.blocks.findFirst({
      where: {
        block_type: blockType,
      },
      select: {
        data: true,
      },
    });

    return (result?.data as GeneralBlockDataType) || null;
  }
}
