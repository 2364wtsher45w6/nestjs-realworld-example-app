import { HttpException, BadRequestException } from '@nestjs/common';
import { ValidationPipe } from './validation.pipe';
import { LoginUserDto } from '../../user/dto/login-user.dto';

describe('ValidationPipe', () => {
  let pipe: ValidationPipe;

  beforeEach(() => {
    pipe = new ValidationPipe();
  });

  it('passes a valid payload through plainToClass + validate', async () => {
    const value = { email: 'user@example.com', password: 'secret' };
    const result = await pipe.transform(value, { metatype: LoginUserDto } as any);
    expect(result).toBe(value);
  });

  it('throws when the payload fails class-validator decorators', async () => {
    const value = { email: '', password: '' };
    await expect(
      pipe.transform(value, { metatype: LoginUserDto } as any),
    ).rejects.toThrow(HttpException);
  });

  it('skips validation for primitive metatypes', async () => {
    const value = 'just-a-string';
    const result = await pipe.transform(value, { metatype: String } as any);
    expect(result).toBe(value);
  });

  it('rejects an empty value before validation', async () => {
    await expect(
      pipe.transform(undefined, { metatype: LoginUserDto } as any),
    ).rejects.toThrow(BadRequestException);
  });
});
