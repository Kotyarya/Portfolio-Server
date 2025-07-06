import { Module } from '@nestjs/common';
import { BlocksModule } from './blocks/blocks.module';
import { MediaModule } from './media/media.module';
import { ProjectsModule } from './projects/projects.module';
import { SkillsModule } from './skills/skills.module';
import { ConfigModule } from '@nestjs/config';
import { ApiKeyGuard } from './common/api-key.guard';
import { ContactModule } from './contact/contact.module';

@Module({
  imports: [
    BlocksModule,
    MediaModule,
    ProjectsModule,
    SkillsModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ContactModule,
  ],
  controllers: [],
  providers: [
    {
      provide: 'APP_GUARD',
      useClass: ApiKeyGuard,
    },
  ],
})
export class AppModule {}
