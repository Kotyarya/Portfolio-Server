import {Injectable} from '@nestjs/common';
import {BlocksService} from '../blocks/blocks.service';
import {ProjectsService} from '../projects/projects.service';
import {SkillsService} from '../skills/skills.service';
import {PagesEnum} from '../types/pages-enum.types';
import {buildSuccessResponse} from '../common/buildSuccessResponse';

@Injectable()
export class HomeService {
  constructor(
    private readonly blocksService: BlocksService,
    private readonly projectsService: ProjectsService,
    private readonly skillsService: SkillsService,
  ) {}

  async getHome() {
    const [hero, contactMe, projects, projectsPreview, skillsPreview, skills, aboutMe] = await Promise.all([
      this.blocksService.getBlockData(PagesEnum.HERO_BLOCK),
      this.blocksService.getBlockData(PagesEnum.CONTACT_ME_BLOCK),
      this.projectsService.getAllProjects(),
      this.blocksService.getBlockData(PagesEnum.PROJECTS_PREVIEW_BLOCK),
      this.blocksService.getBlockData(PagesEnum.SKILLS_PREVIEW_BLOCK),
      this.skillsService.getAllSkills(),
      this.blocksService.getBlockData(PagesEnum.ABOUT_ME_BLOCK),
    ]);

    return buildSuccessResponse({
      hero: hero.data,
      aboutMe: aboutMe.data,
      skills: skills.data,
      skillsPreview: skillsPreview.data,
      projects: projects.data,
      projectsPreview: projectsPreview.data,
      contactMe: contactMe.data,
    });
  }
}
