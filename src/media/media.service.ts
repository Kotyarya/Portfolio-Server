import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { basename, isAbsolute, join, relative, resolve, sep } from 'node:path';
import { createReadStream, existsSync, realpathSync, statSync } from 'node:fs';
import { Writable } from 'node:stream';
import { Response } from 'express';
import { lookup as getMimeType } from 'mime-types';

@Injectable()
export class MediaService {
  private readonly mediaPath = join(__dirname, '..', '..', 'static');

  getFile(fileName: string, res: Response & Writable): void {
    const filePath = this.resolveFilePath(fileName);
    const mimeType = getMimeType(filePath) || 'application/octet-stream';
    const { size } = statSync(filePath);

    res.setHeader('Content-Type', mimeType);
    res.setHeader('Content-Length', size.toString());

    const stream = createReadStream(filePath);
    stream.pipe(res);
  }

  private resolveFilePath(fileName: string): string {
    const decodedFileName = this.decodeFileName(fileName);

    if (
      decodedFileName.length === 0 ||
      decodedFileName === '.' ||
      decodedFileName === '..' ||
      decodedFileName.includes('\0') ||
      decodedFileName.includes('/') ||
      decodedFileName.includes('\\') ||
      basename(decodedFileName) !== decodedFileName
    ) {
      throw new BadRequestException('Invalid file name');
    }

    const mediaRoot = realpathSync(resolve(this.mediaPath));
    const candidatePath = resolve(mediaRoot, decodedFileName);
    this.assertWithinMediaRoot(mediaRoot, candidatePath);

    if (!existsSync(candidatePath)) {
      throw new NotFoundException('File not found');
    }

    const realFilePath = realpathSync(candidatePath);
    this.assertWithinMediaRoot(mediaRoot, realFilePath);

    if (!statSync(realFilePath).isFile()) {
      throw new NotFoundException('File not found');
    }

    return realFilePath;
  }

  private decodeFileName(fileName: string): string {
    let decodedFileName = fileName;

    try {
      for (let pass = 0; pass < 5; pass += 1) {
        const nextValue = decodeURIComponent(decodedFileName);

        if (nextValue === decodedFileName) {
          return decodedFileName;
        }

        decodedFileName = nextValue;
      }
    } catch {
      throw new BadRequestException('Invalid file name');
    }

    throw new BadRequestException('Invalid file name');
  }

  private assertWithinMediaRoot(mediaRoot: string, filePath: string): void {
    const relativePath = relative(mediaRoot, filePath);

    if (
      relativePath === '..' ||
      relativePath.startsWith(`..${sep}`) ||
      isAbsolute(relativePath)
    ) {
      throw new BadRequestException('Invalid file name');
    }
  }
}
