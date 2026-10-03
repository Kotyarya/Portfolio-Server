import {ValidationPipe} from '@nestjs/common';
import type {ArgumentMetadata} from '@nestjs/common';
import {ContactDto} from './contact.dto';
import {validationPipeOptions} from '../common/validation.pipe';

const metadata: ArgumentMetadata = {
  type: 'body',
  metatype: ContactDto,
  data: undefined,
};

describe('ContactDto validation', () => {
  const pipe = new ValidationPipe(validationPipeOptions);

  it('accepts a valid contact message', async () => {
    await expect(
      pipe.transform(
        {name: 'Max', email: 'max@example.com', message: 'Hello'},
        metadata,
      ),
    ).resolves.toBeInstanceOf(ContactDto);
  });

  it('rejects unknown fields and oversized messages', async () => {
    await expect(
      pipe.transform(
        {
          name: 'Max',
          email: 'max@example.com',
          message: 'x'.repeat(5001),
          isAdmin: true,
        },
        metadata,
      ),
    ).rejects.toBeDefined();
  });
});
