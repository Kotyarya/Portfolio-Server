import type {NextFunction, Request, Response} from 'express';

const API_CSP = [
  "default-src 'none'",
  "base-uri 'none'",
  "form-action 'none'",
  "frame-ancestors 'none'",
].join('; ');

export const securityHeaders = (
  _request: Request,
  response: Response,
  next: NextFunction,
) => {
  response.setHeader('Content-Security-Policy', API_CSP);
  response.setHeader(
    'Strict-Transport-Security',
    'max-age=63072000; includeSubDomains; preload',
  );
  response.setHeader('X-Content-Type-Options', 'nosniff');
  response.setHeader('X-Frame-Options', 'DENY');
  response.setHeader('Referrer-Policy', 'no-referrer');
  response.setHeader(
    'Permissions-Policy',
    'camera=(), geolocation=(), microphone=()',
  );
  response.removeHeader('X-Powered-By');
  next();
};
