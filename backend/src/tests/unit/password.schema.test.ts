import { registerBodySchema } from '../../schemas/request/auth.request.schema.js';
import { PASSWORD_POLICY_MESSAGE, strongPasswordSchema } from '../../schemas/password.schema.js';

describe('password validation', () => {
  it('accepts a password that meets the policy', () => {
    expect(strongPasswordSchema.safeParse('Password1!').success).toBe(true);
  });

  it('rejects passwords shorter than 8 characters', () => {
    const result = strongPasswordSchema.safeParse('Pass1!');

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe(PASSWORD_POLICY_MESSAGE);
    }
  });

  it('rejects passwords without an uppercase letter', () => {
    expect(strongPasswordSchema.safeParse('password1!').success).toBe(false);
  });

  it('rejects passwords without a lowercase letter', () => {
    expect(strongPasswordSchema.safeParse('PASSWORD1!').success).toBe(false);
  });

  it('rejects passwords without a number from 1-9', () => {
    expect(strongPasswordSchema.safeParse('Password!').success).toBe(false);
    expect(strongPasswordSchema.safeParse('Password0!').success).toBe(false);
  });

  it('rejects passwords without a supported special character', () => {
    expect(strongPasswordSchema.safeParse('Password12').success).toBe(false);
  });

  it('validates register request bodies with the same policy', () => {
    const result = registerBodySchema.safeParse({
      name: 'Test User',
      email: 'test@example.com',
      password: 'weak',
    });

    expect(result.success).toBe(false);
  });
});
