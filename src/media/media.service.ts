import { Injectable } from '@nestjs/common';
import { join } from 'path';
import { createReadStream, existsSync } from 'fs';
import { Writable } from 'stream';
import { Response } from 'express';

@Injectable()
export class MediaService {
  private readonly mediaPath = join(__dirname, '..', '..', 'static_media');

  getFile(fileName: string, res: Response & Writable): void {
    const path = join(this.mediaPath, fileName);

    if (!existsSync(path)) {
      res.status(404).send('File not found');
      return;
    }

    const stream = createReadStream(path);
    stream.pipe(res);
  }
}
