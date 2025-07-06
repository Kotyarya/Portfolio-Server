import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { SkillsDataType } from '../types/skills-data.types';

@Injectable()
export class SkillsService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllSkills(): Promise<SkillsDataType[]> {
    const result = await this.prisma.skills.findMany({
      orderBy: {
        importance: 'desc',
      },
    });

    return (result as SkillsDataType[]) || null;
  }

  async getSkillById(id: number): Promise<SkillsDataType | null> {
    const result = await this.prisma.skills.findUnique({
      where: { id },
    });

    return (result as SkillsDataType) || null;
  }
}
