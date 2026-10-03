import {Module} from '@nestjs/common';
import {BlocksModule} from '../blocks/blocks.module';
import {ProjectsModule} from '../projects/projects.module';
import {SkillsModule} from '../skills/skills.module';
import {HomeController} from './home.controller';
import {HomeService} from './home.service';

@Module({
  imports: [BlocksModule, ProjectsModule, SkillsModule],
  controllers: [HomeController],
  providers: [HomeService],
})
export class HomeModule {}
