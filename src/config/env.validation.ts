const REQUIRED_ENVIRONMENT_VARIABLES = [
  'API_KEY',
  'DATABASE_URL',
  'MAILER_USER',
  'MAILER_PASS',
] as const;

export function validateEnvironment(
  configuration: Record<string, unknown>,
): Record<string, unknown> {
  const missingVariables = REQUIRED_ENVIRONMENT_VARIABLES.filter((key) => {
    const value = configuration[key];
    return typeof value !== 'string' || value.trim().length === 0;
  });

  if (missingVariables.length > 0) {
    throw new Error(
      `Missing or empty required environment variables: ${missingVariables.join(', ')}`,
    );
  }

  return configuration;
}
