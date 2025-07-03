import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { ProjectDataType } from '../types/project-data.types';

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllProjects(
    category?: string,
    status?: string,
    skills?: string[],
    search?: string,
  ): Promise<ProjectDataType[]> {
    const result = await this.prisma.projects.findMany({
      select: {
        id: true,
        name: true,
        githubLink: true,
        link: true,
        text: true,
        importance: true,
        img: true,
        skills: {
          select: {
            name: true,
            importance: true,
          },
          orderBy: {
            importance: 'desc',
          },
        },
        category: {
          select: {
            name: true,
          },
        },
        status: {
          select: {
            name: true,
            img: true,
          },
        },
      },
      where: {
        ...(category && { category: { name: category } }),
        ...(status && {
          status: {
            name: status,
          },
        }),
        ...(skills &&
          skills.length > 0 && {
            skills: {
              some: {
                name: {
                  in: skills,
                },
              },
            },
          }),
        ...(search && {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { text: { contains: search, mode: 'insensitive' } },
          ],
        }),
      },
      orderBy: {
        importance: 'desc',
      },
    });
    return (result as ProjectDataType[]) || null;
  }

  async getProjectById(id: number): Promise<ProjectDataType> {
    const result = await this.prisma.projects.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        githubLink: true,
        link: true,
        text: true,
        importance: true,
        img: true,
        skills: {
          select: {
            name: true,
            importance: true,
          },
          orderBy: {
            importance: 'desc',
          },
        },
        category: {
          select: {
            name: true,
          },
        },
        status: {
          select: {
            name: true,
            img: true,
          },
        },
      },
    });
    return (result as ProjectDataType) || null;
  }
}
