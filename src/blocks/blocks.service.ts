import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { GeneralBlockDataType } from '../types/block-data.types';
import { PagesEnum } from '../types/pages-enum.types';
import { buildSuccessResponse } from '../common/buildSuccessResponse';

@Injectable()
export class BlocksService {
  constructor(private readonly prisma: PrismaService) {}

  async getBlockData(
    blockType: PagesEnum,
  ): Promise<{ status: number; message: string; data: GeneralBlockDataType }> {
    const result = await this.prisma.blocks.findFirst({
      where: {
        block_type: blockType,
      },
      select: {
        data: true,
      },
    });

    if (!result) {
      throw new NotFoundException(`Block with type |${blockType}| not found`);
    }
    return buildSuccessResponse(result.data as GeneralBlockDataType);
  }
}
