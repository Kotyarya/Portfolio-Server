import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { ApiKeyGuard } from './api-key.guard';

describe('ApiKeyGuard', () => {
  let reflector: Reflector;

  beforeEach(() => {
    reflector = new Reflector();
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);
  });

  it('rejects a request when the server API key is missing', () => {
    const guard = createGuard(new ConfigService({}), reflector);

    expect(() => guard.canActivate(createContext())).toThrow(
      UnauthorizedException,
    );
  });

  it('rejects a request when the server API key is empty', () => {
    const guard = createGuard(new ConfigService({ API_KEY: '   ' }), reflector);

    expect(() => guard.canActivate(createContext('   '))).toThrow(
      UnauthorizedException,
    );
  });

  it('rejects a request when the client API key is missing', () => {
    const guard = createGuard(
      new ConfigService({ API_KEY: 'valid-key' }),
      reflector,
    );

    expect(() => guard.canActivate(createContext())).toThrow(
      UnauthorizedException,
    );
  });

  it('rejects a request with the wrong API key', () => {
    const guard = createGuard(
      new ConfigService({ API_KEY: 'valid-key' }),
      reflector,
    );

    expect(() => guard.canActivate(createContext('wrong-key'))).toThrow(
      UnauthorizedException,
    );
  });

  it('rejects multiple API key header values', () => {
    const guard = createGuard(
      new ConfigService({ API_KEY: 'valid-key' }),
      reflector,
    );

    expect(() =>
      guard.canActivate(createContext(['valid-key', 'second-key'])),
    ).toThrow(UnauthorizedException);
  });

  it('allows a request with the valid API key', () => {
    const guard = createGuard(
      new ConfigService({ API_KEY: 'valid-key' }),
      reflector,
    );

    expect(guard.canActivate(createContext('valid-key'))).toBe(true);
  });

  it('allows a public route without reading an API key', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(true);
    const configService = new ConfigService({});
    const configSpy = jest.spyOn(configService, 'get');
    const guard = createGuard(configService, reflector);

    expect(guard.canActivate(createContext())).toBe(true);
    expect(configSpy).not.toHaveBeenCalled();
  });
});

function createGuard(
  configService: ConfigService,
  reflector: Reflector,
): ApiKeyGuard {
  return new ApiKeyGuard(configService, reflector);
}

function createContext(apiKey?: string | string[]): ExecutionContext {
  const request = {
    headers: apiKey === undefined ? {} : { 'x-api-key': apiKey },
  } as Request;

  return {
    getClass: jest.fn(),
    getHandler: jest.fn(),
    switchToHttp: () => ({
      getRequest: () => request,
    }),
  } as unknown as ExecutionContext;
}
