import {Injectable, NotFoundException} from '@nestjs/common';
import {PrismaService} from '../prisma.service';
import {ProjectDataType} from '../types/project-data.types';
import {buildSuccessResponse} from '../common/buildSuccessResponse';

@Injectable()
export class ProjectsService {
    constructor(private readonly prisma: PrismaService) {
    }

    async getAllProjects(
        category?: string,
        status?: string,
        skills?: string[],
        search?: string,
    ): Promise<{ status: number; message: string; data: ProjectDataType[] }> {

        console.log(skills)

        const result = await this.prisma.projects.findMany({
            select: {
                id: true,
                name: true,
                githubLink: true,
                link: true,
                text: true,
                preview: true,
                importance: true,
                img: {
                    select: {img: true},
                },
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
                ...(category && {category: {name: category}}),
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
                        {name: {contains: search, mode: 'insensitive'}},
                        {text: {contains: search, mode: 'insensitive'}},
                    ],
                }),
            },
            orderBy: {
                importance: 'desc',
            },
        });

        const formatted = result.map(project => ({
            ...project,
            img: project.img.map(i => i.img),
            images: undefined, // убираем старое поле
        }));

        return buildSuccessResponse(formatted);
    }

    async getProjectById(
        id: number,
    ): Promise<{ status: number; message: string; data: ProjectDataType }> {
        const result = await this.prisma.projects.findUnique({
            where: {id},
            select: {
                id: true,
                name: true,
                githubLink: true,
                link: true,
                text: true,
                preview: true,
                importance: true,
                img: {
                    select: {img: true},
                },
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
        if (!result) {
            throw new NotFoundException(`Project with id ${id} not found`);
        }

        const formatted = {
            ...result,
            img: result.img.map(i => i.img),
            images: undefined,
        };

        return buildSuccessResponse(formatted);
    }

    async getProjectSkills(): Promise<{
        status: number;
        message: string;
        data: { name: string; importance: number }[]
    }> {
        const result = await this.prisma.projects.findMany({
            select: {
                skills: {
                    select: {
                        name: true,
                        importance: true,
                    }
                }
            },
        });

        const allSkills = result.flatMap(project => project.skills);

        const uniqueSkills = Array.from(
            new Map(allSkills.map(skill => [skill.name, skill])).values()
        );

        uniqueSkills.sort((a, b) => b.importance - a.importance);


        return buildSuccessResponse(uniqueSkills);
    }

    async getProjectStatuses(): Promise<{
        status: number;
        message: string;
        data: any
    }> {
        const result = await this.prisma.projects_status.findMany({
            select: {
                name: true,
            },
        });

        return buildSuccessResponse(result);
    }

    async getProjectCategories(): Promise<{
        status: number;
        message: string;
        data: any
    }> {
        const result = await this.prisma.projects_category.findMany({
            select: {
                name: true,
            },
        });

        return buildSuccessResponse(result);
    }
}
