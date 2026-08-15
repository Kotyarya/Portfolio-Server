import { validateEnvironment } from './env.validation';

const validConfiguration = {
  API_KEY: 'test-api-key',
  DATABASE_URL: 'postgresql://user:password@localhost:5432/portfolio',
  MAILER_USER: 'owner@example.com',
  MAILER_PASS: 'test-mailer-password',
};

describe('validateEnvironment', () => {
  it.each(Object.keys(validConfiguration))(
    'rejects a missing %s variable',
    (variableName) => {
      const configuration = { ...validConfiguration } as Record<
        string,
        unknown
      >;
      delete configuration[variableName];

      expect(() => validateEnvironment(configuration)).toThrow(variableName);
    },
  );

  it.each(Object.keys(validConfiguration))(
    'rejects an empty %s variable',
    (variableName) => {
      expect(() =>
        validateEnvironment({
          ...validConfiguration,
          [variableName]: '   ',
        }),
      ).toThrow(variableName);
    },
  );

  it('returns a valid configuration unchanged', () => {
    expect(validateEnvironment(validConfiguration)).toBe(validConfiguration);
  });

  it('does not include secret values in its error', () => {
    let validationError: unknown;

    try {
      validateEnvironment({
        ...validConfiguration,
        API_KEY: '',
      });
    } catch (error) {
      validationError = error;
    }

    expect(validationError).toBeInstanceOf(Error);
    expect((validationError as Error).message).toBe(
      'Missing or empty required environment variables: API_KEY',
    );
    expect((validationError as Error).message).not.toContain(
      validConfiguration.MAILER_PASS,
    );
  });
});
