import { Module } from '@nestjs/common';
import { BlocksModule } from './blocks/blocks.module';
import { MediaModule } from './media/media.module';
import { ProjectsModule } from './projects/projects.module';

@Module({
  imports: [BlocksModule, MediaModule, ProjectsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
