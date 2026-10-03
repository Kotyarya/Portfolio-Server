import {HttpException, HttpStatus, Injectable} from '@nestjs/common';

const WINDOW_MS = 15 * 60 * 1000;
const MAX_REQUESTS = 5;

@Injectable()
export class ContactRateLimitService {
  private readonly attempts = new Map<string, number[]>();

  check(ipAddress: string, now = Date.now()): void {
    const windowStart = now - WINDOW_MS;
    const recentAttempts = (this.attempts.get(ipAddress) ?? []).filter(
      (timestamp) => timestamp > windowStart,
    );

    if (recentAttempts.length >= MAX_REQUESTS) {
      throw new HttpException(
        'Too many messages. Please try again in 15 minutes.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    recentAttempts.push(now);
    this.attempts.set(ipAddress, recentAttempts);
  }
}
