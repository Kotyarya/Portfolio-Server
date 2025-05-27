import { Module } from '@nestjs/common';
import { BlocksModule } from './blocks/blocks.module';
import { PrismaService } from './prisma.service';

@Module({
  imports: [BlocksModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
