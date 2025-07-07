import { Controller, Get, Param } from '@nestjs/common';
import { BlocksService } from './blocks.service';
import { PagesEnum } from '../types/pages-enum.types';

@Controller('blocks')
export class BlocksController {
  constructor(private readonly blocksService: BlocksService) {}

  @Get(':page')
  getBlock(@Param('page') page: PagesEnum) {
    return this.blocksService.getBlockData(page);
  }
}
