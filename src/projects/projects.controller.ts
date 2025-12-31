import {Controller, Get, Param, ParseIntPipe, Query} from '@nestjs/common';
import {ProjectsService} from './projects.service';

@Controller('projects')
export class ProjectsController {
    constructor(private readonly projectsService: ProjectsService) {
    }

    @Get('/skills')
    getProjectSkills() {
        return this.projectsService.getProjectSkills();
    }

    @Get('/statuses')
    getProjectStatuses() {
        return this.projectsService.getProjectStatuses();
    }

    @Get("/categories")
    getProjectCategories() {
        return this.projectsService.getProjectCategories();
    }

    @Get(':id')
    getProjectById(@Param('id', new ParseIntPipe()) id: number) {
        return this.projectsService.getProjectById(id);
    }

    @Get()
    getProjects(
        @Query('category') category?: string,
        @Query('status') status?: string,
        @Query('skills') skills?: string[],
        @Query('search') search?: string,
    ) {
        return this.projectsService.getAllProjects(
            category,
            status,
            skills,
            search,
        );
    }
}
