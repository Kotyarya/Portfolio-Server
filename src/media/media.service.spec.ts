import { BadRequestException, NotFoundException } from '@nestjs/common';
import { mkdtempSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { PassThrough, Writable } from 'node:stream';
import { finished } from 'node:stream/promises';
import { Response } from 'express';
import { MediaService } from './media.service';

describe('MediaService', () => {
  let mediaPath: string;
  let service: MediaService;

  beforeEach(() => {
    mediaPath = mkdtempSync(join(tmpdir(), 'portfolio-media-'));
    service = new MediaService();
    Object.defineProperty(service, 'mediaPath', { value: mediaPath });
  });

  afterEach(() => {
    rmSync(mediaPath, { recursive: true, force: true });
  });

  it('streams a regular file from the media directory', async () => {
    writeFileSync(join(mediaPath, 'profile.txt'), 'portfolio');
    const response = new PassThrough() as PassThrough & Response & Writable;
    const setHeader = jest.fn();
    const chunks: Buffer[] = [];
    response.setHeader = setHeader;
    response.on('data', (chunk: Buffer) => chunks.push(Buffer.from(chunk)));

    service.getFile('profile.txt', response);
    await finished(response);

    expect(Buffer.concat(chunks).toString()).toBe('portfolio');
    expect(setHeader).toHaveBeenCalledWith('Content-Type', 'text/plain');
    expect(setHeader).toHaveBeenCalledWith('Content-Length', '9');
  });

  it.each([
    '../secret.txt',
    '..\\secret.txt',
    '..%2Fsecret.txt',
    '%2e%2e%2fsecret.txt',
    '%252e%252e%252fsecret.txt',
    '%00secret.txt',
  ])('rejects an unsafe file name: %s', (fileName) => {
    expect(() => service.getFile(fileName, createResponse())).toThrow(
      BadRequestException,
    );
  });

  it('rejects a symlink that resolves outside the media directory', () => {
    const outsidePath = join(mediaPath, '..', 'portfolio-secret.txt');
    writeFileSync(outsidePath, 'secret');
    symlinkSync(outsidePath, join(mediaPath, 'link.txt'));

    try {
      expect(() => service.getFile('link.txt', createResponse())).toThrow(
        BadRequestException,
      );
    } finally {
      rmSync(outsidePath, { force: true });
    }
  });

  it('returns not found for a missing file', () => {
    expect(() => service.getFile('missing.txt', createResponse())).toThrow(
      NotFoundException,
    );
  });
});

function createResponse(): Response & Writable {
  const response = new PassThrough() as PassThrough & Response & Writable;
  response.setHeader = jest.fn();
  return response;
}
