import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class BlocksService {
  constructor(private readonly prisma: PrismaService) {}

  getStartPage(): any {
    return this.prisma.blocks.findFirst({
      where: {
        block_type: 'start_page',
      },
      select: {
        data: true,
      },
    });
  }
}
