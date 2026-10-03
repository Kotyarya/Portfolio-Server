import { Module } from '@nestjs/common';
import { ContactService } from './contact.service';
import { ContactController } from './contact.controller';
import { PrismaService } from '../prisma.service';
import {ContactRateLimitService} from './contact-rate-limit.service';

@Module({
  controllers: [ContactController],
  providers: [ContactService, ContactRateLimitService, PrismaService],
})
export class ContactModule {}
