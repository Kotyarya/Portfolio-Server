import {HealthController} from './health.controller';

describe('HealthController', () => {
  it('returns a small readiness response without secrets', () => {
    const response = new HealthController().getHealth();

    expect(response.status).toBe('ok');
    expect(response.timestamp).toEqual(expect.any(String));
    expect(response).not.toHaveProperty('environment');
    expect(response).not.toHaveProperty('databaseUrl');
  });
});
