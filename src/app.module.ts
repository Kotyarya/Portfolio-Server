import { Module } from '@nestjs/common';
import { BlocksModule } from './blocks/blocks.module';
import { MediaModule } from './media/media.module';

@Module({
  imports: [BlocksModule, MediaModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
