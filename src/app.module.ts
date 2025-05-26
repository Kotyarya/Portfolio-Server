import { Module } from '@nestjs/common';
import { BlocksModule } from './blocks/blocks.module';

@Module({
  imports: [BlocksModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
