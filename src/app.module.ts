import { Module } from '@nestjs/common';
import { BlocksModule } from './blocks/blocks.module';
import { MediaModule } from './media/media.module';
import { ProjectsModule } from './projects/projects.module';
import { SkillsModule } from './skills/skills.module';

@Module({
  imports: [BlocksModule, MediaModule, ProjectsModule, SkillsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
