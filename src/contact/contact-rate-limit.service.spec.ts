import {HttpException, HttpStatus} from '@nestjs/common';
import {ContactRateLimitService} from './contact-rate-limit.service';

describe('ContactRateLimitService', () => {
  it('blocks the sixth request from the same IP within 15 minutes', () => {
    const limiter = new ContactRateLimitService();

    for (let request = 0; request < 5; request += 1) {
      limiter.check('203.0.113.10', request);
    }

    try {
      limiter.check('203.0.113.10', 5);
      throw new Error('Expected rate limiter to reject the request');
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect((error as HttpException).getStatus()).toBe(
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }
  });

  it('allows requests again after the window expires', () => {
    const limiter = new ContactRateLimitService();

    for (let request = 0; request < 5; request += 1) {
      limiter.check('203.0.113.10', request);
    }

    expect(() => limiter.check('203.0.113.10', 15 * 60 * 1000 + 1)).not.toThrow();
  });
});
