import { Controller, Get, Param, Res } from '@nestjs/common';
import { MediaService } from './media.service';
import { Writable } from 'stream';
import { Response } from 'express';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Get(':fileName')
  getFile(
    @Param('fileName') fileName: string,
    @Res() res: Response & Writable,
  ) {
    return this.mediaService.getFile(fileName, res);
  }
}
