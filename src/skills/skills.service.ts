import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { SkillsDataType } from '../types/skills-data.types';
import { buildSuccessResponse } from '../common/buildSuccessResponse';

@Injectable()
export class SkillsService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllSkills(): Promise<{
    status: number;
    message: string;
    data: SkillsDataType[];
  }> {
    const result = await this.prisma.skills.findMany({
      orderBy: {
        importance: 'desc',
      },
    });

    return buildSuccessResponse(result);
  }

  async getSkillById(
    id: number,
  ): Promise<{ status: number; message: string; data: SkillsDataType }> {
    const result = await this.prisma.skills.findUnique({
      where: { id },
    });

    if (!result) {
      throw new NotFoundException(`Skills with id ${id} not found`);
    }

    return buildSuccessResponse(result);
  }
}
